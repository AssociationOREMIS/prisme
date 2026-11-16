<script setup lang="ts">
import { computed } from 'vue'

export interface PrBadgeProps {
  variant?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  /**
   * `pill` (default): rounded, with a border. `tag`: a compact label with small corners and no
   * border, for the tags of an article or an entry of a feed.
   */
  shape?: 'pill' | 'tag'
}

const props = withDefaults(defineProps<PrBadgeProps>(), {
  variant: 'neutral',
  shape: 'pill',
})

const badgeBaseClass = [
  'pr-badge',
  'pr:inline-flex pr:w-fit pr:items-center pr:whitespace-nowrap pr:border',
  'pr:text-[length:var(--pr-font-size-xs)] pr:leading-[var(--pr-line-height-tight)]',
]

const badgeShapeClass: Record<NonNullable<PrBadgeProps['shape']>, string> = {
  pill: 'pr:min-h-[1.375rem] pr:rounded-[var(--pr-radius-full)] pr:px-[var(--pr-space-2)] pr:py-[0.125rem] pr:font-[650]',
  tag: 'pr-badge--tag pr:rounded-[var(--pr-radius-sm)] pr:border-transparent pr:px-[0.375rem] pr:py-[0.125rem] pr:font-semibold',
}

// Background and text of every variant, then the border of the pill shape only.
const badgeVariantClass: Record<NonNullable<PrBadgeProps['variant']>, string> = {
  neutral: 'pr:bg-[var(--pr-color-surface-subtle)] pr:text-[color:var(--pr-color-text-muted)]',
  primary: 'pr:bg-[var(--pr-color-primary-soft)] pr:text-[color:var(--pr-color-primary)]',
  success: 'pr:bg-[var(--pr-color-success-soft)] pr:text-[color:var(--pr-color-success)]',
  warning: 'pr:bg-[var(--pr-color-warning-soft)] pr:text-[color:var(--pr-color-warning)]',
  danger: 'pr:bg-[var(--pr-color-danger-soft)] pr:text-[color:var(--pr-color-danger)]',
  info: 'pr:bg-[var(--pr-color-info-soft)] pr:text-[color:var(--pr-color-info)]',
}

const pillBorderClass: Record<NonNullable<PrBadgeProps['variant']>, string> = {
  neutral: 'pr:border-[var(--pr-color-border)]',
  primary: 'pr:border-[var(--pr-color-primary-border)]',
  success: 'pr:border-[var(--pr-color-success-border)]',
  warning: 'pr:border-[var(--pr-color-warning-border)]',
  danger: 'pr:border-[var(--pr-color-danger-border)]',
  info: 'pr:border-[var(--pr-color-info-border)]',
}

const badgeClass = computed(() => [
  badgeBaseClass,
  badgeShapeClass[props.shape],
  props.variant === 'neutral' && props.shape === 'pill' ? 'pr:bg-[var(--pr-color-surface)] pr:text-[color:var(--pr-color-text-muted)]' : badgeVariantClass[props.variant],
  props.shape === 'pill' && pillBorderClass[props.variant],
])
</script>

<template>
  <span :class="badgeClass">
    <slot />
  </span>
</template>
