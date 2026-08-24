<script setup lang="ts">
import { Minus, Plus } from '@lucide/vue'
import { computed, ref, useId, watch } from 'vue'

export interface PrNumberInputProps {
  modelValue?: number
  label?: string
  hint?: string
  error?: string
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

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const generatedId = useId()
const inputId = computed(() => props.id ?? `pr-number-input-${generatedId}`)
const hintId = computed(() => `${inputId.value}-hint`)
const errorId = computed(() => `${inputId.value}-error`)
const describedBy = computed(() => {
  const ids: string[] = []
  if (props.hint) ids.push(hintId.value)
  if (props.error) ids.push(errorId.value)
  return ids.length > 0 ? ids.join(' ') : undefined
})

const canDecrement = computed(() => {
  if (props.disabled) return false
  if (props.min === undefined) return true
  return (props.modelValue ?? 0) > props.min
})

const canIncrement = computed(() => {
  if (props.disabled) return false
  if (props.max === undefined) return true
  return (props.modelValue ?? 0) < props.max
})

function clamp(value: number): number {
  let v = value
  if (props.min !== undefined) v = Math.max(props.min, v)
  if (props.max !== undefined) v = Math.min(props.max, v)
  return v
}

function decrement() {
  if (!canDecrement.value) return
  emit('update:modelValue', clamp((props.modelValue ?? 0) - props.step))
}

function increment() {
  if (!canIncrement.value) return
  emit('update:modelValue', clamp((props.modelValue ?? 0) + props.step))
}

// Local text buffer so the field can be visually emptied while typing
// (e.g. to retype a value) without desyncing from modelValue until blur.
const isFocused = ref(false)
const inputValue = ref(props.modelValue !== undefined ? String(props.modelValue) : '')

watch(
  () => props.modelValue,
  (val) => {
    if (isFocused.value) return
    inputValue.value = val !== undefined ? String(val) : ''
  },
)

function onFocus() {
  isFocused.value = true
}

function onInput(event: Event) {
  const raw = (event.target as HTMLInputElement).value
  inputValue.value = raw
  if (raw.trim() === '') return
  const num = parseFloat(raw)
  if (!Number.isNaN(num)) emit('update:modelValue', clamp(num))
}

function onBlur() {
  isFocused.value = false
  const num = parseFloat(inputValue.value)
  if (inputValue.value.trim() === '' || Number.isNaN(num)) {
    inputValue.value = props.modelValue !== undefined ? String(props.modelValue) : ''
    return
  }
  const clamped = clamp(num)
  inputValue.value = String(clamped)
  if (clamped !== props.modelValue) emit('update:modelValue', clamped)
}
</script>

<template>
  <div class="pr-number-input grid gap-[var(--pr-space-2)] text-[color:var(--pr-color-text)]">
    <label
      v-if="label"
      class="pr-number-input__label inline-flex w-fit items-baseline gap-[var(--pr-space-1)] text-[length:var(--pr-font-size-sm)] font-semibold leading-[var(--pr-line-height-tight)]"
      :for="inputId"
    >
      <span>{{ label }}</span>
      <span v-if="required" class="text-[color:var(--pr-color-danger)]" aria-hidden="true">*</span>
    </label>
    <div
      class="pr-number-input__control inline-flex min-h-[2.375rem] w-full overflow-hidden rounded-[var(--pr-radius-md)] border border-[var(--pr-color-border-strong)] bg-[var(--pr-color-surface)] transition-[border-color] duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--pr-color-focus)]"
      :class="{ 'border-[var(--pr-color-danger)]': Boolean(error) }"
    >
      <button
        type="button"
        class="pr-number-input__btn flex h-full min-w-[2.375rem] cursor-pointer items-center justify-center border-r border-[var(--pr-color-border-strong)] text-[color:var(--pr-color-text-muted)] transition-colors duration-[var(--pr-duration-fast)] hover:bg-[var(--pr-color-surface-subtle)] hover:text-[color:var(--pr-color-text)] disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!canDecrement"
        aria-label="Décrémenter"
        tabindex="-1"
        @click="decrement"
      >
        <Minus :size="14" aria-hidden="true" />
      </button>
      <input
        :id="inputId"
        class="pr-number-input__field min-w-0 grow bg-transparent px-[var(--pr-space-3)] text-center text-[length:var(--pr-font-size-md)] text-[color:var(--pr-color-text)] outline-none placeholder:text-[color:var(--pr-color-text-subtle)] disabled:cursor-not-allowed disabled:text-[color:var(--pr-color-text-muted)] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        type="number"
        :value="inputValue"
        :min="min"
        :max="max"
        :step="step"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :name="name"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="describedBy"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
      />
      <button
        type="button"
        class="pr-number-input__btn flex h-full min-w-[2.375rem] cursor-pointer items-center justify-center border-l border-[var(--pr-color-border-strong)] text-[color:var(--pr-color-text-muted)] transition-colors duration-[var(--pr-duration-fast)] hover:bg-[var(--pr-color-surface-subtle)] hover:text-[color:var(--pr-color-text)] disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!canIncrement"
        aria-label="Incrémenter"
        tabindex="-1"
        @click="increment"
      >
        <Plus :size="14" aria-hidden="true" />
      </button>
    </div>
    <p v-if="error" :id="errorId" class="pr-number-input__message pr-field-message pr-field-message--error m-0 text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-danger)]">{{ error }}</p>
    <p v-else-if="hint" :id="hintId" class="pr-number-input__message pr-field-message m-0 text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-text-muted)]">{{ hint }}</p>
  </div>
</template>
