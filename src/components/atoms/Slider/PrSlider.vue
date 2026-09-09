<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
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
  id?: string
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
  id: undefined,
  name: undefined,
  showValue: true,
})

const generatedId = useId()
const sliderId = computed(() => props.id ?? `pr-slider-${generatedId}`)

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

// Without a v-model, `modelValue` is always undefined and `defaultValue` never
// changes — binding SliderRoot straight to `modelValue ?? defaultValue` would
// make it permanently controlled at a constant value, snapping the thumb back
// on every drag. Track the live value locally so uncontrolled usage (only
// `defaultValue` set) still moves, while a real v-model keeps taking priority.
const internalValue = ref(props.modelValue ?? props.defaultValue)

watch(() => props.modelValue, (value) => {
  if (value !== undefined) internalValue.value = value
})

const sliderValue = computed(() => [props.modelValue ?? internalValue.value])

function updateValue(value: number[] | undefined) {
  const next = value?.[0] ?? props.min
  internalValue.value = next
  emit('update:modelValue', next)
}

// SliderThumb renders as a <span role="slider">, which isn't a labelable HTML
// element — a native <label for="..."> click won't forward focus to it, so
// PrLabel's click has to be handled explicitly here.
function focusThumb() {
  document.getElementById(sliderId.value)?.focus()
}
</script>

<template>
  <div class="pr-slider grid gap-[var(--pr-space-2)] text-[color:var(--pr-color-text)]">
    <div v-if="label || showValue" class="pr-slider__header flex items-center justify-between gap-[var(--pr-space-3)]">
      <PrLabel v-if="label" :for="sliderId" :disabled="disabled" @click="focusThumb">{{ label }}</PrLabel>
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
      <SliderThumb :id="sliderId" class="pr-slider__thumb block size-4 cursor-grab rounded-[var(--pr-radius-full)] border-2 border-[var(--pr-color-primary)] bg-[var(--pr-color-surface)] shadow-[var(--pr-shadow-sm)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)] active:cursor-grabbing" :aria-label="label || 'Valeur'" />
    </SliderRoot>
  </div>
</template>
