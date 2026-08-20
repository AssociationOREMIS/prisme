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
  <div class="pr-select grid gap-[var(--pr-space-2)] text-[color:var(--pr-color-text)]">
    <PrLabel v-if="label" :required="required" :disabled="disabled">{{ label }}</PrLabel>
    <SelectRoot
      :model-value="modelValue"
      :default-value="defaultValue"
      :disabled="disabled"
      :required="required"
      :name="name"
      @update:model-value="emit('update:modelValue', $event)"
    >
      <SelectTrigger
        class="pr-select__trigger inline-flex min-h-[2.375rem] w-full cursor-pointer items-center justify-between gap-[var(--pr-space-3)] rounded-[var(--pr-radius-md)] border border-[var(--pr-color-border-strong)] bg-[var(--pr-color-surface)] px-[var(--pr-space-3)] text-[length:var(--pr-font-size-md)] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)] data-[placeholder]:text-[color:var(--pr-color-text-subtle)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60"
        :class="{ 'border-[var(--pr-color-danger)]': Boolean(error) }"
        :aria-invalid="error ? 'true' : undefined"
      >
        <SelectValue :placeholder="placeholder" />
        <SelectIcon class="pr-select__icon inline-flex shrink-0 text-[color:var(--pr-color-text-muted)]">
          <ChevronDown :size="16" aria-hidden="true" />
        </SelectIcon>
      </SelectTrigger>
      <SelectPortal>
        <SelectContent
          class="pr-select__content z-[70] max-h-[min(20rem,calc(100vh-var(--pr-space-8)))] min-w-[var(--reka-select-trigger-width)] overflow-hidden rounded-[var(--pr-radius-lg)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] text-[color:var(--pr-color-text)] shadow-[var(--pr-shadow-md)] data-[state=open]:animate-[pr-floating-in_var(--pr-duration-fast)_var(--pr-ease-standard)] data-[state=closed]:animate-[pr-floating-out_var(--pr-duration-fast)_var(--pr-ease-standard)] data-[side=top]:origin-bottom data-[side=right]:origin-left data-[side=bottom]:origin-top data-[side=left]:origin-right"
          position="popper"
          :side-offset="8"
        >
          <SelectScrollUpButton class="pr-select__scroll-button grid h-7 place-items-center text-[color:var(--pr-color-text-muted)]">
            <ChevronUp :size="16" aria-hidden="true" />
          </SelectScrollUpButton>
          <SelectViewport class="pr-select__viewport p-[var(--pr-space-2)]">
            <SelectItem
              v-for="option in options"
              :key="option.value"
              class="pr-select__item relative flex min-h-9 cursor-pointer items-center rounded-[var(--pr-radius-md)] py-0 pr-[var(--pr-space-8)] pl-[var(--pr-space-3)] text-[length:var(--pr-font-size-sm)] font-semibold leading-[var(--pr-line-height-tight)] data-[highlighted]:bg-[var(--pr-color-surface-subtle)] data-[disabled]:cursor-not-allowed data-[disabled]:text-[color:var(--pr-color-text-subtle)]"
              :value="option.value"
              :disabled="option.disabled"
            >
              <SelectItemText>{{ option.label }}</SelectItemText>
              <SelectItemIndicator class="pr-select__item-indicator absolute right-[var(--pr-space-3)] inline-flex text-[color:var(--pr-color-primary)]">
                <Check :size="16" aria-hidden="true" />
              </SelectItemIndicator>
            </SelectItem>
          </SelectViewport>
          <SelectScrollDownButton class="pr-select__scroll-button grid h-7 place-items-center text-[color:var(--pr-color-text-muted)]">
            <ChevronDown :size="16" aria-hidden="true" />
          </SelectScrollDownButton>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
    <p v-if="error" class="pr-field-message pr-field-message--error m-0 text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-danger)]">{{ error }}</p>
    <p v-else-if="hint" class="pr-field-message m-0 text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-text-muted)]">{{ hint }}</p>
  </div>
</template>
