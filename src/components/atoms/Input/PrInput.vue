<script setup lang="ts">
import { computed, useAttrs, useId } from 'vue'
import { useErrorText, type PrFieldError } from '../../fieldError'
import { useFieldValue } from '../../fieldValue'
import { warnWithoutName } from '../../accessibleName'

export interface PrInputProps {
  modelValue?: string | number
  /** Initial value of a field without `v-model` (a Blade form): the field then keeps what is typed. */
  defaultValue?: string | number
  label?: string
  /** Keeps the label for screen readers only: a compact form on one line (a search, a filter). */
  hideLabel?: boolean
  hint?: string
  error?: PrFieldError
  disabled?: boolean
  required?: boolean
  type?: string
  placeholder?: string
  id?: string
  name?: string
}

const props = withDefaults(defineProps<PrInputProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  label: undefined,
  hideLabel: false,
  hint: undefined,
  error: undefined,
  disabled: false,
  required: false,
  type: 'text',
  placeholder: undefined,
  id: undefined,
  name: undefined,
})

warnWithoutName('PrInput', props.label)

// One message, or the first of Laravel's array of messages.
const errorText = useErrorText(() => props.error)

// A plain Blade `value="{{ old('x') }}"` (in $attrs) also gives the initial value.
const attrs = useAttrs()
const { value: fieldValue, set: setFieldValue } = useFieldValue(props, () => attrs.value as string | number | undefined)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const generatedId = useId()
const inputId = computed(() => props.id ?? `pr-input-${generatedId}`)
const hintId = computed(() => `${inputId.value}-hint`)
const errorId = computed(() => `${inputId.value}-error`)
// The error, then the hint: the hint stays shown with the error, the format it gives is what
// fixing the error needs (RGAA 11.10).
const describedBy = computed(() => [
  errorText.value ? errorId.value : undefined,
  props.hint ? hintId.value : undefined,
].filter(Boolean).join(' ') || undefined)

const inputClass = computed(() => [
  'pr-input pr:grid pr:content-start pr:gap-[var(--pr-space-2)] pr:text-[color:var(--pr-color-text)]',
])

const inputControlClass = computed(() => [
  'pr-input__control pr:min-h-[2.375rem] pr:w-full pr:rounded-[var(--pr-radius-md)] pr:border pr:border-[var(--pr-color-border-strong)] pr:bg-[var(--pr-color-surface)] pr:px-[var(--pr-space-3)] pr:text-[length:var(--pr-font-size-md)] pr:text-[color:var(--pr-color-text)] pr:transition-[background-color,border-color,box-shadow] pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)] pr:placeholder:text-[color:var(--pr-color-text-subtle)] pr:hover:not-disabled:border-[var(--pr-color-border-hover)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)] pr:disabled:cursor-not-allowed pr:disabled:bg-[var(--pr-color-surface-subtle)] pr:disabled:text-[color:var(--pr-color-text-muted)]',
  errorText.value ? 'pr:border-[var(--pr-color-danger)]' : '',
])

const inputMessageClassBase = 'pr-input__message pr-field-message pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)]'
const hintMessageClass = `${inputMessageClassBase} pr:text-[color:var(--pr-color-text-muted)]`
const errorMessageClass = `${inputMessageClassBase} pr-input__message--error pr-field-message--error pr:text-[color:var(--pr-color-danger)]`

function updateValue(event: Event) {
  const value = (event.target as HTMLInputElement).value
  setFieldValue(value)
  emit('update:modelValue', value)
}

// The template root is a wrapper <div>, not the <input> — forward fallthrough
// attrs (autocomplete, pattern, inputmode, data-*, ...) to the actual control.
defineOptions({ inheritAttrs: false })
</script>

<template>
  <div :class="inputClass">
    <label
      v-if="label"
      class="pr-input__label"
      :class="hideLabel ? 'pr:sr-only' : 'pr:inline-flex pr:w-fit pr:items-baseline pr:gap-[var(--pr-space-1)] pr:text-[length:var(--pr-font-size-sm)] pr:font-semibold pr:leading-[var(--pr-line-height-tight)]'"
      :for="inputId"
    >
      <span>{{ label }}</span>
      <span v-if="required" class="pr-input__required pr:text-[color:var(--pr-color-danger)]" aria-hidden="true">*</span>
    </label>

    <input
      :id="inputId"
      v-bind="$attrs"
      :class="inputControlClass"
      :name="name"
      :value="fieldValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :aria-invalid="errorText ? 'true' : undefined"
      :aria-describedby="describedBy"
      @input="updateValue"
    >

    <p v-if="hint" :id="hintId" :class="hintMessageClass">
      {{ hint }}
    </p>
    <p v-if="errorText" :id="errorId" :class="errorMessageClass">
      {{ errorText }}
    </p>
  </div>
</template>
