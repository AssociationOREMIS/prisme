<script setup lang="ts">
import { computed, useId } from 'vue'
import { SwitchRoot, SwitchThumb } from 'reka-ui'

export interface PrSwitchProps {
  checked?: boolean
  defaultChecked?: boolean
  label?: string
  description?: string
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  id?: string
  name?: string
  /** Value submitted with `name` in a native form when on (defaults to `"on"`) — set it to distinguish switches sharing the same `name="options[]"`. */
  value?: string
}

const props = withDefaults(defineProps<PrSwitchProps>(), {
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
  'update:checked': [value: boolean]
}>()

// Multi-root template (label + error/hint message) disables Vue's automatic
// attrs fallthrough, so extraneous attributes must be forwarded explicitly.
defineOptions({ inheritAttrs: false })

const generatedId = useId()
const hintId = computed(() => `pr-switch-${generatedId}-hint`)
const errorId = computed(() => `pr-switch-${generatedId}-error`)
const describedBy = computed(() => {
  const ids: string[] = []
  if (props.hint) ids.push(hintId.value)
  if (props.error) ids.push(errorId.value)
  return ids.length > 0 ? ids.join(' ') : undefined
})

const switchClass = computed(() => [
  'pr-switch inline-flex items-start justify-between gap-[var(--pr-space-3)] text-[color:var(--pr-color-text)]',
  props.disabled ? 'pr-switch--disabled cursor-not-allowed text-[color:var(--pr-color-text-muted)]' : '',
])
</script>

<template>
  <label :class="switchClass">
    <span v-if="label || description || $slots.default" class="pr-switch__text grid min-w-0 gap-[var(--pr-space-1)]">
      <span class="pr-switch__label inline-flex items-baseline gap-[var(--pr-space-1)] text-[length:var(--pr-font-size-sm)] font-[650] leading-[var(--pr-line-height-tight)]">
        <slot>{{ label }}</slot>
        <span v-if="required" class="pr-label__required text-[color:var(--pr-color-danger)]" aria-hidden="true">*</span>
      </span>
      <span v-if="description" class="pr-switch__description text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-text-muted)]">{{ description }}</span>
    </span>
    <SwitchRoot
      v-bind="$attrs"
      class="pr-switch__control relative inline-flex h-[1.375rem] w-[2.375rem] shrink-0 cursor-pointer items-center rounded-[var(--pr-radius-full)] border border-[var(--pr-color-border-strong)] bg-[var(--pr-color-surface-subtle)] p-0.5 transition-[background-color,border-color] duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)] data-[state=checked]:border-[var(--pr-color-primary)] data-[state=checked]:bg-[var(--pr-color-primary)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60"
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
      <SwitchThumb class="pr-switch__thumb block size-4 translate-x-0 rounded-[var(--pr-radius-full)] bg-[var(--pr-color-surface)] shadow-[var(--pr-shadow-xs)] transition-transform duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)] data-[state=checked]:translate-x-4" />
    </SwitchRoot>
  </label>
  <p v-if="error" :id="errorId" class="pr-field-message pr-field-message--error m-0 mt-[var(--pr-space-1)] text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-danger)]">{{ error }}</p>
  <p v-else-if="hint" :id="hintId" class="pr-field-message m-0 mt-[var(--pr-space-1)] text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-text-muted)]">{{ hint }}</p>
</template>
