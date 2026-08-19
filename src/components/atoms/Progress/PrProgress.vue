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
  <div class="pr-progress">
    <div v-if="label || showValue" class="pr-progress__header">
      <span v-if="label" class="pr-progress__label">{{ label }}</span>
      <span v-if="showValue" class="pr-progress__value">{{ modelValue }}%</span>
    </div>
    <ProgressRoot class="pr-progress__root" :model-value="modelValue" :max="max">
      <ProgressIndicator
        class="pr-progress__indicator"
        :style="{ transform: `translateX(-${100 - Math.min(modelValue, max)}%)` }"
      />
    </ProgressRoot>
  </div>
</template>
