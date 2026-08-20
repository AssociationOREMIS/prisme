<script setup lang="ts">
import { computed, useId } from 'vue'

export interface PrInputProps {
  modelValue?: string | number
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  type?: string
  placeholder?: string
  id?: string
  name?: string
}

const props = withDefaults(defineProps<PrInputProps>(), {
  modelValue: '',
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

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const generatedId = useId()
const inputId = computed(() => props.id ?? `pr-input-${generatedId}`)
const hintId = computed(() => `${inputId.value}-hint`)
const errorId = computed(() => `${inputId.value}-error`)
const describedBy = computed(() => {
  const ids = []

  if (props.hint) {
    ids.push(hintId.value)
  }

  if (props.error) {
    ids.push(errorId.value)
  }

  return ids.length > 0 ? ids.join(' ') : undefined
})

const inputClass = computed(() => [
  'pr-input grid gap-[var(--pr-space-2)] text-[color:var(--pr-color-text)]',
])

const inputControlClass = computed(() => [
  'pr-input__control min-h-[2.375rem] w-full rounded-[var(--pr-radius-md)] border border-[var(--pr-color-border-strong)] bg-[var(--pr-color-surface)] px-[var(--pr-space-3)] text-[length:var(--pr-font-size-md)] text-[color:var(--pr-color-text)] transition-[background-color,border-color,box-shadow] duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)] placeholder:text-[color:var(--pr-color-text-subtle)] hover:not-disabled:border-[var(--pr-neutral-400)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)] disabled:cursor-not-allowed disabled:bg-[var(--pr-color-surface-subtle)] disabled:text-[color:var(--pr-color-text-muted)]',
  props.error ? 'border-[var(--pr-color-danger)]' : '',
])

const inputMessageClass = computed(() => [
  'pr-input__message m-0 text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-tight)]',
  props.error
    ? 'pr-input__message--error text-[color:var(--pr-color-danger)]'
    : 'text-[color:var(--pr-color-text-muted)]',
])

function updateValue(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
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
      :class="inputControlClass"
      :name="name"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy"
      @input="updateValue"
    >

    <p v-if="error" :id="errorId" :class="inputMessageClass">
      {{ error }}
    </p>
    <p v-else-if="hint" :id="hintId" :class="inputMessageClass">
      {{ hint }}
    </p>
  </div>
</template>
