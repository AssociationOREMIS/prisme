<script setup lang="ts">
import { ref, watch } from 'vue'
import { PrInput } from '../../atoms/Input'
import { useErrorText, type PrFieldError } from '../../fieldError'

export interface PrDatePickerProps {
  modelValue?: string
  /** Initial date (YYYY-MM-DD) of a field without `v-model`. */
  defaultValue?: string
  label?: string
  hint?: string
  error?: PrFieldError
  disabled?: boolean
  required?: boolean
  min?: string
  max?: string
  name?: string
  id?: string
}

const props = withDefaults(defineProps<PrDatePickerProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  label: undefined,
  hint: undefined,
  error: undefined,
  disabled: false,
  required: false,
  min: undefined,
  max: undefined,
  name: undefined,
  id: undefined,
})

// One message, or the first of Laravel's array of messages.
const errorText = useErrorText(() => props.error)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

// A native <input type="date">'s value is only ever a complete valid date
// or "" — it goes through "" while the user is still filling in a segment
// (day/month/year). A local buffer + focus guard stops that transient ""
// from clobbering modelValue mid-entry (same fix as PrNumberInput).
const isFocused = ref(false)
const internalValue = ref(props.modelValue ?? props.defaultValue ?? '')
// The last complete date, restored when the field is left half filled.
const committedValue = ref(internalValue.value)

watch(
  () => props.modelValue,
  (val) => {
    if (isFocused.value) return
    internalValue.value = val ?? ''
    committedValue.value = val ?? ''
  },
)

function onFocusIn() {
  isFocused.value = true
}

function onUpdate(value: string) {
  internalValue.value = value
  if (ISO_DATE_PATTERN.test(value)) {
    committedValue.value = value
    emit('update:modelValue', value)
  }
}

function onFocusOut() {
  isFocused.value = false
  if (internalValue.value === '') {
    committedValue.value = ''
    if (props.modelValue) emit('update:modelValue', '')
  }
  else if (!ISO_DATE_PATTERN.test(internalValue.value)) {
    internalValue.value = committedValue.value
  }
}
</script>

<template>
  <div class="pr-date-picker" @focusin="onFocusIn" @focusout="onFocusOut">
    <PrInput
      :id="id"
      :model-value="internalValue"
      :label="label"
      :hint="hint"
      :error="errorText"
      type="date"
      :disabled="disabled"
      :required="required"
      :min="min"
      :max="max"
      :name="name"
      @update:model-value="onUpdate"
    />
  </div>
</template>
