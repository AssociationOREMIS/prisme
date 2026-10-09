<script setup lang="ts">
import { computed, useId } from 'vue'
import { ToggleGroupItem, ToggleGroupRoot } from 'reka-ui'
import { PrLabel } from '../../atoms/Label'
import { useErrorText, type PrFieldError } from '../../fieldError'
import { useFieldValue } from '../../fieldValue'

export interface PrToggleGroupItem {
  label: string
  value: string
  disabled?: boolean
}

export interface PrToggleGroupProps {
  modelValue?: string | string[]
  defaultValue?: string | string[]
  items?: PrToggleGroupItem[]
  type?: 'single' | 'multiple'
  disabled?: boolean
  /** Visible label above the group, which names it for screen readers. */
  label?: string
  /** Marks the label as required (an asterisk): a group of buttons has no native required state. */
  required?: boolean
  hint?: string
  error?: PrFieldError
  /** Name for screen readers when there is no visible `label`. */
  ariaLabel?: string
  name?: string
  id?: string
}

const props = withDefaults(defineProps<PrToggleGroupProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  items: () => [],
  type: 'single',
  disabled: false,
  label: undefined,
  required: false,
  hint: undefined,
  error: undefined,
  ariaLabel: undefined,
  name: undefined,
  id: undefined,
})

// One message, or the first of Laravel's array of messages.
const errorText = useErrorText(() => props.error)

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]]
}>()

// Multi-root template (root + error/hint message) disables Vue's automatic
// attrs fallthrough, so extraneous attributes must be forwarded explicitly.
defineOptions({ inheritAttrs: false })

const generatedId = useId()
const labelId = computed(() => `pr-toggle-group-${generatedId}-label`)
const hintId = computed(() => `pr-toggle-group-${generatedId}-hint`)
const errorId = computed(() => `pr-toggle-group-${generatedId}-error`)
// Only the message actually shown: the error replaces the hint.
const describedBy = computed(() => {
  if (errorText.value) return errorId.value
  return props.hint ? hintId.value : undefined
})

// Without a v-model the sliding indicator still has to follow the selection (it read
// `modelValue` only, leaving the selected item white on transparent): keep the value locally,
// while a real v-model still takes priority.
const { value: currentValue, set: setCurrentValue } = useFieldValue(props, () => undefined)

function updateValue(value: unknown) {
  if (typeof value === 'string' || Array.isArray(value)) {
    setCurrentValue(value as string | string[])
    emit('update:modelValue', value as string | string[])
  }
}

const activeIndex = computed(() => {
  if (props.type !== 'single' || typeof currentValue.value !== 'string') {
    return -1
  }

  return props.items.findIndex((item) => item.value === currentValue.value)
})

const toggleGroupStyle = computed(() => ({
  '--pr-toggle-group-count': String(Math.max(props.items.length, 1)),
  '--pr-toggle-group-active-index': String(Math.max(activeIndex.value, 0)),
  '--pr-toggle-group-indicator-opacity': activeIndex.value >= 0 ? '1' : '0',
}))

// Single mode keeps one row (the sliding indicator assumes equal columns): on a narrow screen it
// scrolls sideways instead of overflowing the page. The indicator scrolls with the items.
const toggleGroupClass = computed(() => [
  'pr-toggle-group pr:inline-flex pr:flex-wrap pr:items-center pr:gap-[var(--pr-space-2)] pr:rounded-[var(--pr-radius-lg)] pr:border pr:border-[var(--pr-color-border)] pr:p-[var(--pr-space-1)]',
  props.type === 'single'
    ? "pr-toggle-group--single pr:relative pr:inline-grid pr:auto-cols-[minmax(max-content,1fr)] pr:grid-flow-col pr:gap-0 pr:max-w-full pr:overflow-x-auto pr:before:pointer-events-none pr:before:absolute pr:before:top-[var(--pr-space-1)] pr:before:bottom-[var(--pr-space-1)] pr:before:left-[var(--pr-space-1)] pr:before:w-[calc((100%-(var(--pr-space-1)*2))/var(--pr-toggle-group-count))] pr:before:rounded-[var(--pr-radius-md)] pr:before:bg-[var(--pr-color-primary)] pr:before:opacity-[var(--pr-toggle-group-indicator-opacity)] pr:before:translate-x-[calc(var(--pr-toggle-group-active-index)*100%)] pr:before:transition-[transform,opacity,background-color] pr:before:duration-[var(--pr-duration-fast)] pr:before:ease-[var(--pr-ease-standard)] pr:has-[.pr-toggle-group__item[data-state=on]:hover]:before:bg-[var(--pr-color-primary-hover)]"
    : '',
])

const toggleGroupItemClass = [
  'pr-toggle-group__item pr:relative pr:z-[1] pr:inline-grid pr:min-h-[2.375rem] pr:min-w-[2.375rem] pr:cursor-pointer pr:place-items-center pr:rounded-[var(--pr-radius-md)] pr:border pr:border-transparent pr:bg-[var(--pr-color-surface)] pr:px-[var(--pr-space-3)] pr:font-[650] pr:text-[color:var(--pr-color-text)] pr:transition-[background-color,border-color,color] pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)] pr:hover:not-disabled:bg-[var(--pr-color-surface-subtle)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)] pr:disabled:cursor-not-allowed pr:disabled:opacity-[0.58] pr:data-[state=on]:border-[var(--pr-color-primary)] pr:data-[state=on]:bg-[var(--pr-color-primary)] pr:data-[state=on]:text-[color:var(--pr-color-primary-contrast)] pr:data-[state=on]:hover:not-disabled:border-[var(--pr-color-primary-hover)] pr:data-[state=on]:hover:not-disabled:bg-[var(--pr-color-primary-hover)]',
  props.type === 'single'
    ? 'pr:data-[state=on]:border-transparent pr:data-[state=on]:bg-transparent pr:data-[state=on]:hover:not-disabled:border-transparent pr:data-[state=on]:hover:not-disabled:bg-transparent'
    : '',
]
</script>

<template>
  <!-- A group of buttons has no single control for the label to point at: it names the group through aria-labelledby. -->
  <div v-if="label" class="pr-toggle-group__label pr:mb-[var(--pr-space-2)]">
    <PrLabel :id="labelId" :required="required" :disabled="disabled">{{ label }}</PrLabel>
  </div>
  <ToggleGroupRoot
    :id="id"
    v-bind="$attrs"
    :class="toggleGroupClass"
    :style="toggleGroupStyle"
    :type="type"
    :model-value="currentValue"
    :disabled="disabled"
    :name="name"
    :aria-label="label ? undefined : ariaLabel"
    :aria-labelledby="label ? labelId : undefined"
    :aria-invalid="errorText ? 'true' : undefined"
    :aria-describedby="describedBy"
    @update:model-value="updateValue"
  >
    <ToggleGroupItem
      v-for="item in items"
      :key="item.value"
      :class="toggleGroupItemClass"
      :value="item.value"
      :disabled="disabled || item.disabled"
    >
      {{ item.label }}
    </ToggleGroupItem>
  </ToggleGroupRoot>
  <p v-if="errorText" :id="errorId" class="pr-field-message pr-field-message--error pr:m-0 pr:mt-[var(--pr-space-2)] pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-danger)]">{{ errorText }}</p>
  <p v-else-if="hint" :id="hintId" class="pr-field-message pr:m-0 pr:mt-[var(--pr-space-2)] pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text-muted)]">{{ hint }}</p>
</template>
