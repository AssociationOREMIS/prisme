<script setup lang="ts">
import { Check, ChevronDown, ChevronUp } from '@lucide/vue'
import { computed, ref, useId, watch } from 'vue'
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
import { useErrorText, type PrFieldError } from '../../fieldError'
import { usePrMessages } from '../../../i18n/context'

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
  /** Accessible name when no visible `label` is shown (e.g. a compact select beside its own text). */
  ariaLabel?: string
  placeholder?: string
  hint?: string
  error?: PrFieldError
  disabled?: boolean
  required?: boolean
  name?: string
  id?: string
}

const props = withDefaults(defineProps<PrSelectProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  options: () => [],
  label: undefined,
  ariaLabel: undefined,
  placeholder: undefined,
  hint: undefined,
  error: undefined,
  disabled: false,
  required: false,
  name: undefined,
  id: undefined,
})

const messages = usePrMessages()

// One message, or the first of Laravel's array of messages.
const errorText = useErrorText(() => props.error)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const generatedId = useId()
const triggerId = computed(() => props.id ?? `pr-select-${generatedId}`)
const hintId = computed(() => `${triggerId.value}-hint`)
const errorId = computed(() => `${triggerId.value}-error`)
// reka-ui refuses an empty item value: an option `{ value: '' }` ("Aucun", "Sans type") goes
// through as an internal value, and comes back out as ''.
const EMPTY = '__pr-select-empty__'
const toInternal = (value: string | undefined) => (value === '' ? EMPTY : value)
const itemValue = (value: string) => (value === '' ? EMPTY : value)
const toExternal = (value: string) => (value === EMPTY ? '' : value)
const hasEmptyOption = computed(() => props.options.some((option) => option.value === ''))

// With an empty option, reka's own hidden <select> would post the internal value: the field
// then posts through its own hidden input, so it needs the current value even without v-model.
const currentValue = ref(props.modelValue ?? props.defaultValue)
watch(() => props.modelValue, (value) => {
  if (value !== undefined) currentValue.value = value
})

function update(value: unknown) {
  if (typeof value !== 'string') return
  currentValue.value = toExternal(value)
  emit('update:modelValue', toExternal(value))
}

// Only the message actually shown: the error replaces the hint.
const describedBy = computed(() => {
  if (errorText.value) return errorId.value
  return props.hint ? hintId.value : undefined
})
</script>

<template>
  <div class="pr-select pr:grid pr:gap-[var(--pr-space-2)] pr:text-[color:var(--pr-color-text)]">
    <PrLabel v-if="label" :for="triggerId" :required="required" :disabled="disabled">{{ label }}</PrLabel>
    <SelectRoot
      :model-value="toInternal(modelValue)"
      :default-value="toInternal(defaultValue)"
      :disabled="disabled"
      :required="required"
      :name="hasEmptyOption ? undefined : name"
      @update:model-value="update"
    >
      <SelectTrigger
        :id="triggerId"
        :aria-label="label ? undefined : ariaLabel"
        class="pr-select__trigger pr:inline-flex pr:min-h-[2.375rem] pr:w-full pr:cursor-pointer pr:items-center pr:justify-between pr:gap-[var(--pr-space-3)] pr:rounded-[var(--pr-radius-md)] pr:border pr:border-[var(--pr-color-border-strong)] pr:bg-[var(--pr-color-surface)] pr:px-[var(--pr-space-3)] pr:text-[length:var(--pr-font-size-md)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)] pr:data-[placeholder]:text-[color:var(--pr-color-text-subtle)] pr:data-[disabled]:cursor-not-allowed pr:data-[disabled]:opacity-60"
        :class="{ 'pr:border-[var(--pr-color-danger)]': Boolean(errorText) }"
        :aria-invalid="errorText ? 'true' : undefined"
        :aria-describedby="describedBy"
      >
        <SelectValue :placeholder="placeholder ?? messages.common.select" />
        <SelectIcon class="pr-select__icon pr:inline-flex pr:shrink-0 pr:text-[color:var(--pr-color-text-muted)]">
          <ChevronDown :size="16" aria-hidden="true" />
        </SelectIcon>
      </SelectTrigger>
      <SelectPortal>
        <SelectContent
          class="pr-select__content pr:z-[95] pr:max-h-[min(20rem,calc(100vh-var(--pr-space-8)))] pr:min-w-[var(--reka-select-trigger-width)] pr:overflow-hidden pr:rounded-[var(--pr-radius-lg)] pr:border pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)] pr:text-[color:var(--pr-color-text)] pr:shadow-[var(--pr-shadow-md)] pr:data-[state=open]:animate-[pr-floating-in_var(--pr-duration-fast)_var(--pr-ease-standard)] pr:data-[state=closed]:animate-[pr-floating-out_var(--pr-duration-fast)_var(--pr-ease-standard)] pr:data-[side=top]:origin-bottom pr:data-[side=right]:origin-left pr:data-[side=bottom]:origin-top pr:data-[side=left]:origin-right"
          position="popper"
          :side-offset="8"
        >
          <SelectScrollUpButton class="pr-select__scroll-button pr:grid pr:h-7 pr:place-items-center pr:text-[color:var(--pr-color-text-muted)]">
            <ChevronUp :size="16" aria-hidden="true" />
          </SelectScrollUpButton>
          <SelectViewport class="pr-select__viewport pr:p-[var(--pr-space-2)]">
            <SelectItem
              v-for="option in options"
              :key="option.value"
              class="pr-select__item pr:relative pr:flex pr:min-h-9 pr:cursor-pointer pr:items-center pr:rounded-[var(--pr-radius-md)] pr:py-0 pr:pr-[var(--pr-space-8)] pr:pl-[var(--pr-space-3)] pr:text-[length:var(--pr-font-size-sm)] pr:font-semibold pr:leading-[var(--pr-line-height-tight)] pr:data-[highlighted]:bg-[var(--pr-color-surface-subtle)] pr:data-[disabled]:cursor-not-allowed pr:data-[disabled]:text-[color:var(--pr-color-text-subtle)]"
              :value="itemValue(option.value)"
              :disabled="option.disabled"
            >
              <SelectItemText>{{ option.label }}</SelectItemText>
              <SelectItemIndicator class="pr-select__item-indicator pr:absolute pr:right-[var(--pr-space-3)] pr:inline-flex pr:text-[color:var(--pr-color-primary)]">
                <Check :size="16" aria-hidden="true" />
              </SelectItemIndicator>
            </SelectItem>
          </SelectViewport>
          <SelectScrollDownButton class="pr-select__scroll-button pr:grid pr:h-7 pr:place-items-center pr:text-[color:var(--pr-color-text-muted)]">
            <ChevronDown :size="16" aria-hidden="true" />
          </SelectScrollDownButton>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
    <input v-if="name && hasEmptyOption" type="hidden" :name="name" :value="currentValue ?? ''">
    <p v-if="errorText" :id="errorId" class="pr-field-message pr-field-message--error pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-danger)]">{{ errorText }}</p>
    <p v-else-if="hint" :id="hintId" class="pr-field-message pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text-muted)]">{{ hint }}</p>
  </div>
</template>
