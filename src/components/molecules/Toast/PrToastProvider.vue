<script setup lang="ts">
import { provide } from 'vue'
import { ToastProvider, ToastViewport } from 'reka-ui'
import { prToastProviderKey } from './context'
import { usePrMessages } from '../../../i18n/context'

export interface PrToastProviderProps {
  duration?: number
  label?: string
  swipeDirection?: 'right' | 'left' | 'up' | 'down'
  swipeThreshold?: number
}

withDefaults(defineProps<PrToastProviderProps>(), {
  duration: 5000,
  label: undefined,
  swipeDirection: 'right',
  swipeThreshold: 50,
})

const messages = usePrMessages()

provide(prToastProviderKey, true)
</script>

<template>
  <ToastProvider
    :duration="duration"
    :label="label ?? messages.toast.label"
    :swipe-direction="swipeDirection"
    :swipe-threshold="swipeThreshold"
  >
    <slot />
    <ToastViewport class="pr-toast__viewport pr:fixed pr:left-0 pr:right-0 pr:top-0 pr:z-[100] pr:m-0 pr:flex pr:max-h-screen pr:w-full pr:list-none pr:flex-col-reverse pr:gap-[var(--pr-space-3)] pr:p-[var(--pr-space-4)] pr:sm:bottom-0 pr:sm:left-auto pr:sm:right-0 pr:sm:top-auto pr:sm:w-[min(26.25rem,calc(100vw-var(--pr-space-8)))] pr:sm:flex-col" />
  </ToastProvider>
</template>
