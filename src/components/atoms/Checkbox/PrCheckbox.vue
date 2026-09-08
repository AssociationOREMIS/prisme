<script setup lang="ts">
import { computed, useId } from 'vue'
import { Check, Minus } from '@lucide/vue'
import { CheckboxIndicator, CheckboxRoot, type CheckboxCheckedState } from 'reka-ui'

export interface PrCheckboxProps {
  checked?: CheckboxCheckedState
  defaultChecked?: CheckboxCheckedState
  label?: string
  description?: string
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  id?: string
  name?: string
  /** Value submitted with `name` in a native form when checked (defaults to `"on"`, matching the native `<input type="checkbox">` behavior) — set it to distinguish checkboxes sharing the same `name="options[]"`. */
  value?: string
}

const props = withDefaults(defineProps<PrCheckboxProps>(), {
  checked: undefined,
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
})

const emit = defineEmits<{
  'update:checked': [value: CheckboxCheckedState]
}>()

// Multi-root template (label + error/hint message) disables Vue's automatic
// attrs fallthrough, so extraneous attributes like a DataTable's aria-label
// must be forwarded to the control explicitly.
defineOptions({ inheritAttrs: false })

const generatedId = useId()
const hintId = computed(() => `pr-checkbox-${generatedId}-hint`)
const errorId = computed(() => `pr-checkbox-${generatedId}-error`)
const describedBy = computed(() => {
  const ids: string[] = []
  if (props.hint) ids.push(hintId.value)
  if (props.error) ids.push(errorId.value)
  return ids.length > 0 ? ids.join(' ') : undefined
})

const checkboxClass = computed(() => [
  'pr-checkbox inline-flex items-start gap-[var(--pr-space-3)] text-[color:var(--pr-color-text)] leading-[var(--pr-line-height-tight)]',
  props.disabled ? 'pr-checkbox--disabled cursor-not-allowed text-[color:var(--pr-color-text-muted)]' : '',
])
</script>

<template>
  <label :class="checkboxClass">
    <CheckboxRoot
      v-bind="$attrs"
      class="pr-checkbox__control mt-[0.0625rem] inline-grid size-[1.125rem] shrink-0 cursor-pointer appearance-none place-items-center rounded-[var(--pr-radius-sm)] border border-[var(--pr-color-border-strong)] bg-[var(--pr-color-surface)] p-0 leading-none text-[color:var(--pr-color-primary-contrast)] box-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)] data-[state=checked]:border-[var(--pr-color-primary)] data-[state=checked]:bg-[var(--pr-color-primary)] data-[state=indeterminate]:border-[var(--pr-color-primary)] data-[state=indeterminate]:bg-[var(--pr-color-primary)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60"
      :checked="checked"
      :default-checked="defaultChecked"
      :disabled="disabled"
      :required="required"
      :id="id"
      :name="name"
      :value="value"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy"
      @update:checked="emit('update:checked', $event)"
    >
      <template #default="{ state }">
        <CheckboxIndicator
          class="pr-checkbox__indicator inline-grid size-full place-items-center leading-none opacity-100 scale-100 transition-[opacity,transform] duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)] data-[state=unchecked]:scale-[0.85] data-[state=unchecked]:opacity-0 [&_svg]:block [&_svg]:stroke-[3]"
          force-mount
        >
          <Minus v-if="state === 'indeterminate'" :size="12" aria-hidden="true" />
          <Check v-else :size="12" aria-hidden="true" />
        </CheckboxIndicator>
      </template>
    </CheckboxRoot>
    <span v-if="label || description || $slots.default" class="pr-checkbox__text grid min-w-0 gap-[var(--pr-space-1)]">
      <span class="pr-checkbox__label inline-flex items-baseline gap-[var(--pr-space-1)] text-[length:var(--pr-font-size-sm)] font-[650] leading-[var(--pr-line-height-tight)]">
        <slot>{{ label }}</slot>
        <span v-if="required" class="pr-label__required text-[color:var(--pr-color-danger)]" aria-hidden="true">*</span>
      </span>
      <span v-if="description" class="pr-checkbox__description text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-text-muted)]">{{ description }}</span>
    </span>
  </label>
  <p v-if="error" :id="errorId" class="pr-field-message pr-field-message--error m-0 mt-[var(--pr-space-1)] text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-danger)]">{{ error }}</p>
  <p v-else-if="hint" :id="hintId" class="pr-field-message m-0 mt-[var(--pr-space-1)] text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-text-muted)]">{{ hint }}</p>
</template>
