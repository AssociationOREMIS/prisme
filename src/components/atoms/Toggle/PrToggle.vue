<script setup lang="ts">
import { computed } from 'vue'
import { Toggle } from 'reka-ui'

export interface PrToggleProps {
  modelValue?: boolean
  defaultPressed?: boolean
  disabled?: boolean
  size?: 'sm' | 'md'
  variant?: 'default' | 'ghost'
  ariaLabel?: string
}

const props = withDefaults(defineProps<PrToggleProps>(), {
  modelValue: undefined,
  defaultPressed: false,
  disabled: false,
  size: 'md',
  variant: 'default',
  ariaLabel: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const toggleSizeClass: Record<NonNullable<PrToggleProps['size']>, string> = {
  sm: 'pr:min-h-8 pr:min-w-8 pr:px-[var(--pr-space-2)]',
  md: 'pr:min-h-[2.375rem] pr:min-w-[2.375rem] pr:px-[var(--pr-space-3)]',
}

const toggleClass = computed(() => [
  'pr-toggle pr:inline-grid pr:cursor-pointer pr:place-items-center pr:rounded-[var(--pr-radius-md)] pr:border pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)] pr:font-[650] pr:text-[color:var(--pr-color-text)] pr:transition-[background-color,border-color,color] pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)] pr:hover:not-disabled:bg-[var(--pr-color-surface-subtle)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)] pr:disabled:cursor-not-allowed pr:disabled:opacity-[0.58] pr:data-[state=on]:border-[var(--pr-color-primary)] pr:data-[state=on]:bg-[var(--pr-color-primary)] pr:data-[state=on]:text-[color:var(--pr-color-primary-contrast)] pr:data-[state=on]:hover:not-disabled:border-[var(--pr-color-primary-hover)] pr:data-[state=on]:hover:not-disabled:bg-[var(--pr-color-primary-hover)]',
  toggleSizeClass[props.size],
  props.variant === 'ghost' ? 'pr-toggle--ghost pr:border-transparent pr:bg-transparent' : '',
])
</script>

<template>
  <Toggle
    :class="toggleClass"
    :model-value="modelValue"
    :default-value="defaultPressed"
    :disabled="disabled"
    :aria-label="ariaLabel"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <slot />
  </Toggle>
</template>
