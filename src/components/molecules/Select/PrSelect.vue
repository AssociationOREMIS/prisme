<script setup lang="ts">
import { Check, ChevronDown, ChevronUp } from '@lucide/vue'
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'
import { PrLabel } from '../../atoms/Label'

export interface PrSelectOption {
  label: string
  value: string
  disabled?: boolean
}

export interface PrSelectProps {
  modelValue?: string
  defaultValue?: string
  options?: PrSelectOption[]
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  name?: string
}

withDefaults(defineProps<PrSelectProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  options: () => [],
  label: undefined,
  placeholder: 'Selectionner',
  hint: undefined,
  error: undefined,
  disabled: false,
  required: false,
  name: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="pr-select" :class="{ 'pr-select--invalid': Boolean(error) }">
    <PrLabel v-if="label" :required="required" :disabled="disabled">{{ label }}</PrLabel>
    <SelectRoot
      :model-value="modelValue"
      :default-value="defaultValue"
      :disabled="disabled"
      :required="required"
      :name="name"
      @update:model-value="emit('update:modelValue', $event)"
    >
      <SelectTrigger class="pr-select__trigger" :aria-invalid="error ? 'true' : undefined">
        <SelectValue :placeholder="placeholder" />
        <SelectIcon class="pr-select__icon">
          <ChevronDown :size="16" aria-hidden="true" />
        </SelectIcon>
      </SelectTrigger>
      <SelectPortal>
        <SelectContent class="pr-select__content" position="popper" :side-offset="8">
          <SelectScrollUpButton class="pr-select__scroll-button">
            <ChevronUp :size="16" aria-hidden="true" />
          </SelectScrollUpButton>
          <SelectViewport class="pr-select__viewport">
            <SelectItem
              v-for="option in options"
              :key="option.value"
              class="pr-select__item"
              :value="option.value"
              :disabled="option.disabled"
            >
              <SelectItemText>{{ option.label }}</SelectItemText>
              <SelectItemIndicator class="pr-select__item-indicator">
                <Check :size="16" aria-hidden="true" />
              </SelectItemIndicator>
            </SelectItem>
          </SelectViewport>
          <SelectScrollDownButton class="pr-select__scroll-button">
            <ChevronDown :size="16" aria-hidden="true" />
          </SelectScrollDownButton>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
    <p v-if="error" class="pr-field-message pr-field-message--error">{{ error }}</p>
    <p v-else-if="hint" class="pr-field-message">{{ hint }}</p>
  </div>
</template>
