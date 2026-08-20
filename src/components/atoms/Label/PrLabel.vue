<script setup lang="ts">
import { computed } from 'vue'

export interface PrLabelProps {
  for?: string
  required?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<PrLabelProps>(), {
  for: undefined,
  required: false,
  disabled: false,
})

const labelClass = computed(() => [
  'pr-label inline-flex w-fit items-baseline gap-[var(--pr-space-1)] text-[length:var(--pr-font-size-sm)] font-semibold leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-text)]',
  props.disabled ? 'pr-label--disabled cursor-not-allowed text-[color:var(--pr-color-text-muted)]' : '',
])
</script>

<template>
  <label :class="labelClass" :for="for">
    <slot />
    <span v-if="required" class="pr-label__required text-[color:var(--pr-color-danger)]" aria-hidden="true">*</span>
  </label>
</template>
