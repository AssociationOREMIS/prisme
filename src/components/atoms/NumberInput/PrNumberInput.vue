<script setup lang="ts">
import { Minus, Plus } from '@lucide/vue'
import { computed, ref, useId, watch } from 'vue'
import { useErrorText, type PrFieldError } from '../../fieldError'
import { useFieldValue } from '../../fieldValue'
import { usePrMessages } from '../../../i18n/context'

export interface PrNumberInputProps {
  /** `null` when the field is empty. */
  modelValue?: number | null
  defaultValue?: number | null
  label?: string
  hint?: string
  error?: PrFieldError
  disabled?: boolean
  required?: boolean
  min?: number
  max?: number
  step?: number
  placeholder?: string
  id?: string
  name?: string
}

const props = withDefaults(defineProps<PrNumberInputProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  label: undefined,
  hint: undefined,
  error: undefined,
  disabled: false,
  required: false,
  min: undefined,
  max: undefined,
  step: 1,
  placeholder: undefined,
  id: undefined,
  name: undefined,
})

const messages = usePrMessages()

// One message, or the first of Laravel's array of messages.
const errorText = useErrorText(() => props.error)

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

const generatedId = useId()
const inputId = computed(() => props.id ?? `pr-number-input-${generatedId}`)
const hintId = computed(() => `${inputId.value}-hint`)
const errorId = computed(() => `${inputId.value}-error`)
// Only the message actually shown: the error replaces the hint.
const describedBy = computed(() => {
  if (errorText.value) return errorId.value
  return props.hint ? hintId.value : undefined
})

// Without a v-model (a plain Blade form), the +/- buttons and typing must still change the
// value: the field keeps it, while a real v-model controls it.
const { value: currentValue, set: setCurrentValue } = useFieldValue(props, () => null)

function setValue(value: number | null) {
  setCurrentValue(value)
  if (!isFocused.value) inputValue.value = value === null ? '' : String(value)
  emit('update:modelValue', value)
}

// Rounded to the step's decimals: 0.1 + 0.2 gives 0.3, not 0.30000000000000004.
const stepDecimals = computed(() => (String(props.step).split('.')[1] ?? '').length)
const roundToStep = (value: number) => Number(value.toFixed(stepDecimals.value))

const canDecrement = computed(() => {
  if (props.disabled) return false
  if (props.min === undefined) return true
  return (currentValue.value ?? 0) > props.min
})

const canIncrement = computed(() => {
  if (props.disabled) return false
  if (props.max === undefined) return true
  return (currentValue.value ?? 0) < props.max
})

function clamp(value: number): number {
  let v = value
  if (props.min !== undefined) v = Math.max(props.min, v)
  if (props.max !== undefined) v = Math.min(props.max, v)
  return v
}

function decrement() {
  if (!canDecrement.value) return
  setValue(clamp(roundToStep((currentValue.value ?? 0) - props.step)))
}

function increment() {
  if (!canIncrement.value) return
  setValue(clamp(roundToStep((currentValue.value ?? 0) + props.step)))
}

// Local text buffer so the field can be visually emptied while typing
// (e.g. to retype a value) without desyncing from modelValue until blur.
const isFocused = ref(false)
const asText = (value: number | null | undefined) => (value === null || value === undefined ? '' : String(value))
const inputValue = ref(asText(currentValue.value))

watch(currentValue, (value) => {
  if (!isFocused.value) inputValue.value = asText(value)
})

function onFocus() {
  isFocused.value = true
}

function onInput(event: Event) {
  const raw = (event.target as HTMLInputElement).value
  inputValue.value = raw
  if (raw.trim() === '') return
  const num = parseFloat(raw)
  if (!Number.isNaN(num)) setValue(clamp(num))
}

function onBlur() {
  isFocused.value = false
  // Emptied: the field is now empty (null), it does not take its old value back.
  if (inputValue.value.trim() === '') {
    if (currentValue.value !== null && currentValue.value !== undefined) setValue(null)
    return
  }
  const num = parseFloat(inputValue.value)
  if (Number.isNaN(num)) {
    inputValue.value = asText(currentValue.value)
    return
  }
  const clamped = clamp(num)
  inputValue.value = String(clamped)
  if (clamped !== currentValue.value) setValue(clamped)
}

// The template root is a wrapper <div>, not the <input> — forward fallthrough
// attrs (inputmode, autofocus, data-*, ...) to the actual control.
defineOptions({ inheritAttrs: false })
</script>

<template>
  <div class="pr-number-input pr:grid pr:gap-[var(--pr-space-2)] pr:text-[color:var(--pr-color-text)]">
    <label
      v-if="label"
      class="pr-number-input__label pr:inline-flex pr:w-fit pr:items-baseline pr:gap-[var(--pr-space-1)] pr:text-[length:var(--pr-font-size-sm)] pr:font-semibold pr:leading-[var(--pr-line-height-tight)]"
      :for="inputId"
    >
      <span>{{ label }}</span>
      <span v-if="required" class="pr:text-[color:var(--pr-color-danger)]" aria-hidden="true">*</span>
    </label>
    <div
      class="pr-number-input__control pr:inline-flex pr:min-h-[2.375rem] pr:w-full pr:overflow-hidden pr:rounded-[var(--pr-radius-md)] pr:border pr:border-[var(--pr-color-border-strong)] pr:bg-[var(--pr-color-surface)] pr:transition-[border-color] pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)] pr:focus-within:outline-2 pr:focus-within:outline-offset-2 pr:focus-within:outline-[var(--pr-color-focus)]"
      :class="{ 'pr:border-[var(--pr-color-danger)]': Boolean(errorText) }"
    >
      <button
        type="button"
        class="pr-number-input__btn pr:flex pr:h-full pr:min-w-[2.375rem] pr:cursor-pointer pr:items-center pr:justify-center pr:border-r pr:border-[var(--pr-color-border-strong)] pr:text-[color:var(--pr-color-text-muted)] pr:transition-colors pr:duration-[var(--pr-duration-fast)] pr:hover:bg-[var(--pr-color-surface-subtle)] pr:hover:text-[color:var(--pr-color-text)] pr:disabled:cursor-not-allowed pr:disabled:opacity-50"
        :disabled="!canDecrement"
        :aria-label="messages.numberInput.decrement"
        tabindex="-1"
        @click="decrement"
      >
        <Minus :size="14" aria-hidden="true" />
      </button>
      <input
        :id="inputId"
        v-bind="$attrs"
        class="pr-number-input__field pr:min-w-0 pr:grow pr:bg-transparent pr:px-[var(--pr-space-3)] pr:text-center pr:text-[length:var(--pr-font-size-md)] pr:text-[color:var(--pr-color-text)] pr:outline-none pr:placeholder:text-[color:var(--pr-color-text-subtle)] pr:disabled:cursor-not-allowed pr:disabled:text-[color:var(--pr-color-text-muted)] pr:[appearance:textfield] pr:[&::-webkit-inner-spin-button]:appearance-none pr:[&::-webkit-outer-spin-button]:appearance-none"
        type="number"
        :value="inputValue"
        :min="min"
        :max="max"
        :step="step"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :name="name"
        :aria-invalid="errorText ? 'true' : undefined"
        :aria-describedby="describedBy"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
      >
      <button
        type="button"
        class="pr-number-input__btn pr:flex pr:h-full pr:min-w-[2.375rem] pr:cursor-pointer pr:items-center pr:justify-center pr:border-l pr:border-[var(--pr-color-border-strong)] pr:text-[color:var(--pr-color-text-muted)] pr:transition-colors pr:duration-[var(--pr-duration-fast)] pr:hover:bg-[var(--pr-color-surface-subtle)] pr:hover:text-[color:var(--pr-color-text)] pr:disabled:cursor-not-allowed pr:disabled:opacity-50"
        :disabled="!canIncrement"
        :aria-label="messages.numberInput.increment"
        tabindex="-1"
        @click="increment"
      >
        <Plus :size="14" aria-hidden="true" />
      </button>
    </div>
    <p v-if="errorText" :id="errorId" class="pr-number-input__message pr-field-message pr-field-message--error pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-danger)]">{{ errorText }}</p>
    <p v-else-if="hint" :id="hintId" class="pr-number-input__message pr-field-message pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text-muted)]">{{ hint }}</p>
  </div>
</template>
