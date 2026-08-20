<script setup lang="ts">
import { computed } from 'vue'
import { Toggle } from 'reka-ui'

export interface PrToggleProps {
  pressed?: boolean
  defaultPressed?: boolean
  disabled?: boolean
  size?: 'sm' | 'md'
  variant?: 'default' | 'ghost'
  ariaLabel?: string
}

const props = withDefaults(defineProps<PrToggleProps>(), {
  pressed: undefined,
  defaultPressed: false,
  disabled: false,
  size: 'md',
  variant: 'default',
  ariaLabel: undefined,
})

const emit = defineEmits<{
  'update:pressed': [value: boolean]
}>()

const toggleSizeClass: Record<NonNullable<PrToggleProps['size']>, string> = {
  sm: 'min-h-8 min-w-8 px-[var(--pr-space-2)]',
  md: 'min-h-[2.375rem] min-w-[2.375rem] px-[var(--pr-space-3)]',
}

const toggleClass = computed(() => [
  'pr-toggle inline-grid cursor-pointer place-items-center rounded-[var(--pr-radius-md)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] font-[650] text-[color:var(--pr-color-text)] transition-[background-color,border-color,color] duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)] hover:not-disabled:bg-[var(--pr-color-surface-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)] disabled:cursor-not-allowed disabled:opacity-[0.58] data-[state=on]:border-[var(--pr-color-primary)] data-[state=on]:bg-[var(--pr-color-primary)] data-[state=on]:text-[color:var(--pr-color-primary-contrast)] data-[state=on]:hover:not-disabled:border-[var(--pr-color-primary-hover)] data-[state=on]:hover:not-disabled:bg-[var(--pr-color-primary-hover)]',
  toggleSizeClass[props.size],
  props.variant === 'ghost' ? 'pr-toggle--ghost border-transparent bg-transparent' : '',
])
</script>

<template>
  <Toggle
    :class="toggleClass"
    :pressed="pressed"
    :default-pressed="defaultPressed"
    :disabled="disabled"
    :aria-label="ariaLabel"
    @update:pressed="emit('update:pressed', $event)"
  >
    <slot />
  </Toggle>
</template>
