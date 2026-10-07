<script setup lang="ts">
import { computed, useId } from 'vue'
import { ProgressIndicator, ProgressRoot } from 'reka-ui'

export interface PrProgressProps {
  modelValue?: number
  max?: number
  label?: string
  /** Accessible name when no visible `label` is shown. */
  ariaLabel?: string
  showValue?: boolean
}

const props = withDefaults(defineProps<PrProgressProps>(), {
  modelValue: 0,
  max: 100,
  label: undefined,
  ariaLabel: undefined,
  showValue: false,
})

const progressValue = computed(() => props.modelValue ?? 0)
const progressMax = computed(() => props.max ?? 100)
// The bar and the displayed number are a share of `max`, not the raw value (max=10, value=5 is 50%).
const percent = computed(() => {
  if (progressMax.value <= 0) return 0
  return Math.round(Math.min(Math.max(progressValue.value / progressMax.value, 0), 1) * 100)
})
const progressTransform = computed(() => `translateX(-${100 - percent.value}%)`)
const labelId = `pr-progress-${useId()}-label`
</script>

<template>
  <div class="pr-progress pr:grid pr:gap-[var(--pr-space-2)]">
    <div v-if="label || showValue" class="pr-progress__header pr:flex pr:items-center pr:justify-between pr:gap-[var(--pr-space-3)]">
      <span v-if="label" :id="labelId" class="pr-progress__label pr:text-[length:var(--pr-font-size-sm)] pr:font-[650] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text)]">{{ label }}</span>
      <span v-if="showValue" class="pr-progress__value pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text-muted)] pr:tabular-nums">{{ percent }}%</span>
    </div>
    <ProgressRoot class="pr-progress__root pr:h-2 pr:overflow-hidden pr:rounded-[var(--pr-radius-full)] pr:bg-[var(--pr-color-surface-subtle)]" :model-value="progressValue" :max="progressMax" :aria-labelledby="label ? labelId : undefined" :aria-label="label ? undefined : ariaLabel">
      <ProgressIndicator
        class="pr-progress__indicator pr:h-full pr:w-full pr:rounded-[inherit] pr:bg-[var(--pr-color-primary)] pr:transition-transform pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)]"
        :style="{ transform: progressTransform }"
      />
    </ProgressRoot>
  </div>
</template>
