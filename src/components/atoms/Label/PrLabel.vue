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
  'pr-label pr:inline-flex pr:w-fit pr:items-baseline pr:gap-[var(--pr-space-1)] pr:text-[length:var(--pr-font-size-sm)] pr:font-semibold pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text)]',
  props.disabled ? 'pr-label--disabled pr:cursor-not-allowed pr:text-[color:var(--pr-color-text-muted)]' : '',
])
</script>

<template>
  <label :class="labelClass" :for="props.for">
    <slot />
    <span v-if="required" class="pr-label__required pr:text-[color:var(--pr-color-danger)]" aria-hidden="true">*</span>
  </label>
</template>
