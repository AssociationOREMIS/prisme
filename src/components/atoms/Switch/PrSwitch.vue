<script setup lang="ts">
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

withDefaults(defineProps<PrSwitchProps>(), {
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
</script>

<template>
  <label class="pr-switch" :class="{ 'pr-switch--disabled': disabled }">
    <span v-if="label || description || $slots.default" class="pr-switch__text">
      <span class="pr-switch__label">
        <slot>{{ label }}</slot>
        <span v-if="required" class="pr-label__required" aria-hidden="true">*</span>
      </span>
      <span v-if="description" class="pr-switch__description">{{ description }}</span>
    </span>
    <SwitchRoot
      class="pr-switch__control"
      :checked="checked"
      :default-checked="defaultChecked"
      :disabled="disabled"
      :required="required"
      :id="id"
      :name="name"
      @update:checked="emit('update:checked', $event)"
    >
      <SwitchThumb class="pr-switch__thumb" />
    </SwitchRoot>
  </label>
</template>
