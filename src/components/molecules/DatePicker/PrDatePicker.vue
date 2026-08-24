<script setup lang="ts">
import { ref, watch } from 'vue'
import { PrInput } from '../../atoms/Input'

export interface PrDatePickerProps {
  modelValue?: string
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  min?: string
  max?: string
}

const props = withDefaults(defineProps<PrDatePickerProps>(), {
  modelValue: '',
  label: undefined,
  hint: undefined,
  error: undefined,
  disabled: false,
  required: false,
  min: undefined,
  max: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

// A native <input type="date">'s value is only ever a complete valid date
// or "" — it goes through "" while the user is still filling in a segment
// (day/month/year). A local buffer + focus guard stops that transient ""
// from clobbering modelValue mid-entry (same fix as PrNumberInput).
const isFocused = ref(false)
const internalValue = ref(props.modelValue ?? '')

watch(
  () => props.modelValue,
  (val) => {
    if (isFocused.value) return
    internalValue.value = val ?? ''
  },
)

function onFocusIn() {
  isFocused.value = true
}

function onUpdate(value: string) {
  internalValue.value = value
  if (ISO_DATE_PATTERN.test(value)) emit('update:modelValue', value)
}

function onFocusOut() {
  isFocused.value = false
  if (internalValue.value === '') {
    if (props.modelValue !== '') emit('update:modelValue', '')
  }
  else if (!ISO_DATE_PATTERN.test(internalValue.value)) {
    internalValue.value = props.modelValue ?? ''
  }
}
</script>

<template>
  <div class="pr-date-picker" @focusin="onFocusIn" @focusout="onFocusOut">
    <PrInput
      :model-value="internalValue"
      :label="label"
      :hint="hint"
      :error="error"
      type="date"
      :disabled="disabled"
      :required="required"
      :min="min"
      :max="max"
      @update:model-value="onUpdate"
    />
  </div>
</template>
