<script setup lang="ts">
import { onBeforeUnmount, provide } from 'vue'
import { ToastProvider, ToastViewport } from 'reka-ui'
import { prToastProviderKey } from './context'
import PrToastContent from './PrToastContent.vue'
import { claimToastQueue, dismissToast, releaseToastQueue, toastQueue } from './queue'
import { usePrMessages } from '../../../i18n/context'

export interface PrToastProviderProps {
  duration?: number
  /** Name for screen readers (the element shows no text of its own). */
  ariaLabel?: string
  swipeDirection?: 'right' | 'left' | 'up' | 'down'
  swipeThreshold?: number
}

withDefaults(defineProps<PrToastProviderProps>(), {
  duration: 5000,
  ariaLabel: undefined,
  swipeDirection: 'right',
  swipeThreshold: 50,
})

const messages = usePrMessages()

provide(prToastProviderKey, true)

// Toasts sent with usePrToast() show here, in the first provider of the page.
const owner = Symbol('pr-toast-provider')
const showsQueue = claimToastQueue(owner)
onBeforeUnmount(() => releaseToastQueue(owner))
</script>

<template>
  <ToastProvider
    :duration="duration"
    :label="ariaLabel ?? messages.toast.label"
    :swipe-direction="swipeDirection"
    :swipe-threshold="swipeThreshold"
  >
    <slot />
    <template v-if="showsQueue">
      <PrToastContent
        v-for="toast in toastQueue"
        :key="toast.id"
        :open="toast.open"
        :title="toast.title"
        :description="toast.description"
        :variant="toast.variant"
        :duration="toast.duration"
        :action-label="toast.actionLabel"
        @update:open="(open) => open || dismissToast(toast.id)"
        @action="toast.onAction?.()"
      />
    </template>
    <ToastViewport class="pr-toast__viewport pr:fixed pr:left-0 pr:right-0 pr:top-0 pr:z-[100] pr:m-0 pr:flex pr:max-h-screen pr:w-full pr:list-none pr:flex-col-reverse pr:gap-[var(--pr-space-3)] pr:p-[var(--pr-space-4)] pr:sm:bottom-0 pr:sm:left-auto pr:sm:right-0 pr:sm:top-auto pr:sm:w-[min(26.25rem,calc(100vw-var(--pr-space-8)))] pr:sm:flex-col" />
  </ToastProvider>
</template>
