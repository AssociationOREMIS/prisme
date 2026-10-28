<script setup lang="ts">
import { computed, useAttrs, useId } from 'vue'
import { PrLabel } from '../Label'
import { useErrorText, type PrFieldError } from '../../fieldError'
import { useFieldValue } from '../../fieldValue'
import { warnWithoutName } from '../../accessibleName'

export interface PrTextareaProps {
  modelValue?: string
  /** Initial value of a field without `v-model` (a Blade form): the field then keeps what is typed. */
  defaultValue?: string
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
  defaultValue: undefined,
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

warnWithoutName('PrTextarea', props.label)

// One message, or the first of Laravel's array of messages.
const errorText = useErrorText(() => props.error)

// A plain Blade `value="{{ old('x') }}"` (in $attrs) also gives the initial value.
const attrs = useAttrs()
const { value: fieldValue, set: setFieldValue } = useFieldValue(props, () => attrs.value as string | undefined)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const generatedId = useId()
const textareaId = computed(() => props.id ?? `pr-textarea-${generatedId}`)
const hintId = computed(() => `${textareaId.value}-hint`)
const errorId = computed(() => `${textareaId.value}-error`)
// The error, then the hint: the hint stays shown with the error, the format it gives is what
// fixing the error needs (RGAA 11.10).
const describedBy = computed(() => [
  errorText.value ? errorId.value : undefined,
  props.hint ? hintId.value : undefined,
].filter(Boolean).join(' ') || undefined)

const textareaClass = computed(() => [
  'pr-textarea pr:grid pr:content-start pr:gap-[var(--pr-space-2)] pr:text-[color:var(--pr-color-text)]',
])

const textareaResizeClass: Record<NonNullable<PrTextareaProps['resize']>, string> = {
  none: 'pr:resize-none',
  vertical: 'pr:resize-y',
  horizontal: 'pr:resize-x',
  both: 'pr:resize',
}

const textareaControlClass = computed(() => [
  'pr-textarea__control pr:min-h-24 pr:w-full pr:rounded-[var(--pr-radius-md)] pr:border pr:border-[var(--pr-color-border-strong)] pr:bg-[var(--pr-color-surface)] pr:p-[var(--pr-space-3)] pr:font-[inherit] pr:text-[length:var(--pr-font-size-md)] pr:leading-[var(--pr-line-height-normal)] pr:text-[color:var(--pr-color-text)] pr:transition-[background-color,border-color,box-shadow] pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)] pr:placeholder:text-[color:var(--pr-color-text-subtle)] pr:hover:not-disabled:border-[var(--pr-color-border-hover)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)] pr:disabled:cursor-not-allowed pr:disabled:bg-[var(--pr-color-surface-subtle)] pr:disabled:text-[color:var(--pr-color-text-muted)]',
  errorText.value ? 'pr:border-[var(--pr-color-danger)]' : '',
  textareaResizeClass[props.resize],
])

const fieldMessageClassBase = 'pr-textarea__message pr-field-message pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)]'
const hintMessageClass = `${fieldMessageClassBase} pr:text-[color:var(--pr-color-text-muted)]`
const errorMessageClass = `${fieldMessageClassBase} pr-textarea__message--error pr-field-message--error pr:text-[color:var(--pr-color-danger)]`

function updateValue(event: Event) {
  const value = (event.target as HTMLTextAreaElement).value
  setFieldValue(value)
  emit('update:modelValue', value)
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
    <p v-if="hint" :id="hintId" :class="hintMessageClass">
      {{ hint }}
    </p>
    <p v-if="errorText" :id="errorId" :class="errorMessageClass">
      {{ errorText }}
    </p>
  </div>
</template>
