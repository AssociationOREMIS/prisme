<script setup lang="ts">
import { computed, useId } from 'vue'
import { Check, Minus } from '@lucide/vue'
import { CheckboxIndicator, CheckboxRoot, type CheckboxCheckedState } from 'reka-ui'
import { useErrorText, type PrFieldError } from '../../fieldError'

export interface PrCheckboxProps {
  // Written out rather than reka's CheckboxCheckedState: Vue's compiler cannot read an imported
  // type, so it did not know these are booleans, and a bare Blade `default-checked` attribute
  // came in as '' (unchecked) instead of true.
  modelValue?: boolean | 'indeterminate'
  defaultChecked?: boolean | 'indeterminate'
  label?: string
  description?: string
  hint?: string
  error?: PrFieldError
  disabled?: boolean
  required?: boolean
  id?: string
  name?: string
  /** Value submitted with `name` in a native form when checked (defaults to `"on"`, matching the native `<input type="checkbox">` behavior) — set it to distinguish checkboxes sharing the same `name="options[]"`. */
  value?: string
  /**
   * Value submitted with `name` when unchecked, e.g. `"0"`: without it, an unchecked checkbox sends nothing
   * and the server cannot tell it was turned off. A hidden input placed before the control, so the
   * control's own value wins when checked. Not for a shared array name (`options[]`).
   */
  uncheckedValue?: string
}

const props = withDefaults(defineProps<PrCheckboxProps>(), {
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
  'update:modelValue': [value: CheckboxCheckedState]
}>()

// Multi-root template (label + error/hint message) disables Vue's automatic
// attrs fallthrough, so extraneous attributes like a DataTable's aria-label
// must be forwarded to the control explicitly.
defineOptions({ inheritAttrs: false })

const generatedId = useId()
const hintId = computed(() => `pr-checkbox-${generatedId}-hint`)
const errorId = computed(() => `pr-checkbox-${generatedId}-error`)
// Only the message actually shown: the error replaces the hint.
const describedBy = computed(() => {
  if (errorText.value) return errorId.value
  return props.hint ? hintId.value : undefined
})

const checkboxClass = computed(() => [
  'pr-checkbox pr:inline-flex pr:items-start pr:gap-[var(--pr-space-3)] pr:text-[color:var(--pr-color-text)] pr:leading-[var(--pr-line-height-tight)]',
  props.disabled ? 'pr-checkbox--disabled pr:cursor-not-allowed pr:text-[color:var(--pr-color-text-muted)]' : '',
])
</script>

<template>
  <label :class="checkboxClass">
    <input v-if="name && uncheckedValue !== undefined" type="hidden" :name="name" :value="uncheckedValue" :disabled="disabled">
    <CheckboxRoot
      v-bind="$attrs"
      :id="id"
      class="pr-checkbox__control pr:mt-[0.0625rem] pr:inline-grid pr:size-[1.125rem] pr:shrink-0 pr:cursor-pointer pr:appearance-none pr:place-items-center pr:rounded-[var(--pr-radius-sm)] pr:border pr:border-[var(--pr-color-border-strong)] pr:bg-[var(--pr-color-surface)] pr:p-0 pr:leading-none pr:text-[color:var(--pr-color-primary-contrast)] pr:box-border pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)] pr:data-[state=checked]:border-[var(--pr-color-primary)] pr:data-[state=checked]:bg-[var(--pr-color-primary)] pr:data-[state=indeterminate]:border-[var(--pr-color-primary)] pr:data-[state=indeterminate]:bg-[var(--pr-color-primary)] pr:data-[disabled]:cursor-not-allowed pr:data-[disabled]:opacity-60"
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
      <template #default="{ state }">
        <CheckboxIndicator
          class="pr-checkbox__indicator pr:inline-grid pr:size-full pr:place-items-center pr:leading-none pr:opacity-100 pr:scale-100 pr:transition-[opacity,transform] pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)] pr:data-[state=unchecked]:scale-[0.85] pr:data-[state=unchecked]:opacity-0 pr:[&_svg]:block pr:[&_svg]:stroke-[3]"
          force-mount
        >
          <Minus v-if="state === 'indeterminate'" :size="12" aria-hidden="true" />
          <Check v-else :size="12" aria-hidden="true" />
        </CheckboxIndicator>
      </template>
    </CheckboxRoot>
    <span v-if="label || description || $slots.default" class="pr-checkbox__text pr:grid pr:min-w-0 pr:gap-[var(--pr-space-1)]">
      <span class="pr-checkbox__label pr:inline-flex pr:items-baseline pr:gap-[var(--pr-space-1)] pr:text-[length:var(--pr-font-size-sm)] pr:font-[650] pr:leading-[var(--pr-line-height-tight)]">
        <slot>{{ label }}</slot>
        <span v-if="required" class="pr-label__required pr:text-[color:var(--pr-color-danger)]" aria-hidden="true">*</span>
      </span>
      <span v-if="description" class="pr-checkbox__description pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text-muted)]">{{ description }}</span>
    </span>
  </label>
  <p v-if="errorText" :id="errorId" class="pr-field-message pr-field-message--error pr:m-0 pr:mt-[var(--pr-space-1)] pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-danger)]">{{ errorText }}</p>
  <p v-else-if="hint" :id="hintId" class="pr-field-message pr:m-0 pr:mt-[var(--pr-space-1)] pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text-muted)]">{{ hint }}</p>
</template>
