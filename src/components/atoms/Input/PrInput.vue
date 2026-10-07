<script setup lang="ts">
import { computed, useAttrs, useId } from 'vue'
import { useErrorText, type PrFieldError } from '../../fieldError'

export interface PrInputProps {
  modelValue?: string | number
  label?: string
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
  label: undefined,
  hint: undefined,
  error: undefined,
  disabled: false,
  required: false,
  type: 'text',
  placeholder: undefined,
  id: undefined,
  name: undefined,
})

// One message, or the first of Laravel's array of messages.
const errorText = useErrorText(() => props.error)

// Without a model-value, a plain Blade `value="{{ old('x') }}"` (in $attrs) fills the field:
// binding an empty modelValue default after $attrs used to wipe it.
const attrs = useAttrs()
const fieldValue = computed(() => props.modelValue ?? (attrs.value as string | number | undefined))

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const generatedId = useId()
const inputId = computed(() => props.id ?? `pr-input-${generatedId}`)
const hintId = computed(() => `${inputId.value}-hint`)
const errorId = computed(() => `${inputId.value}-error`)
// Only the message actually shown: the error replaces the hint.
const describedBy = computed(() => {
  if (errorText.value) return errorId.value
  return props.hint ? hintId.value : undefined
})

const inputClass = computed(() => [
  'pr-input grid gap-[var(--pr-space-2)] text-[color:var(--pr-color-text)]',
])

const inputControlClass = computed(() => [
  'pr-input__control min-h-[2.375rem] w-full rounded-[var(--pr-radius-md)] border border-[var(--pr-color-border-strong)] bg-[var(--pr-color-surface)] px-[var(--pr-space-3)] text-[length:var(--pr-font-size-md)] text-[color:var(--pr-color-text)] transition-[background-color,border-color,box-shadow] duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)] placeholder:text-[color:var(--pr-color-text-subtle)] hover:not-disabled:border-[var(--pr-neutral-400)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)] disabled:cursor-not-allowed disabled:bg-[var(--pr-color-surface-subtle)] disabled:text-[color:var(--pr-color-text-muted)]',
  errorText.value ? 'border-[var(--pr-color-danger)]' : '',
])

const inputMessageClass = computed(() => [
  'pr-input__message pr-field-message m-0 text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-tight)]',
  errorText.value
    ? 'pr-input__message--error pr-field-message--error text-[color:var(--pr-color-danger)]'
    : 'text-[color:var(--pr-color-text-muted)]',
])

function updateValue(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

// The template root is a wrapper <div>, not the <input> — forward fallthrough
// attrs (autocomplete, pattern, inputmode, data-*, ...) to the actual control.
defineOptions({ inheritAttrs: false })
</script>

<template>
  <div :class="inputClass">
    <label
      v-if="label"
      class="pr-input__label inline-flex w-fit items-baseline gap-[var(--pr-space-1)] text-[length:var(--pr-font-size-sm)] font-semibold leading-[var(--pr-line-height-tight)]"
      :for="inputId"
    >
      <span>{{ label }}</span>
      <span v-if="required" class="pr-input__required text-[color:var(--pr-color-danger)]" aria-hidden="true">*</span>
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

    <p v-if="errorText" :id="errorId" :class="inputMessageClass">
      {{ errorText }}
    </p>
    <p v-else-if="hint" :id="hintId" :class="inputMessageClass">
      {{ hint }}
    </p>
  </div>
</template>
