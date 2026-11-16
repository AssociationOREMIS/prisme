<script setup lang="ts">
import { computed } from 'vue'

export interface PrStatusDotProps {
  /** Colour of the dot. The colour is never the only information: give a `label` (or a text next to it). */
  variant?: 'success' | 'neutral' | 'warning' | 'danger' | 'info'
  /** Visible text next to the dot, which carries the status (« Un bénévole vous répond »). */
  label?: string
  /** A soft halo pulses around the dot (a live presence). Off when the system asks for reduced motion. */
  pulse?: boolean
}

const props = withDefaults(defineProps<PrStatusDotProps>(), {
  variant: 'neutral',
  label: undefined,
  pulse: false,
})

const statusDotVariantClass: Record<NonNullable<PrStatusDotProps['variant']>, string> = {
  success: 'pr:bg-[var(--pr-color-success)]',
  neutral: 'pr:bg-[var(--pr-color-text-subtle)]',
  warning: 'pr:bg-[var(--pr-color-warning)]',
  danger: 'pr:bg-[var(--pr-color-danger)]',
  info: 'pr:bg-[var(--pr-color-info)]',
}

// In forced colors the background would vanish: the dot is drawn in the text colour instead.
const dotClass = computed(() => [
  'pr-status-dot__dot pr:relative pr:inline-block pr:size-2 pr:shrink-0 pr:rounded-[var(--pr-radius-full)]',
  'pr:forced-colors:forced-color-adjust-none pr:forced-colors:bg-[CanvasText]',
  statusDotVariantClass[props.variant],
])

const haloClass = computed(() => [
  'pr-status-dot__halo pr:absolute pr:inset-0 pr:rounded-[var(--pr-radius-full)] pr:opacity-60 pr:animate-ping pr:[animation-duration:2s]',
  'pr:motion-reduce:hidden pr:forced-colors:hidden',
  statusDotVariantClass[props.variant],
])
</script>

<template>
  <span class="pr-status-dot pr:inline-flex pr:items-center pr:gap-[var(--pr-space-2)] pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text-muted)]" :data-variant="variant">
    <span :class="dotClass" aria-hidden="true">
      <span v-if="pulse" :class="haloClass" />
    </span>
    <span v-if="label || $slots.default" class="pr-status-dot__label">
      <slot>{{ label }}</slot>
    </span>
  </span>
</template>
