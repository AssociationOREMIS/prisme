<script setup lang="ts">
import { computed, useId } from 'vue'
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { PrLabel } from '../Label'
import { usePrMessages } from '../../../i18n/context'
import { useFieldValue } from '../../fieldValue'

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

const messages = usePrMessages()

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
const { value: currentValue, set: setCurrentValue } = useFieldValue(props, () => undefined)
const sliderValue = computed(() => [currentValue.value ?? props.min])

function updateValue(value: number[] | undefined) {
  const next = value?.[0] ?? props.min
  setCurrentValue(next)
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
  <div class="pr-slider pr:grid pr:gap-[var(--pr-space-2)] pr:text-[color:var(--pr-color-text)]">
    <div v-if="label || showValue" class="pr-slider__header pr:flex pr:items-center pr:justify-between pr:gap-[var(--pr-space-3)]">
      <PrLabel v-if="label" :for="sliderId" :disabled="disabled" @click="focusThumb">{{ label }}</PrLabel>
      <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -- a visual echo of the value, which the slider thumb already announces -->
      <output v-if="showValue" class="pr-slider__value pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text-muted)] pr:tabular-nums">{{ sliderValue[0] }}</output>
    </div>
    <SliderRoot
      class="pr-slider__root pr:relative pr:flex pr:h-5 pr:touch-none pr:select-none pr:items-center pr:data-[disabled]:cursor-not-allowed pr:data-[disabled]:opacity-60"
      :model-value="sliderValue"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :name="name"
      @update:model-value="updateValue"
    >
      <SliderTrack class="pr-slider__track pr:relative pr:h-1.5 pr:flex-auto pr:overflow-hidden pr:rounded-[var(--pr-radius-full)] pr:bg-[var(--pr-color-surface-subtle)]">
        <SliderRange class="pr-slider__range pr:absolute pr:h-full pr:rounded-[var(--pr-radius-full)] pr:bg-[var(--pr-color-primary)]" />
      </SliderTrack>
      <SliderThumb :id="sliderId" class="pr-slider__thumb pr:block pr:size-4 pr:cursor-grab pr:rounded-[var(--pr-radius-full)] pr:border-2 pr:border-[var(--pr-color-primary)] pr:bg-[var(--pr-color-surface)] pr:shadow-[var(--pr-shadow-sm)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)] pr:active:cursor-grabbing" :aria-label="label || messages.slider.value" />
    </SliderRoot>
  </div>
</template>
