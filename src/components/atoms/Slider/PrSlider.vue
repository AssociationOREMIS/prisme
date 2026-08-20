<script setup lang="ts">
import { computed } from 'vue'
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { PrLabel } from '../Label'

export interface PrSliderProps {
  modelValue?: number
  defaultValue?: number
  label?: string
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  name?: string
  showValue?: boolean
}

const props = withDefaults(defineProps<PrSliderProps>(), {
  modelValue: undefined,
  defaultValue: 0,
  label: undefined,
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  name: undefined,
  showValue: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const sliderValue = computed(() => [props.modelValue ?? props.defaultValue])

function updateValue(value: number[] | undefined) {
  emit('update:modelValue', value?.[0] ?? props.min)
}
</script>

<template>
  <div class="pr-slider grid gap-[var(--pr-space-2)] text-[color:var(--pr-color-text)]">
    <div v-if="label || showValue" class="pr-slider__header flex items-center justify-between gap-[var(--pr-space-3)]">
      <PrLabel v-if="label" :disabled="disabled">{{ label }}</PrLabel>
      <output v-if="showValue" class="pr-slider__value text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-text-muted)] tabular-nums">{{ sliderValue[0] }}</output>
    </div>
    <SliderRoot
      class="pr-slider__root relative flex h-5 touch-none select-none items-center data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60"
      :model-value="sliderValue"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :name="name"
      @update:model-value="updateValue"
    >
      <SliderTrack class="pr-slider__track relative h-1.5 flex-auto overflow-hidden rounded-[var(--pr-radius-full)] bg-[var(--pr-color-surface-subtle)]">
        <SliderRange class="pr-slider__range absolute h-full rounded-[var(--pr-radius-full)] bg-[var(--pr-color-primary)]" />
      </SliderTrack>
      <SliderThumb class="pr-slider__thumb block size-4 cursor-grab rounded-[var(--pr-radius-full)] border-2 border-[var(--pr-color-primary)] bg-[var(--pr-color-surface)] shadow-[var(--pr-shadow-sm)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)] active:cursor-grabbing" aria-label="Valeur" />
    </SliderRoot>
  </div>
</template>
