<script setup lang="ts">
import { computed, useAttrs, useId } from 'vue'
import { PrLabel } from '../Label'
import { useErrorText, type PrFieldError } from '../../fieldError'

export interface PrTextareaProps {
  modelValue?: string
  label?: string
  hint?: string
  error?: PrFieldError
  disabled?: boolean
  required?: boolean
  placeholder?: string
  id?: string
  name?: string
  rows?: number
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

const props = withDefaults(defineProps<PrTextareaProps>(), {
  modelValue: undefined,
  label: undefined,
  hint: undefined,
  error: undefined,
  disabled: false,
  required: false,
  placeholder: undefined,
  id: undefined,
  name: undefined,
  rows: 4,
  resize: 'vertical',
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
const textareaId = computed(() => props.id ?? `pr-textarea-${generatedId}`)
const hintId = computed(() => `${textareaId.value}-hint`)
const errorId = computed(() => `${textareaId.value}-error`)
// Only the message actually shown: the error replaces the hint.
const describedBy = computed(() => {
  if (errorText.value) return errorId.value
  return props.hint ? hintId.value : undefined
})

const textareaClass = computed(() => [
  'pr-textarea pr:grid pr:gap-[var(--pr-space-2)] pr:text-[color:var(--pr-color-text)]',
])

const textareaResizeClass: Record<NonNullable<PrTextareaProps['resize']>, string> = {
  none: 'pr:resize-none',
  vertical: 'pr:resize-y',
  horizontal: 'pr:resize-x',
  both: 'pr:resize',
}

const textareaControlClass = computed(() => [
  'pr-textarea__control pr:min-h-24 pr:w-full pr:rounded-[var(--pr-radius-md)] pr:border pr:border-[var(--pr-color-border-strong)] pr:bg-[var(--pr-color-surface)] pr:p-[var(--pr-space-3)] pr:font-[inherit] pr:text-[length:var(--pr-font-size-md)] pr:leading-[var(--pr-line-height-normal)] pr:text-[color:var(--pr-color-text)] pr:transition-[background-color,border-color,box-shadow] pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)] pr:placeholder:text-[color:var(--pr-color-text-subtle)] pr:hover:not-disabled:border-[var(--pr-neutral-400)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)] pr:disabled:cursor-not-allowed pr:disabled:bg-[var(--pr-color-surface-subtle)] pr:disabled:text-[color:var(--pr-color-text-muted)]',
  errorText.value ? 'pr:border-[var(--pr-color-danger)]' : '',
  textareaResizeClass[props.resize],
])

const fieldMessageClass = computed(() => [
  'pr-textarea__message pr-field-message pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)]',
  errorText.value
    ? 'pr-textarea__message--error pr-field-message--error pr:text-[color:var(--pr-color-danger)]'
    : 'pr:text-[color:var(--pr-color-text-muted)]',
])

function updateValue(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
}

// The template root is a wrapper <div>, not the <textarea> — forward
// fallthrough attrs (autocomplete, maxlength, data-*, ...) to the control.
defineOptions({ inheritAttrs: false })
</script>

<template>
  <div :class="textareaClass">
    <PrLabel
      v-if="label"
      :for="textareaId"
      :required="required"
      :disabled="disabled"
    >
      {{ label }}
    </PrLabel>
    <textarea
      :id="textareaId"
      v-bind="$attrs"
      :class="textareaControlClass"
      :name="name"
      :value="fieldValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      :aria-invalid="errorText ? 'true' : undefined"
      :aria-describedby="describedBy"
      @input="updateValue"
    />
    <p v-if="errorText" :id="errorId" :class="fieldMessageClass">
      {{ errorText }}
    </p>
    <p v-else-if="hint" :id="hintId" :class="fieldMessageClass">
      {{ hint }}
    </p>
  </div>
</template>
