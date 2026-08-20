<script setup lang="ts">
import { computed } from 'vue'

export interface PrSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const props = withDefaults(defineProps<PrSpinnerProps>(), {
  size: 'md',
  label: 'Chargement',
})

const spinnerSizeClass: Record<NonNullable<PrSpinnerProps['size']>, string> = {
  sm: 'size-[0.875rem]',
  md: 'size-5',
  lg: 'size-7 border-[3px]',
}

const spinnerClass = computed(() => [
  'pr-spinner inline-block size-4 rounded-[var(--pr-radius-full)] border-2 border-current border-r-transparent align-[-0.125em] animate-spin [animation-duration:720ms]',
  spinnerSizeClass[props.size],
])
</script>

<template>
  <span
    :class="spinnerClass"
    role="status"
    :aria-label="label"
  />
</template>
