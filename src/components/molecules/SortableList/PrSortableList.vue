<script setup lang="ts" generic="T">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, useId, watch } from 'vue'
import { GripVertical } from '@lucide/vue'
import { usePrMessages } from '../../../i18n/context'
import {
  cancelDrag,
  currentPosition,
  dragState,
  finishDrag,
  joinGroup,
  leaveGroup,
  listsInGroup,
  moveTo,
  startDrag,
  step,
  type PrSortableListChange,
  type SortableListHandle,
} from './sortable'

export interface PrSortableListProps<T> {
  /** The items, in order. With `v-model`, the list follows it; without, it starts from `defaultValue`. */
  modelValue?: T[]
  /** Starting items of a list not bound by `v-model` (a Blade form). */
  defaultValue?: T[]
  /** Field (or function) giving each item a unique key. Defaults to `id`. */
  itemKey?: string | ((item: T) => string | number)
  /** Field (or function) naming an item for screen readers. Defaults to `label`, `title`, `name`, then the key. */
  itemLabel?: string | ((item: T) => string)
  /** Lists sharing a group trade items: drag one from a list to another, or past the end of a list with the keyboard. */
  group?: string
  /** Given back in `change` (`from`, `to`), to know which list an item left and joined. */
  listId?: string | number
  /** Posts the keys in their order with the form, as `name[]`. */
  name?: string
  disabled?: boolean
  /** Name of the list, read out when an item arrives in it from the keyboard. */
  ariaLabel?: string
  emptyText?: string
}

const props = withDefaults(defineProps<PrSortableListProps<T>>(), {
  modelValue: undefined,
  defaultValue: undefined,
  itemKey: 'id',
  itemLabel: undefined,
  group: undefined,
  listId: undefined,
  name: undefined,
  disabled: false,
  ariaLabel: undefined,
  emptyText: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [items: T[]]
  change: [change: PrSortableListChange<T>]
}>()

defineSlots<{
  default?: (props: { item: T; index: number; dragging: boolean }) => unknown
  empty?: () => unknown
}>()

const messages = usePrMessages()
const instructionsId = `pr-sortable-${useId()}-instructions`
const root = ref<HTMLElement | null>(null)
const list = ref<HTMLElement | null>(null)
const items = shallowRef<T[]>([...(props.modelValue ?? props.defaultValue ?? [])])
const announcement = ref('')

watch(() => props.modelValue, (value) => {
  if (value !== undefined) {
    items.value = [...value]
  }
})

const field = (item: T, name: string): unknown => (item as Record<string, unknown>)[name]

function keyOf(item: T): string {
  return String(typeof props.itemKey === 'function' ? props.itemKey(item) : field(item, props.itemKey))
}

function labelOf(item: T): string {
  if (typeof props.itemLabel === 'function') {
    return props.itemLabel(item)
  }
  const names = props.itemLabel ? [props.itemLabel] : ['label', 'title', 'name']
  const label = names.map((name) => field(item, name)).find((value) => value !== undefined && value !== null && value !== '')

  return label === undefined ? keyOf(item) : String(label)
}

/** CSS attribute selector of an item, safe whatever its key holds. */
const itemSelector = (key: string) => `[data-pr-sortable-key="${key.replace(/["\\]/g, '\\$&')}"]`

const handle: SortableListHandle = {
  group: () => props.group,
  listId: () => props.listId,
  name: () => props.ariaLabel,
  element: () => root.value,
  items: () => items.value,
  keyOf: (item) => keyOf(item as T),
  setItems: (next) => {
    items.value = next as T[]
    emit('update:modelValue', next as T[])
  },
  emitChange: (change) => emit('change', change as PrSortableListChange<T>),
  dropIndex: (clientY, draggedKey) => {
    const others = [...(list.value?.children ?? [])].filter((element) => (element as HTMLElement).dataset.prSortableKey !== draggedKey)
    const index = others.findIndex((element) => {
      const rect = element.getBoundingClientRect()
      return clientY < rect.top + rect.height / 2
    })

    return index === -1 ? others.length : index
  },
  focusHandle: (key) => {
    void nextTick(() => root.value?.querySelector<HTMLElement>(`${itemSelector(key)} .pr-sortable-list__handle`)?.focus())
  },
  announce: (text) => {
    announcement.value = text
  },
}

onMounted(() => joinGroup(handle))
onBeforeUnmount(() => {
  stopPointerDrag()
  leaveGroup(handle)
})

const draggedKey = computed(() => (dragState.value?.current === handle ? dragState.value.key : null))
const dragMode = computed(() => dragState.value?.mode)
/** A move is under way in this list's group: an empty list shows where to drop. */
const receiving = computed(() => dragState.value !== null && listsInGroup(dragState.value.current).includes(handle))

function announceIn(state: ReturnType<typeof finishDrag>, text: (label: string, position: number, total: number) => string): void {
  if (!state) {
    return
  }
  const listItems = state.current.items()
  const index = listItems.findIndex((item) => state.current.keyOf(item) === state.key)
  state.current.announce(text(labelOf(state.item as T), index + 1, listItems.length))
}

// Keyboard: Space or Enter picks the item up, the arrows move it, Space or Enter drops it, Escape puts it back.
function onKeydown(event: KeyboardEvent, item: T): void {
  if (props.disabled) {
    return
  }
  const state = dragState.value
  const held = state?.mode === 'keyboard' && state.current === handle && state.key === keyOf(item)

  if (!held) {
    if ((event.key === ' ' || event.key === 'Enter') && !state) {
      event.preventDefault()
      startDrag(handle, item, 'keyboard')
      const [index, total] = currentPosition()
      announcement.value = messages.sortableList.grabbed(labelOf(item), index + 1, total)
    }
    return
  }

  switch (event.key) {
    case 'ArrowUp':
    case 'ArrowDown':
      event.preventDefault()
      step(event.key === 'ArrowUp' ? -1 : 1, messages.sortableList)
      break
    case ' ':
    case 'Enter':
      event.preventDefault()
      announceIn(finishDrag(), messages.sortableList.dropped)
      break
    case 'Escape':
      event.preventDefault()
      announceIn(cancelDrag(), (label) => messages.sortableList.cancelled(label))
      break
    case 'Tab':
      announceIn(finishDrag(), messages.sortableList.dropped)
      break
  }
}

// Leaving the grip (a click elsewhere) drops the item where it is. Moving an item re-renders its
// row and focuses its grip again first (focusHandle, on the next tick): only a real departure counts.
function onFocusOut(): void {
  setTimeout(() => {
    const state = dragState.value
    if (state?.mode !== 'keyboard') {
      return
    }
    const active = (state.current.element()?.getRootNode() as Document | ShadowRoot | undefined)?.activeElement
    if (!(active instanceof HTMLElement && active.matches(`${itemSelector(state.key)} .pr-sortable-list__handle`))) {
      announceIn(finishDrag(), messages.sortableList.dropped)
    }
  }, 0)
}

// Pointer (mouse, touch, pen): the row follows the pointer as a floating copy while the item takes
// its new place in the lists below. A press that moves less than 4px stays a click.
let pressed: { item: T; x: number; y: number } | null = null
let overlay: HTMLElement | null = null
let offset = { x: 0, y: 0 }
let pointer = { x: 0, y: 0 }
let scrollFrame = 0
let scrollParent: HTMLElement | null = null
let previousUserSelect: string | null = null

function onPointerDown(event: PointerEvent, item: T): void {
  if (props.disabled || event.button !== 0 || dragState.value) {
    return
  }
  pressed = { item, x: event.clientX, y: event.clientY }
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerCancel)
  window.addEventListener('keydown', onPointerKeydown)
}

function beginPointerDrag(event: PointerEvent, item: T): void {
  const row = root.value?.querySelector<HTMLElement>(itemSelector(keyOf(item)))
  if (!row) {
    return
  }
  const rect = row.getBoundingClientRect()
  offset = { x: event.clientX - rect.left, y: event.clientY - rect.top }

  overlay = row.cloneNode(true) as HTMLElement
  overlay.removeAttribute('data-pr-sortable-key')
  overlay.classList.add('pr-sortable-list__overlay')
  overlay.setAttribute('aria-hidden', 'true')
  // Out of its list, the copy would inherit the text color and font of wherever it is attached.
  const { color, font } = getComputedStyle(row)
  Object.assign(overlay.style, {
    color,
    font,
    position: 'fixed',
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    margin: '0',
    zIndex: '100',
    pointerEvents: 'none',
    boxShadow: 'var(--pr-shadow-md)',
    borderRadius: 'var(--pr-radius-lg)',
    background: 'var(--pr-color-surface)',
  })
  const rootNode = row.getRootNode()
  ;(rootNode instanceof ShadowRoot ? rootNode : document.body).appendChild(overlay)

  scrollParent = findScrollParent(root.value)
  previousUserSelect = document.body.style.userSelect
  document.body.style.userSelect = 'none'
  startDrag(handle, item, 'pointer')
  scrollFrame = requestAnimationFrame(autoScroll)
}

function onPointerMove(event: PointerEvent): void {
  pointer = { x: event.clientX, y: event.clientY }
  if (!dragState.value) {
    if (!pressed || Math.hypot(event.clientX - pressed.x, event.clientY - pressed.y) < 4) {
      return
    }
    beginPointerDrag(event, pressed.item)
  }
  if (dragState.value?.mode !== 'pointer') {
    return
  }
  event.preventDefault()
  if (overlay) {
    overlay.style.left = `${event.clientX - offset.x}px`
    overlay.style.top = `${event.clientY - offset.y}px`
  }
  reposition()
}

/** Move the item to the list under the pointer, at the height of the pointer. */
function reposition(): void {
  const state = dragState.value
  if (!state) {
    return
  }
  const target = listsInGroup(state.current).find((candidate) => {
    const rect = candidate.element()?.getBoundingClientRect()
    return rect && pointer.x >= rect.left && pointer.x <= rect.right && pointer.y >= rect.top - 8 && pointer.y <= rect.bottom + 8
  })
  if (target) {
    moveTo(target, target.dropIndex(pointer.y, state.key))
  }
}

/** Near the top or bottom edge of the window (or of a scrolling container), scroll to reach further items. */
function autoScroll(): void {
  if (dragState.value?.mode !== 'pointer') {
    return
  }
  const edge = 40
  const speed = 12
  let scrolled = false

  if (scrollParent) {
    const rect = scrollParent.getBoundingClientRect()
    if (pointer.y < rect.top + edge && scrollParent.scrollTop > 0) {
      scrollParent.scrollTop -= speed
      scrolled = true
    } else if (pointer.y > rect.bottom - edge && scrollParent.scrollTop + scrollParent.clientHeight < scrollParent.scrollHeight) {
      scrollParent.scrollTop += speed
      scrolled = true
    }
  }
  if (!scrolled && pointer.y < edge) {
    window.scrollBy(0, -speed)
    scrolled = true
  } else if (!scrolled && pointer.y > window.innerHeight - edge) {
    window.scrollBy(0, speed)
    scrolled = true
  }
  if (scrolled) {
    reposition()
  }
  scrollFrame = requestAnimationFrame(autoScroll)
}

function onPointerUp(): void {
  const wasDragging = dragState.value?.mode === 'pointer'
  stopPointerDrag()
  if (wasDragging) {
    finishDrag()
  }
}

function onPointerCancel(): void {
  const wasDragging = dragState.value?.mode === 'pointer'
  stopPointerDrag()
  if (wasDragging) {
    cancelDrag()
  }
}

function onPointerKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && dragState.value?.mode === 'pointer') {
    event.preventDefault()
    onPointerCancel()
  }
}

function stopPointerDrag(): void {
  pressed = null
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerCancel)
  window.removeEventListener('keydown', onPointerKeydown)
  cancelAnimationFrame(scrollFrame)
  overlay?.remove()
  overlay = null
  if (previousUserSelect !== null) {
    document.body.style.userSelect = previousUserSelect
    previousUserSelect = null
  }
  scrollParent = null
}

function findScrollParent(element: HTMLElement | null): HTMLElement | null {
  for (let current = element?.parentElement; current; current = current.parentElement) {
    const { overflowY } = getComputedStyle(current)
    if ((overflowY === 'auto' || overflowY === 'scroll') && current.scrollHeight > current.clientHeight) {
      return current
    }
  }

  return null
}
</script>

<template>
  <div ref="root" class="pr-sortable-list pr:flex pr:flex-col">
    <ul ref="list" class="pr-sortable-list__items pr:m-0 pr:flex pr:list-none pr:flex-col pr:gap-[var(--pr-space-2)] pr:p-0" :aria-label="ariaLabel">
      <li
        v-for="(item, index) in items"
        :key="keyOf(item)"
        :data-pr-sortable-key="keyOf(item)"
        class="pr-sortable-list__item pr:flex pr:items-center pr:gap-[var(--pr-space-2)] pr:rounded-[var(--pr-radius-lg)]"
        :class="{
          'pr-sortable-list__item--dragging pr:opacity-40': draggedKey === keyOf(item) && dragMode === 'pointer',
          'pr-sortable-list__item--held pr:bg-[var(--pr-color-primary-soft)] pr:outline-2 pr:outline-offset-2 pr:outline-[var(--pr-color-primary)]': draggedKey === keyOf(item) && dragMode === 'keyboard',
        }"
      >
        <button
          v-if="!disabled"
          type="button"
          class="pr-sortable-list__handle pr:inline-grid pr:size-8 pr:shrink-0 pr:cursor-grab pr:touch-none pr:place-items-center pr:rounded-[var(--pr-radius-md)] pr:border-0 pr:bg-transparent pr:text-[color:var(--pr-color-text-muted)] pr:hover:bg-[var(--pr-color-surface-subtle)] pr:hover:text-[color:var(--pr-color-text)] pr:active:cursor-grabbing pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]"
          :aria-label="messages.sortableList.handle(labelOf(item))"
          :aria-describedby="instructionsId"
          @pointerdown="onPointerDown($event, item)"
          @keydown="onKeydown($event, item)"
          @focusout="onFocusOut"
        >
          <GripVertical :size="16" aria-hidden="true" />
        </button>
        <div class="pr-sortable-list__content pr:min-w-0 pr:flex-auto">
          <slot :item="item" :index="index" :dragging="draggedKey === keyOf(item)" />
        </div>
      </li>
    </ul>

    <div
      v-if="!items.length"
      class="pr-sortable-list__empty pr:rounded-[var(--pr-radius-lg)] pr:border pr:border-dashed pr:p-[var(--pr-space-4)] pr:text-center pr:text-[length:var(--pr-font-size-sm)] pr:text-[color:var(--pr-color-text-muted)]"
      :class="receiving ? 'pr:border-[var(--pr-color-primary)] pr:bg-[var(--pr-color-primary-soft)]' : 'pr:border-[var(--pr-color-border-strong)]'"
    >
      <slot name="empty">{{ emptyText ?? messages.sortableList.empty }}</slot>
    </div>

    <span :id="instructionsId" class="pr:sr-only">{{ messages.sortableList.instructions }}</span>
    <p class="pr:sr-only" aria-live="assertive">{{ announcement }}</p>

    <template v-if="name">
      <input v-for="item in items" :key="keyOf(item)" type="hidden" :name="`${name}[]`" :value="keyOf(item)">
    </template>
  </div>
</template>
