<script setup lang="ts">
import { computed } from 'vue'
import { SwitchRoot, SwitchThumb } from 'reka-ui'

export interface PrSwitchProps {
  checked?: boolean
  defaultChecked?: boolean
  label?: string
  description?: string
  disabled?: boolean
  required?: boolean
  id?: string
  name?: string
}

const props = withDefaults(defineProps<PrSwitchProps>(), {
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
  'update:checked': [value: boolean]
}>()

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
      class="pr-switch__control relative inline-flex h-[1.375rem] w-[2.375rem] shrink-0 cursor-pointer items-center rounded-[var(--pr-radius-full)] border border-[var(--pr-color-border-strong)] bg-[var(--pr-color-surface-subtle)] p-0.5 transition-[background-color,border-color] duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)] data-[state=checked]:border-[var(--pr-color-primary)] data-[state=checked]:bg-[var(--pr-color-primary)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60"
      :checked="checked"
      :default-checked="defaultChecked"
      :disabled="disabled"
      :required="required"
      :id="id"
      :name="name"
      @update:checked="emit('update:checked', $event)"
    >
      <SwitchThumb class="pr-switch__thumb block size-4 translate-x-0 rounded-[var(--pr-radius-full)] bg-[var(--pr-color-surface)] shadow-[var(--pr-shadow-xs)] transition-transform duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)] data-[state=checked]:translate-x-4" />
    </SwitchRoot>
  </label>
</template>
