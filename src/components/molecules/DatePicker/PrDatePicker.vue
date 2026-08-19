<script setup lang="ts">
import { PrInput } from '../../atoms/Input'

export interface PrDatePickerProps {
  modelValue?: string
  label?: string
  disabled?: boolean
  required?: boolean
  min?: string
  max?: string
}

withDefaults(defineProps<PrDatePickerProps>(), {
  modelValue: '',
  label: undefined,
  disabled: false,
  required: false,
  min: undefined,
  max: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <PrInput
    :model-value="modelValue"
    :label="label"
    type="date"
    :disabled="disabled"
    :required="required"
    :min="min"
    :max="max"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>
