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
import { computed, ref, useId, watch } from 'vue'
import { PrLabel } from '../../atoms/Label'
import { useErrorText, type PrFieldError } from '../../fieldError'

export interface PrComboboxOption {
  label: string
  value: string
  disabled?: boolean
}

export interface PrComboboxProps {
  modelValue?: string | string[]
  defaultValue?: string | string[]
  options?: PrComboboxOption[]
  placeholder?: string
  searchPlaceholder?: string
  label?: string
  hint?: string
  error?: PrFieldError
  disabled?: boolean
  required?: boolean
  multiple?: boolean
  name?: string
  id?: string
}

const props = withDefaults(defineProps<PrComboboxProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
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

// One message, or the first of Laravel's array of messages.
const errorText = useErrorText(() => props.error)

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]]
}>()

const generatedId = useId()
const inputId = computed(() => props.id ?? `pr-combobox-${generatedId}`)
const hintId = computed(() => `${inputId.value}-hint`)
const errorId = computed(() => `${inputId.value}-error`)
// Only the message actually shown: the error replaces the hint.
const describedBy = computed(() => {
  if (errorText.value) return errorId.value
  return props.hint ? hintId.value : undefined
})

// Without a v-model (a plain Blade form), keep the selection locally so it shows and gets
// submitted through the hidden inputs; a real v-model still takes priority.
const internalValue = ref(props.modelValue ?? props.defaultValue ?? (props.multiple ? [] : undefined))

watch(() => props.modelValue, (value) => {
  if (value !== undefined) internalValue.value = value
})

const currentValue = computed(() => props.modelValue ?? internalValue.value)

function setValue(value: string | string[]) {
  internalValue.value = value
  emit('update:modelValue', value)
}

const displayValue = computed(() => (val: string | string[]) => {
  if (Array.isArray(val)) {
    return val.map(v => props.options?.find(o => o.value === v)?.label ?? v).join(', ')
  }
  return props.options?.find(o => o.value === val)?.label ?? val
})

const hasValue = computed(() => {
  if (Array.isArray(currentValue.value)) return currentValue.value.length > 0
  return Boolean(currentValue.value)
})

function clearValue() {
  setValue(props.multiple ? [] : '')
}

function removeValue(value: string) {
  if (!Array.isArray(currentValue.value)) return
  setValue(currentValue.value.filter(v => v !== value))
}

function labelFor(value: string) {
  return props.options?.find(o => o.value === value)?.label ?? value
}
</script>

<template>
  <div class="pr-combobox pr:grid pr:gap-[var(--pr-space-2)] pr:text-[color:var(--pr-color-text)]">
    <PrLabel v-if="label" :for="inputId" :required="required" :disabled="disabled">{{ label }}</PrLabel>
    <ComboboxRoot
      class="pr:relative"
      :model-value="currentValue"
      :multiple="multiple"
      :disabled="disabled"
      @update:model-value="setValue($event as string | string[])"
    >
      <ComboboxAnchor
        class="pr-combobox__anchor pr:inline-flex pr:min-h-[2.375rem] pr:w-full pr:flex-wrap pr:items-center pr:gap-[var(--pr-space-2)] pr:rounded-[var(--pr-radius-md)] pr:border pr:border-[var(--pr-color-border-strong)] pr:bg-[var(--pr-color-surface)] pr:px-[var(--pr-space-3)] pr:py-[var(--pr-space-1)] pr:focus-within:outline-2 pr:focus-within:outline-offset-2 pr:focus-within:outline-[var(--pr-color-focus)]"
        :class="{ 'pr:border-[var(--pr-color-danger)]': Boolean(errorText) }"
      >
        <span
          v-for="value in multiple && Array.isArray(currentValue) ? currentValue : []"
          :key="value"
          class="pr-combobox__tag pr:inline-flex pr:items-center pr:gap-[var(--pr-space-1)] pr:rounded-[var(--pr-radius-sm)] pr:bg-[var(--pr-color-surface-subtle)] pr:px-[var(--pr-space-2)] pr:py-0.5 pr:text-[length:var(--pr-font-size-xs)] pr:font-semibold pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text)]"
        >
          {{ labelFor(value) }}
          <button
            v-if="!disabled"
            type="button"
            class="pr:-my-1 pr:-mr-1.5 pr:inline-grid pr:size-6 pr:place-items-center pr:rounded-[0.25rem] pr:text-[color:var(--pr-color-text-muted)] pr:transition-colors pr:hover:text-[color:var(--pr-color-text)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]"
            :aria-label="`Retirer ${labelFor(value)}`"
            @click.stop="removeValue(value)"
          >
            <X :size="10" aria-hidden="true" />
          </button>
        </span>
        <ComboboxInput
          :id="inputId"
          class="pr-combobox__input pr:min-w-0 pr:grow pr:bg-transparent pr:py-[var(--pr-space-2)] pr:text-[length:var(--pr-font-size-md)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text)] pr:outline-none pr:placeholder:text-[color:var(--pr-color-text-subtle)] pr:disabled:cursor-not-allowed"
          :display-value="multiple ? undefined : displayValue"
          :placeholder="hasValue ? undefined : placeholder"
          :required="required && !hasValue"
          :aria-required="required || undefined"
          :aria-invalid="errorText ? 'true' : undefined"
          :aria-describedby="describedBy"
        />
        <button
          v-if="hasValue && !disabled"
          type="button"
          class="pr-combobox__clear pr:inline-grid pr:size-6 pr:shrink-0 pr:place-items-center pr:rounded-[0.25rem] pr:text-[color:var(--pr-color-text-muted)] pr:transition-colors pr:hover:text-[color:var(--pr-color-text)]"
          :aria-label="'Effacer la sélection'"
          @click.stop="clearValue"
        >
          <X :size="14" aria-hidden="true" />
        </button>
        <ChevronDown
          class="pr-combobox__icon pr:shrink-0 pr:text-[color:var(--pr-color-text-muted)]"
          :size="16"
          aria-hidden="true"
        />
      </ComboboxAnchor>
      <ComboboxPortal>
        <ComboboxContent
          class="pr-combobox__content pr:z-[95] pr:max-h-[min(20rem,calc(100vh-var(--pr-space-8)))] pr:w-[var(--reka-combobox-trigger-width)] pr:overflow-hidden pr:rounded-[var(--pr-radius-lg)] pr:border pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)] pr:text-[color:var(--pr-color-text)] pr:shadow-[var(--pr-shadow-md)] pr:data-[state=open]:animate-[pr-floating-in_var(--pr-duration-fast)_var(--pr-ease-standard)] pr:data-[state=closed]:animate-[pr-floating-out_var(--pr-duration-fast)_var(--pr-ease-standard)] pr:data-[side=top]:origin-bottom pr:data-[side=bottom]:origin-top"
          position="popper"
          :side-offset="8"
        >
          <ComboboxViewport class="pr-combobox__viewport pr:p-[var(--pr-space-2)]">
            <ComboboxEmpty class="pr-combobox__empty pr:py-[var(--pr-space-4)] pr:text-center pr:text-[length:var(--pr-font-size-sm)] pr:text-[color:var(--pr-color-text-muted)]">
              Aucun résultat
            </ComboboxEmpty>
            <ComboboxItem
              v-for="option in options"
              :key="option.value"
              class="pr-combobox__item pr:relative pr:flex pr:min-h-9 pr:cursor-pointer pr:items-center pr:rounded-[var(--pr-radius-md)] pr:py-0 pr:pr-[var(--pr-space-8)] pr:pl-[var(--pr-space-3)] pr:text-[length:var(--pr-font-size-sm)] pr:font-semibold pr:leading-[var(--pr-line-height-tight)] pr:data-[highlighted]:bg-[var(--pr-color-surface-subtle)] pr:data-[disabled]:cursor-not-allowed pr:data-[disabled]:opacity-50"
              :value="option.value"
              :disabled="option.disabled"
            >
              {{ option.label }}
              <ComboboxItemIndicator class="pr-combobox__item-indicator pr:absolute pr:right-[var(--pr-space-3)] pr:inline-flex pr:text-[color:var(--pr-color-primary)]">
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
      <input v-if="!multiple" type="hidden" :name="name" :value="typeof currentValue === 'string' ? currentValue : ''">
      <input v-for="value in Array.isArray(currentValue) ? currentValue : []" v-else :key="value" type="hidden" :name="name" :value="value">
    </template>
    <p v-if="errorText" :id="errorId" class="pr-field-message pr-field-message--error pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-danger)]">{{ errorText }}</p>
    <p v-else-if="hint" :id="hintId" class="pr-field-message pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text-muted)]">{{ hint }}</p>
  </div>
</template>
