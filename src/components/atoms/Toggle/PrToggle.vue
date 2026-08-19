<script setup lang="ts">
import { Toggle } from 'reka-ui'

export interface PrToggleProps {
  pressed?: boolean
  defaultPressed?: boolean
  disabled?: boolean
  size?: 'sm' | 'md'
  variant?: 'default' | 'ghost'
  ariaLabel?: string
}

withDefaults(defineProps<PrToggleProps>(), {
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
</script>

<template>
  <Toggle
    class="pr-toggle"
    :class="[`pr-toggle--${size}`, `pr-toggle--${variant}`]"
    :pressed="pressed"
    :default-pressed="defaultPressed"
    :disabled="disabled"
    :aria-label="ariaLabel"
    @update:pressed="emit('update:pressed', $event)"
  >
    <slot />
  </Toggle>
</template>
