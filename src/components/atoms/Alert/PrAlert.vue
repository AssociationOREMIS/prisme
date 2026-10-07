<script setup lang="ts">
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from '@lucide/vue'
import { computed } from 'vue'

export interface PrAlertProps {
  variant?: 'info' | 'success' | 'warning' | 'danger'
  title?: string
}

const props = withDefaults(defineProps<PrAlertProps>(), {
  variant: 'info',
  title: undefined,
})

const icon = computed(() => ({
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  danger: AlertCircle,
})[props.variant])

// Danger/warning need to interrupt and be announced immediately (role="alert"
// implies aria-live="assertive"); info/success are non-urgent (role="status").
const alertRole = computed(() => (props.variant === 'danger' || props.variant === 'warning' ? 'alert' : 'status'))

const alertVariantClass = computed(() => ({
  info: 'pr:border-[var(--pr-color-info-border)] pr:bg-[var(--pr-color-info-soft)] pr:text-[color:var(--pr-color-info)]',
  success: 'pr:border-[var(--pr-color-success-border)] pr:bg-[var(--pr-color-success-soft)] pr:text-[color:var(--pr-color-success)]',
  warning: 'pr:border-[var(--pr-color-warning-border)] pr:bg-[var(--pr-color-warning-soft)] pr:text-[color:var(--pr-color-warning)]',
  danger: 'pr:border-[var(--pr-color-danger-border)] pr:bg-[var(--pr-color-danger-soft)] pr:text-[color:var(--pr-color-danger)]',
})[props.variant])
</script>

<template>
  <div
    class="pr-alert pr:flex pr:items-start pr:gap-[var(--pr-space-3)] pr:rounded-[var(--pr-radius-lg)] pr:border pr:p-[var(--pr-space-4)]"
    :class="alertVariantClass"
    :role="alertRole"
  >
    <component :is="icon" class="pr-alert__icon pr:mt-[0.0625rem] pr:shrink-0" :size="18" aria-hidden="true" />
    <div class="pr-alert__content pr:grid pr:min-w-0 pr:gap-[var(--pr-space-1)]">
      <p v-if="title" class="pr-alert__title pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:font-[750] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text)]">{{ title }}</p>
      <div class="pr-alert__description pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-normal)] pr:text-[color:var(--pr-color-text)]">
        <slot />
      </div>
    </div>
  </div>
</template>
