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
  <div class="pr-slider" :class="{ 'pr-slider--disabled': disabled }">
    <div v-if="label || showValue" class="pr-slider__header">
      <PrLabel v-if="label" :disabled="disabled">{{ label }}</PrLabel>
      <output v-if="showValue" class="pr-slider__value">{{ sliderValue[0] }}</output>
    </div>
    <SliderRoot
      class="pr-slider__root"
      :model-value="sliderValue"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :name="name"
      @update:model-value="updateValue"
    >
      <SliderTrack class="pr-slider__track">
        <SliderRange class="pr-slider__range" />
      </SliderTrack>
      <SliderThumb class="pr-slider__thumb" aria-label="Valeur" />
    </SliderRoot>
  </div>
</template>
