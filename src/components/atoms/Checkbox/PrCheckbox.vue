<script setup lang="ts">
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

withDefaults(defineProps<PrCheckboxProps>(), {
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
</script>

<template>
  <label class="pr-checkbox" :class="{ 'pr-checkbox--disabled': disabled }">
    <CheckboxRoot
      class="pr-checkbox__control"
      :checked="checked"
      :default-checked="defaultChecked"
      :disabled="disabled"
      :required="required"
      :id="id"
      :name="name"
      @update:checked="emit('update:checked', $event)"
    >
      <CheckboxIndicator class="pr-checkbox__indicator">
        <Minus v-if="checked === 'indeterminate'" :size="12" aria-hidden="true" />
        <Check v-else :size="12" aria-hidden="true" />
      </CheckboxIndicator>
    </CheckboxRoot>
    <span v-if="label || description || $slots.default" class="pr-checkbox__text">
      <span class="pr-checkbox__label">
        <slot>{{ label }}</slot>
        <span v-if="required" class="pr-label__required" aria-hidden="true">*</span>
      </span>
      <span v-if="description" class="pr-checkbox__description">{{ description }}</span>
    </span>
  </label>
</template>
