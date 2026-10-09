<script setup lang="ts">
import { computed, useId } from 'vue'
import { SwitchRoot, SwitchThumb } from 'reka-ui'
import { useErrorText, type PrFieldError } from '../../fieldError'

export interface PrSwitchProps {
  modelValue?: boolean
  defaultChecked?: boolean
  label?: string
  description?: string
  hint?: string
  error?: PrFieldError
  disabled?: boolean
  required?: boolean
  id?: string
  name?: string
  /** Value submitted with `name` in a native form when on (defaults to `"on"`) — set it to distinguish switches sharing the same `name="options[]"`. */
  value?: string
  /**
   * Value submitted with `name` when off, e.g. `"0"`: without it, an unchecked switch sends nothing
   * and the server cannot tell it was turned off. A hidden input placed before the control, so the
   * control's own value wins when on. Not for a shared array name (`options[]`).
   */
  uncheckedValue?: string
}

const props = withDefaults(defineProps<PrSwitchProps>(), {
  modelValue: undefined,
  defaultChecked: false,
  label: undefined,
  description: undefined,
  hint: undefined,
  error: undefined,
  disabled: false,
  required: false,
  id: undefined,
  name: undefined,
  value: undefined,
  uncheckedValue: undefined,
})

// One message, or the first of Laravel's array of messages.
const errorText = useErrorText(() => props.error)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// Multi-root template (label + error/hint message) disables Vue's automatic
// attrs fallthrough, so extraneous attributes must be forwarded explicitly.
defineOptions({ inheritAttrs: false })

const generatedId = useId()
const hintId = computed(() => `pr-switch-${generatedId}-hint`)
const errorId = computed(() => `pr-switch-${generatedId}-error`)
// Only the message actually shown: the error replaces the hint.
const describedBy = computed(() => {
  if (errorText.value) return errorId.value
  return props.hint ? hintId.value : undefined
})

const switchClass = computed(() => [
  'pr-switch pr:inline-flex pr:items-start pr:justify-between pr:gap-[var(--pr-space-3)] pr:text-[color:var(--pr-color-text)]',
  props.disabled ? 'pr-switch--disabled pr:cursor-not-allowed pr:text-[color:var(--pr-color-text-muted)]' : '',
])
</script>

<template>
  <label :class="switchClass">
    <span v-if="label || description || $slots.default" class="pr-switch__text pr:grid pr:min-w-0 pr:gap-[var(--pr-space-1)]">
      <span class="pr-switch__label pr:inline-flex pr:items-baseline pr:gap-[var(--pr-space-1)] pr:text-[length:var(--pr-font-size-sm)] pr:font-[650] pr:leading-[var(--pr-line-height-tight)]">
        <slot>{{ label }}</slot>
        <span v-if="required" class="pr-label__required pr:text-[color:var(--pr-color-danger)]" aria-hidden="true">*</span>
      </span>
      <span v-if="description" class="pr-switch__description pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text-muted)]">{{ description }}</span>
    </span>
    <input v-if="name && uncheckedValue !== undefined" type="hidden" :name="name" :value="uncheckedValue" :disabled="disabled">
    <SwitchRoot
      v-bind="$attrs"
      :id="id"
      class="pr-switch__control pr:relative pr:inline-flex pr:h-[1.375rem] pr:w-[2.375rem] pr:shrink-0 pr:cursor-pointer pr:items-center pr:rounded-[var(--pr-radius-full)] pr:border pr:border-[var(--pr-color-border-strong)] pr:bg-[var(--pr-color-surface-subtle)] pr:p-0.5 pr:transition-[background-color,border-color] pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)] pr:data-[state=checked]:border-[var(--pr-color-primary)] pr:data-[state=checked]:bg-[var(--pr-color-primary)] pr:data-[disabled]:cursor-not-allowed pr:data-[disabled]:opacity-60"
      :model-value="modelValue"
      :default-value="defaultChecked"
      :disabled="disabled"
      :required="required"
      :name="name"
      :value="value"
      :aria-invalid="errorText ? 'true' : undefined"
      :aria-describedby="describedBy"
      @update:model-value="emit('update:modelValue', $event)"
    >
      <SwitchThumb class="pr-switch__thumb pr:block pr:size-4 pr:translate-x-0 pr:rounded-[var(--pr-radius-full)] pr:bg-[var(--pr-color-surface)] pr:shadow-[var(--pr-shadow-xs)] pr:transition-transform pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)] pr:data-[state=checked]:translate-x-4" />
    </SwitchRoot>
  </label>
  <p v-if="errorText" :id="errorId" class="pr-field-message pr-field-message--error pr:m-0 pr:mt-[var(--pr-space-1)] pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-danger)]">{{ errorText }}</p>
  <p v-else-if="hint" :id="hintId" class="pr-field-message pr:m-0 pr:mt-[var(--pr-space-1)] pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text-muted)]">{{ hint }}</p>
</template>
