<script setup lang="ts">
import { computed } from 'vue'
import { Check, Minus } from '@lucide/vue'
import { CheckboxIndicator, CheckboxRoot, type CheckboxCheckedState } from 'reka-ui'

export interface PrCheckboxProps {
  checked?: CheckboxCheckedState
  defaultChecked?: CheckboxCheckedState
  label?: string
  description?: string
  disabled?: boolean
  required?: boolean
  id?: string
  name?: string
}

const props = withDefaults(defineProps<PrCheckboxProps>(), {
  checked: undefined,
  defaultChecked: false,
  label: undefined,
  description: undefined,
  disabled: false,
  required: false,
  id: undefined,
  name: undefined,
})

const emit = defineEmits<{
  'update:checked': [value: CheckboxCheckedState]
}>()

const checkboxClass = computed(() => [
  'pr-checkbox inline-flex items-start gap-[var(--pr-space-3)] text-[color:var(--pr-color-text)] leading-[var(--pr-line-height-tight)]',
  props.disabled ? 'pr-checkbox--disabled cursor-not-allowed text-[color:var(--pr-color-text-muted)]' : '',
])
</script>

<template>
  <label :class="checkboxClass">
    <CheckboxRoot
      class="pr-checkbox__control mt-[0.0625rem] inline-grid size-[1.125rem] shrink-0 cursor-pointer appearance-none place-items-center rounded-[var(--pr-radius-sm)] border border-[var(--pr-color-border-strong)] bg-[var(--pr-color-surface)] p-0 leading-none text-[color:var(--pr-color-primary-contrast)] box-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)] data-[state=checked]:border-[var(--pr-color-primary)] data-[state=checked]:bg-[var(--pr-color-primary)] data-[state=indeterminate]:border-[var(--pr-color-primary)] data-[state=indeterminate]:bg-[var(--pr-color-primary)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60"
      :checked="checked"
      :default-checked="defaultChecked"
      :disabled="disabled"
      :required="required"
      :id="id"
      :name="name"
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
</template>
