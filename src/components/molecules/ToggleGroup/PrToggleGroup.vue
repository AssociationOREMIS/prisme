<script setup lang="ts">
import { ToggleGroupItem, ToggleGroupRoot } from 'reka-ui'

export interface PrToggleGroupItem {
  label: string
  value: string
  disabled?: boolean
}

export interface PrToggleGroupProps {
  modelValue?: string | string[]
  items?: PrToggleGroupItem[]
  type?: 'single' | 'multiple'
  disabled?: boolean
  ariaLabel?: string
}

withDefaults(defineProps<PrToggleGroupProps>(), {
  modelValue: undefined,
  items: () => [],
  type: 'single',
  disabled: false,
  ariaLabel: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]]
}>()

function updateValue(value: unknown) {
  if (typeof value === 'string' || Array.isArray(value)) {
    emit('update:modelValue', value as string | string[])
  }
}
</script>

<template>
  <ToggleGroupRoot
    class="pr-toggle-group"
    :type="type"
    :model-value="modelValue"
    :disabled="disabled"
    :aria-label="ariaLabel"
    @update:model-value="updateValue"
  >
    <ToggleGroupItem
      v-for="item in items"
      :key="item.value"
      class="pr-toggle-group__item"
      :value="item.value"
      :disabled="disabled || item.disabled"
    >
      {{ item.label }}
    </ToggleGroupItem>
  </ToggleGroupRoot>
</template>
