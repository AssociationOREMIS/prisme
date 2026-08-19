<script setup lang="ts">
export interface PrLabelProps {
  for?: string
  required?: boolean
  disabled?: boolean
}

withDefaults(defineProps<PrLabelProps>(), {
  for: undefined,
  required: false,
  disabled: false,
})
</script>

<template>
  <label class="pr-label" :class="{ 'pr-label--disabled': disabled }" :for="for">
    <slot />
    <span v-if="required" class="pr-label__required" aria-hidden="true">*</span>
  </label>
</template>
