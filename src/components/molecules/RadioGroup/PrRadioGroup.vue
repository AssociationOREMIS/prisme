<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import { Circle } from '@lucide/vue'
import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot } from 'reka-ui'
import { PrLabel } from '../../atoms/Label'
import { useErrorText, type PrFieldError } from '../../fieldError'

export interface PrRadioOption {
  label: string
  value: string
  description?: string
  disabled?: boolean
}

export interface PrRadioGroupProps {
  modelValue?: string
  defaultValue?: string
  options?: PrRadioOption[]
  label?: string
  hint?: string
  error?: PrFieldError
  name?: string
  orientation?: 'horizontal' | 'vertical'
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<PrRadioGroupProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  options: () => [],
  label: undefined,
  hint: undefined,
  error: undefined,
  name: undefined,
  orientation: 'vertical',
  disabled: false,
  required: false,
})

// One message, or the first of Laravel's array of messages.
const errorText = useErrorText(() => props.error)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const generatedId = useId()

// Without a v-model (a plain Blade form with only `default-value`), binding the root to
// `modelValue ?? defaultValue` would keep it controlled at a constant value and freeze the
// selection. Track the live value locally, as PrSlider does; a real v-model still wins.
const internalValue = ref(props.modelValue ?? props.defaultValue)

watch(() => props.modelValue, (value) => {
  if (value !== undefined) internalValue.value = value
})

const rootValue = computed(() => props.modelValue ?? internalValue.value)
const labelId = computed(() => `pr-radio-group-${generatedId}-label`)
const hintId = computed(() => `pr-radio-group-${generatedId}-hint`)
const errorId = computed(() => `pr-radio-group-${generatedId}-error`)
// Only the message actually shown: the error replaces the hint.
const describedBy = computed(() => {
  if (errorText.value) return errorId.value
  return props.hint ? hintId.value : undefined
})

const radioRootClass = computed(() => [
  'pr-radio-group__root',
  props.orientation === 'horizontal'
    ? 'pr-radio-group__root--horizontal pr:flex pr:flex-wrap pr:gap-[var(--pr-space-4)]'
    : 'pr:grid pr:gap-[var(--pr-space-3)]',
])

function updateValue(value: unknown) {
  if (typeof value === 'string') {
    internalValue.value = value
    emit('update:modelValue', value)
  }
}
</script>

<template>
  <div class="pr-radio-group pr:grid pr:gap-[var(--pr-space-2)] pr:text-[color:var(--pr-color-text)]">
    <!-- A group has no single input for the label to point at: it names the radiogroup through aria-labelledby. -->
    <PrLabel v-if="label" :id="labelId" :required="required" :disabled="disabled">{{ label }}</PrLabel>
    <RadioGroupRoot
      :class="radioRootClass"
      :model-value="rootValue"
      :orientation="orientation"
      :disabled="disabled"
      :required="required"
      :name="name"
      :aria-invalid="errorText ? 'true' : undefined"
      :aria-labelledby="label ? labelId : undefined"
      :aria-describedby="describedBy"
      @update:model-value="updateValue"
    >
      <label
        v-for="option in options"
        :key="option.value"
        class="pr-radio-group__option pr:inline-flex pr:items-start pr:gap-[var(--pr-space-3)]"
        :class="{ 'pr-radio-group__option--disabled pr:cursor-not-allowed pr:text-[color:var(--pr-color-text-muted)]': disabled || option.disabled }"
      >
        <RadioGroupItem
          class="pr-radio-group__item pr:inline-grid pr:size-[1.125rem] pr:shrink-0 pr:cursor-pointer pr:place-items-center pr:rounded-[var(--pr-radius-full)] pr:border pr:border-[var(--pr-color-border-strong)] pr:bg-[var(--pr-color-surface)] pr:text-[color:var(--pr-color-primary)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)] pr:data-[state=checked]:border-[var(--pr-color-primary)] pr:data-[disabled]:cursor-not-allowed pr:data-[disabled]:opacity-60"
          :id="`${generatedId}-${option.value}`"
          :value="option.value"
          :disabled="disabled || option.disabled"
        >
          <RadioGroupIndicator class="pr-radio-group__indicator pr:inline-grid pr:size-full pr:place-items-center pr:leading-none">
            <Circle :size="8" fill="currentColor" aria-hidden="true" />
          </RadioGroupIndicator>
        </RadioGroupItem>
        <span class="pr-radio-group__text pr:grid pr:min-w-0 pr:gap-[var(--pr-space-1)]">
          <span class="pr-radio-group__label pr:inline-flex pr:items-baseline pr:gap-[var(--pr-space-1)] pr:text-[length:var(--pr-font-size-sm)] pr:font-[650] pr:leading-[var(--pr-line-height-tight)]">{{ option.label }}</span>
          <span v-if="option.description" class="pr-radio-group__description pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text-muted)]">
            {{ option.description }}
          </span>
        </span>
      </label>
    </RadioGroupRoot>
    <p v-if="errorText" :id="errorId" class="pr-field-message pr-field-message--error pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-danger)]">{{ errorText }}</p>
    <p v-else-if="hint" :id="hintId" class="pr-field-message pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text-muted)]">{{ hint }}</p>
  </div>
</template>
