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
  'inline-flex w-fit items-center whitespace-nowrap',
  'min-h-[1.375rem] rounded-[var(--pr-radius-full)] border border-transparent',
  'px-[var(--pr-space-2)] py-[0.125rem] text-[length:var(--pr-font-size-xs)]',
  'font-[650] leading-[var(--pr-line-height-tight)]',
]

const badgeVariantClass: Record<NonNullable<PrBadgeProps['variant']>, string> = {
  neutral:
    'border-[var(--pr-color-border)] bg-[var(--pr-color-surface-subtle)] text-[color:var(--pr-color-text-muted)]',
  primary:
    'border-[var(--pr-color-primary-border)] bg-[var(--pr-color-primary-soft)] text-[color:var(--pr-color-primary)]',
  success:
    'border-[var(--pr-color-success-border)] bg-[var(--pr-color-success-soft)] text-[color:var(--pr-color-success)]',
  warning:
    'border-[var(--pr-color-warning-border)] bg-[var(--pr-color-warning-soft)] text-[color:var(--pr-color-warning)]',
  danger:
    'border-[var(--pr-color-danger-border)] bg-[var(--pr-color-danger-soft)] text-[color:var(--pr-color-danger)]',
  info:
    'border-[var(--pr-color-info-border)] bg-[var(--pr-color-info-soft)] text-[color:var(--pr-color-info)]',
}

const badgeClass = computed(() => [badgeBaseClass, badgeVariantClass[props.variant]])
</script>

<template>
  <span :class="badgeClass">
    <slot />
  </span>
</template>
