<script setup lang="ts">
import { provide } from 'vue'
import { ToastProvider, ToastViewport } from 'reka-ui'
import { prToastProviderKey } from './context'

export interface PrToastProviderProps {
  duration?: number
  label?: string
  swipeDirection?: 'right' | 'left' | 'up' | 'down'
  swipeThreshold?: number
}

withDefaults(defineProps<PrToastProviderProps>(), {
  duration: 5000,
  label: 'Notification',
  swipeDirection: 'right',
  swipeThreshold: 50,
})

provide(prToastProviderKey, true)
</script>

<template>
  <ToastProvider
    :duration="duration"
    :label="label"
    :swipe-direction="swipeDirection"
    :swipe-threshold="swipeThreshold"
  >
    <slot />
    <ToastViewport class="pr-toast__viewport fixed left-0 right-0 top-0 z-[100] m-0 flex max-h-screen w-full list-none flex-col-reverse gap-[var(--pr-space-3)] p-[var(--pr-space-4)] sm:bottom-0 sm:left-auto sm:right-0 sm:top-auto sm:w-[min(26.25rem,calc(100vw-var(--pr-space-8)))] sm:flex-col" />
  </ToastProvider>
</template>
