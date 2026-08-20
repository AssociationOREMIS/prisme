<script setup lang="ts">
import { ProgressIndicator, ProgressRoot } from 'reka-ui'

export interface PrProgressProps {
  modelValue?: number
  max?: number
  label?: string
  showValue?: boolean
}

withDefaults(defineProps<PrProgressProps>(), {
  modelValue: 0,
  max: 100,
  label: undefined,
  showValue: false,
})
</script>

<template>
  <div class="pr-progress grid gap-[var(--pr-space-2)]">
    <div v-if="label || showValue" class="pr-progress__header flex items-center justify-between gap-[var(--pr-space-3)]">
      <span v-if="label" class="pr-progress__label text-[length:var(--pr-font-size-sm)] font-[650] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-text)]">{{ label }}</span>
      <span v-if="showValue" class="pr-progress__value text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-text-muted)] tabular-nums">{{ modelValue }}%</span>
    </div>
    <ProgressRoot class="pr-progress__root h-2 overflow-hidden rounded-[var(--pr-radius-full)] bg-[var(--pr-color-surface-subtle)]" :model-value="modelValue" :max="max">
      <ProgressIndicator
        class="pr-progress__indicator h-full w-full rounded-[inherit] bg-[var(--pr-color-primary)] transition-transform duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)]"
        :style="{ transform: `translateX(-${100 - Math.min(modelValue, max)}%)` }"
      />
    </ProgressRoot>
  </div>
</template>
