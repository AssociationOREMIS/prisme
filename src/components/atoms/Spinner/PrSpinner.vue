<script setup lang="ts">
import { computed } from 'vue'
import { usePrMessages } from '../../../i18n/context'

export interface PrSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  /** Name for screen readers (the element shows no text of its own). */
  ariaLabel?: string
}

const props = withDefaults(defineProps<PrSpinnerProps>(), {
  size: 'md',
  ariaLabel: undefined,
})

const messages = usePrMessages()

const spinnerSizeClass: Record<NonNullable<PrSpinnerProps['size']>, string> = {
  sm: 'pr:size-[0.875rem]',
  md: 'pr:size-5',
  lg: 'pr:size-7 pr:border-[3px]',
}

const spinnerClass = computed(() => [
  'pr-spinner pr:inline-block pr:size-4 pr:rounded-[var(--pr-radius-full)] pr:border-2 pr:border-current pr:border-r-transparent pr:align-[-0.125em] pr:animate-spin pr:[animation-duration:720ms]',
  spinnerSizeClass[props.size],
])
</script>

<template>
  <span
    :class="spinnerClass"
    role="status"
    :aria-label="ariaLabel ?? messages.common.loading"
  />
</template>
