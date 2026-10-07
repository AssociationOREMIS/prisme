<script setup lang="ts">
import { computed } from 'vue'

export interface PrBadgeProps {
  variant?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

const props = withDefaults(defineProps<PrBadgeProps>(), {
  variant: 'neutral',
})

const badgeBaseClass = [
  'pr-badge',
  'pr:inline-flex pr:w-fit pr:items-center pr:whitespace-nowrap',
  'pr:min-h-[1.375rem] pr:rounded-[var(--pr-radius-full)] pr:border pr:border-transparent',
  'pr:px-[var(--pr-space-2)] pr:py-[0.125rem] pr:text-[length:var(--pr-font-size-xs)]',
  'pr:font-[650] pr:leading-[var(--pr-line-height-tight)]',
]

const badgeVariantClass: Record<NonNullable<PrBadgeProps['variant']>, string> = {
  neutral:
    'pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)] pr:text-[color:var(--pr-color-text-muted)]',
  primary:
    'pr:border-[var(--pr-color-primary-border)] pr:bg-[var(--pr-color-primary-soft)] pr:text-[color:var(--pr-color-primary)]',
  success:
    'pr:border-[var(--pr-color-success-border)] pr:bg-[var(--pr-color-success-soft)] pr:text-[color:var(--pr-color-success)]',
  warning:
    'pr:border-[var(--pr-color-warning-border)] pr:bg-[var(--pr-color-warning-soft)] pr:text-[color:var(--pr-color-warning)]',
  danger:
    'pr:border-[var(--pr-color-danger-border)] pr:bg-[var(--pr-color-danger-soft)] pr:text-[color:var(--pr-color-danger)]',
  info:
    'pr:border-[var(--pr-color-info-border)] pr:bg-[var(--pr-color-info-soft)] pr:text-[color:var(--pr-color-info)]',
}

const badgeClass = computed(() => [badgeBaseClass, badgeVariantClass[props.variant]])
</script>

<template>
  <span :class="badgeClass">
    <slot />
  </span>
</template>
