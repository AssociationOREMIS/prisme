<script setup lang="ts">
import { provide } from 'vue'
import { ToastProvider, ToastViewport } from 'reka-ui'
import { prToastProviderKey } from './context'
import { usePrMessages } from '../../../i18n/context'
import { warnDeprecated } from '../../deprecation'

export interface PrToastProviderProps {
  duration?: number
  /** Name for screen readers (the element shows no text of its own). */
  ariaLabel?: string
  /** @deprecated Use `ariaLabel` (`aria-label`) instead: `label` is for visible text. Removed in 1.0. */
  label?: string
  swipeDirection?: 'right' | 'left' | 'up' | 'down'
  swipeThreshold?: number
}

const props = withDefaults(defineProps<PrToastProviderProps>(), {
  duration: 5000,
  ariaLabel: undefined,
  label: undefined,
  swipeDirection: 'right',
  swipeThreshold: 50,
})

if (props.label !== undefined) warnDeprecated('PrToastProvider', 'label', 'aria-label')

const messages = usePrMessages()

provide(prToastProviderKey, true)
</script>

<template>
  <ToastProvider
    :duration="duration"
    :label="ariaLabel ?? label ?? messages.toast.label"
    :swipe-direction="swipeDirection"
    :swipe-threshold="swipeThreshold"
  >
    <slot />
    <ToastViewport class="pr-toast__viewport pr:fixed pr:left-0 pr:right-0 pr:top-0 pr:z-[100] pr:m-0 pr:flex pr:max-h-screen pr:w-full pr:list-none pr:flex-col-reverse pr:gap-[var(--pr-space-3)] pr:p-[var(--pr-space-4)] pr:sm:bottom-0 pr:sm:left-auto pr:sm:right-0 pr:sm:top-auto pr:sm:w-[min(26.25rem,calc(100vw-var(--pr-space-8)))] pr:sm:flex-col" />
  </ToastProvider>
</template>
