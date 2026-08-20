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

const alertVariantClass = computed(() => ({
  info: 'border-[var(--pr-color-info-border)] bg-[var(--pr-color-info-soft)] text-[color:var(--pr-color-info)]',
  success: 'border-[var(--pr-color-success-border)] bg-[var(--pr-color-success-soft)] text-[color:var(--pr-color-success)]',
  warning: 'border-[var(--pr-color-warning-border)] bg-[var(--pr-color-warning-soft)] text-[color:var(--pr-color-warning)]',
  danger: 'border-[var(--pr-color-danger-border)] bg-[var(--pr-color-danger-soft)] text-[color:var(--pr-color-danger)]',
})[props.variant])
</script>

<template>
  <div
    class="pr-alert flex items-start gap-[var(--pr-space-3)] rounded-[var(--pr-radius-lg)] border p-[var(--pr-space-4)]"
    :class="alertVariantClass"
    role="status"
  >
    <component :is="icon" class="pr-alert__icon mt-[0.0625rem] shrink-0" :size="18" aria-hidden="true" />
    <div class="pr-alert__content grid min-w-0 gap-[var(--pr-space-1)]">
      <p v-if="title" class="pr-alert__title m-0 text-[length:var(--pr-font-size-sm)] font-[750] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-text)]">{{ title }}</p>
      <div class="pr-alert__description text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-normal)] text-[color:var(--pr-color-text)]">
        <slot />
      </div>
    </div>
  </div>
</template>
