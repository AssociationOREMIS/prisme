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

function updateValue(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
}
</script>

<template>
  <div
    class="pr-textarea"
    :class="[
      `pr-textarea--resize-${resize}`,
      { 'pr-textarea--invalid': Boolean(error) },
    ]"
  >
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
      class="pr-textarea__control"
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
    <p v-if="error" :id="errorId" class="pr-field-message pr-field-message--error">
      {{ error }}
    </p>
    <p v-else-if="hint" :id="hintId" class="pr-field-message">
      {{ hint }}
    </p>
  </div>
</template>
