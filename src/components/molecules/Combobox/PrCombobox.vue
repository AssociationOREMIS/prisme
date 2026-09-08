<script setup lang="ts">
import { Check, ChevronDown, X } from '@lucide/vue'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxViewport,
} from 'reka-ui'
import { computed, useId } from 'vue'
import { PrLabel } from '../../atoms/Label'

export interface PrComboboxOption {
  label: string
  value: string
  disabled?: boolean
}

export interface PrComboboxProps {
  modelValue?: string | string[]
  options?: PrComboboxOption[]
  placeholder?: string
  searchPlaceholder?: string
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  multiple?: boolean
  name?: string
  id?: string
}

const props = withDefaults(defineProps<PrComboboxProps>(), {
  modelValue: undefined,
  options: () => [],
  placeholder: 'Sélectionner',
  searchPlaceholder: 'Rechercher...',
  label: undefined,
  hint: undefined,
  error: undefined,
  disabled: false,
  required: false,
  multiple: false,
  name: undefined,
  id: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]]
}>()

const generatedId = useId()
const inputId = computed(() => props.id ?? `pr-combobox-${generatedId}`)
const hintId = computed(() => `${inputId.value}-hint`)
const errorId = computed(() => `${inputId.value}-error`)
const describedBy = computed(() => {
  const ids: string[] = []
  if (props.hint) ids.push(hintId.value)
  if (props.error) ids.push(errorId.value)
  return ids.length > 0 ? ids.join(' ') : undefined
})

const displayValue = computed(() => (val: string | string[]) => {
  if (Array.isArray(val)) {
    return val.map(v => props.options?.find(o => o.value === v)?.label ?? v).join(', ')
  }
  return props.options?.find(o => o.value === val)?.label ?? val
})

const hasValue = computed(() => {
  if (Array.isArray(props.modelValue)) return props.modelValue.length > 0
  return Boolean(props.modelValue)
})

function clearValue() {
  emit('update:modelValue', props.multiple ? [] : '')
}
</script>

<template>
  <div class="pr-combobox grid gap-[var(--pr-space-2)] text-[color:var(--pr-color-text)]">
    <PrLabel v-if="label" :for="inputId" :required="required" :disabled="disabled">{{ label }}</PrLabel>
    <ComboboxRoot
      class="relative"
      :model-value="modelValue"
      :multiple="multiple"
      :disabled="disabled"
      :display-value="displayValue"
      @update:model-value="emit('update:modelValue', $event)"
    >
      <ComboboxAnchor
        class="pr-combobox__anchor inline-flex min-h-[2.375rem] w-full items-center gap-[var(--pr-space-2)] rounded-[var(--pr-radius-md)] border border-[var(--pr-color-border-strong)] bg-[var(--pr-color-surface)] px-[var(--pr-space-3)] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--pr-color-focus)]"
        :class="{ 'border-[var(--pr-color-danger)]': Boolean(error) }"
      >
        <ComboboxInput
          :id="inputId"
          class="pr-combobox__input min-w-0 grow bg-transparent py-[var(--pr-space-2)] text-[length:var(--pr-font-size-md)] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-text)] outline-none placeholder:text-[color:var(--pr-color-text-subtle)] disabled:cursor-not-allowed"
          :placeholder="hasValue ? undefined : placeholder"
          :required="required"
          :aria-required="required || undefined"
          :aria-invalid="error ? 'true' : undefined"
          :aria-describedby="describedBy"
        />
        <button
          v-if="hasValue && !disabled"
          type="button"
          class="pr-combobox__clear shrink-0 text-[color:var(--pr-color-text-muted)] transition-colors hover:text-[color:var(--pr-color-text)]"
          :aria-label="'Effacer la sélection'"
          @click.stop="clearValue"
        >
          <X :size="14" aria-hidden="true" />
        </button>
        <ChevronDown
          class="pr-combobox__icon shrink-0 text-[color:var(--pr-color-text-muted)]"
          :size="16"
          aria-hidden="true"
        />
      </ComboboxAnchor>
      <ComboboxPortal>
        <ComboboxContent
          class="pr-combobox__content z-[70] max-h-[min(20rem,calc(100vh-var(--pr-space-8)))] w-[var(--reka-combobox-trigger-width)] overflow-hidden rounded-[var(--pr-radius-lg)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] text-[color:var(--pr-color-text)] shadow-[var(--pr-shadow-md)] data-[state=open]:animate-[pr-floating-in_var(--pr-duration-fast)_var(--pr-ease-standard)] data-[state=closed]:animate-[pr-floating-out_var(--pr-duration-fast)_var(--pr-ease-standard)] data-[side=top]:origin-bottom data-[side=bottom]:origin-top"
          position="popper"
          :side-offset="8"
        >
          <ComboboxViewport class="pr-combobox__viewport p-[var(--pr-space-2)]">
            <ComboboxEmpty class="pr-combobox__empty py-[var(--pr-space-4)] text-center text-[length:var(--pr-font-size-sm)] text-[color:var(--pr-color-text-muted)]">
              Aucun résultat
            </ComboboxEmpty>
            <ComboboxItem
              v-for="option in options"
              :key="option.value"
              class="pr-combobox__item relative flex min-h-9 cursor-pointer items-center rounded-[var(--pr-radius-md)] py-0 pr-[var(--pr-space-8)] pl-[var(--pr-space-3)] text-[length:var(--pr-font-size-sm)] font-semibold leading-[var(--pr-line-height-tight)] data-[highlighted]:bg-[var(--pr-color-surface-subtle)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
              :value="option.value"
              :disabled="option.disabled"
            >
              {{ option.label }}
              <ComboboxItemIndicator class="pr-combobox__item-indicator absolute right-[var(--pr-space-3)] inline-flex text-[color:var(--pr-color-primary)]">
                <Check :size="14" aria-hidden="true" />
              </ComboboxItemIndicator>
            </ComboboxItem>
          </ComboboxViewport>
        </ComboboxContent>
      </ComboboxPortal>
    </ComboboxRoot>
    <!-- ComboboxInput only ever carries the search text, not the selected
         value(s), so native form submission goes through these hidden inputs. -->
    <template v-if="name">
      <input v-if="!multiple" type="hidden" :name="name" :value="typeof modelValue === 'string' ? modelValue : ''">
      <input v-for="value in Array.isArray(modelValue) ? modelValue : []" v-else :key="value" type="hidden" :name="name" :value="value">
    </template>
    <p v-if="error" :id="errorId" class="pr-field-message pr-field-message--error m-0 text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-danger)]">{{ error }}</p>
    <p v-else-if="hint" :id="hintId" class="pr-field-message m-0 text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-text-muted)]">{{ hint }}</p>
  </div>
</template>
