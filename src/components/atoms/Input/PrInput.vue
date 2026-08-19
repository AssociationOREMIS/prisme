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

function updateValue(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="pr-input" :class="{ 'pr-input--invalid': Boolean(error) }">
    <label v-if="label" class="pr-input__label" :for="inputId">
      <span>{{ label }}</span>
      <span v-if="required" class="pr-input__required" aria-hidden="true">*</span>
    </label>

    <input
      :id="inputId"
      class="pr-input__control"
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

    <p v-if="error" :id="errorId" class="pr-input__message pr-input__message--error">
      {{ error }}
    </p>
    <p v-else-if="hint" :id="hintId" class="pr-input__message">
      {{ hint }}
    </p>
  </div>
</template>
