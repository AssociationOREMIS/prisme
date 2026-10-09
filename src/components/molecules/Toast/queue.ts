import { shallowRef } from 'vue'

export interface PrToastOptions {
  title: string
  description?: string
  variant?: 'neutral' | 'info' | 'success' | 'warning' | 'danger'
  /** Milliseconds before closing. Default 5000, except `danger`: stays until dismissed. */
  duration?: number
  /** Label of a button in the toast, running `onAction`. */
  actionLabel?: string
  onAction?: () => void
}

export interface PrQueuedToast extends PrToastOptions {
  id: number
  open: boolean
}

/** Beyond this, the oldest toasts close: the screen must stay usable during a rush. */
const MAX_OPEN = 4
/** Lets the toast's closing animation play before it leaves the queue. */
const CLOSE_ANIMATION_MS = 200

/** Toasts shown by the page's PrToastProvider, shared by every component of the page. */
export const toastQueue = shallowRef<PrQueuedToast[]>([])
let nextId = 1

export function dismissToast(id: number): void {
  toastQueue.value = toastQueue.value.map(toast => (toast.id === id ? { ...toast, open: false } : toast))
  setTimeout(() => {
    toastQueue.value = toastQueue.value.filter(toast => toast.id !== id)
  }, CLOSE_ANIMATION_MS)
}

export function showToast(options: PrToastOptions): number {
  const id = nextId++
  const open = toastQueue.value.filter(toast => toast.open)
  for (const oldest of open.slice(0, Math.max(0, open.length - MAX_OPEN + 1))) dismissToast(oldest.id)
  toastQueue.value = [...toastQueue.value, { ...options, id, open: true }]
  return id
}

// Only one provider shows the queue, the first one mounted, even with several on the page.
let renderer: symbol | null = null

export function claimToastQueue(owner: symbol): boolean {
  renderer ??= owner
  return renderer === owner
}

export function releaseToastQueue(owner: symbol): void {
  if (renderer === owner) renderer = null
}

/**
 * Shows toasts from code, through the page's `PrToastProvider` (place one in the app's
 * layout): `const { toast } = usePrToast(); toast({ title: 'Bénévole ajouté', variant: 'success' })`.
 * Works outside a component too (a store, an HTTP interceptor).
 */
export function usePrToast() {
  return { toast: showToast, dismiss: dismissToast }
}
