<script setup lang="ts">
import { computed, useId } from 'vue'
import { PrLabel } from '../Label'

export interface PrTextareaProps {
  modelValue?: string
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  placeholder?: string
  id?: string
  name?: string
  rows?: number
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

const props = withDefaults(defineProps<PrTextareaProps>(), {
  modelValue: '',
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

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const generatedId = useId()
const textareaId = computed(() => props.id ?? `pr-textarea-${generatedId}`)
const hintId = computed(() => `${textareaId.value}-hint`)
const errorId = computed(() => `${textareaId.value}-error`)
const describedBy = computed(() => {
  const ids = []

  if (props.hint) ids.push(hintId.value)
  if (props.error) ids.push(errorId.value)

  return ids.length > 0 ? ids.join(' ') : undefined
})

const textareaClass = computed(() => [
  'pr-textarea grid gap-[var(--pr-space-2)] text-[color:var(--pr-color-text)]',
])

const textareaResizeClass: Record<NonNullable<PrTextareaProps['resize']>, string> = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize',
}

const textareaControlClass = computed(() => [
  'pr-textarea__control min-h-24 w-full rounded-[var(--pr-radius-md)] border border-[var(--pr-color-border-strong)] bg-[var(--pr-color-surface)] p-[var(--pr-space-3)] font-[inherit] text-[length:var(--pr-font-size-md)] leading-[var(--pr-line-height-normal)] text-[color:var(--pr-color-text)] transition-[background-color,border-color,box-shadow] duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)] placeholder:text-[color:var(--pr-color-text-subtle)] hover:not-disabled:border-[var(--pr-neutral-400)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)] disabled:cursor-not-allowed disabled:bg-[var(--pr-color-surface-subtle)] disabled:text-[color:var(--pr-color-text-muted)]',
  props.error ? 'border-[var(--pr-color-danger)]' : '',
  textareaResizeClass[props.resize],
])

const fieldMessageClass = computed(() => [
  'pr-field-message m-0 text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-tight)]',
  props.error
    ? 'pr-field-message--error text-[color:var(--pr-color-danger)]'
    : 'text-[color:var(--pr-color-text-muted)]',
])

function updateValue(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
}
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
      :class="textareaControlClass"
      :name="name"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy"
      @input="updateValue"
    />
    <p v-if="error" :id="errorId" :class="fieldMessageClass">
      {{ error }}
    </p>
    <p v-else-if="hint" :id="hintId" :class="fieldMessageClass">
      {{ hint }}
    </p>
  </div>
</template>
