<script setup lang="ts">
import { computed, useId } from 'vue'
import { Circle } from '@lucide/vue'
import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot } from 'reka-ui'
import { PrLabel } from '../../atoms/Label'

export interface PrRadioOption {
  label: string
  value: string
  description?: string
  disabled?: boolean
}

export interface PrRadioGroupProps {
  modelValue?: string
  defaultValue?: string
  options?: PrRadioOption[]
  label?: string
  name?: string
  orientation?: 'horizontal' | 'vertical'
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<PrRadioGroupProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  options: () => [],
  label: undefined,
  name: undefined,
  orientation: 'vertical',
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const generatedId = useId()
const rootValue = computed(() => props.modelValue ?? props.defaultValue)

function updateValue(value: unknown) {
  if (typeof value === 'string') {
    emit('update:modelValue', value)
  }
}
</script>

<template>
  <div class="pr-radio-group" :class="{ 'pr-radio-group--disabled': disabled }">
    <PrLabel v-if="label" :required="required" :disabled="disabled">{{ label }}</PrLabel>
    <RadioGroupRoot
      class="pr-radio-group__root"
      :class="`pr-radio-group__root--${orientation}`"
      :model-value="rootValue"
      :orientation="orientation"
      :disabled="disabled"
      :required="required"
      :name="name"
      @update:model-value="updateValue"
    >
      <label
        v-for="option in options"
        :key="option.value"
        class="pr-radio-group__option"
        :class="{ 'pr-radio-group__option--disabled': disabled || option.disabled }"
      >
        <RadioGroupItem
          class="pr-radio-group__item"
          :id="`${generatedId}-${option.value}`"
          :value="option.value"
          :disabled="disabled || option.disabled"
        >
          <RadioGroupIndicator class="pr-radio-group__indicator">
            <Circle :size="8" fill="currentColor" aria-hidden="true" />
          </RadioGroupIndicator>
        </RadioGroupItem>
        <span class="pr-radio-group__text">
          <span class="pr-radio-group__label">{{ option.label }}</span>
          <span v-if="option.description" class="pr-radio-group__description">
            {{ option.description }}
          </span>
        </span>
      </label>
    </RadioGroupRoot>
  </div>
</template>
