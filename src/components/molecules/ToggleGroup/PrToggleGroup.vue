<script setup lang="ts">
import { computed } from 'vue'
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

const props = withDefaults(defineProps<PrToggleGroupProps>(), {
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

const activeIndex = computed(() => {
  if (props.type !== 'single' || typeof props.modelValue !== 'string') {
    return -1
  }

  return props.items.findIndex((item) => item.value === props.modelValue)
})

const toggleGroupStyle = computed(() => ({
  '--pr-toggle-group-count': String(Math.max(props.items.length, 1)),
  '--pr-toggle-group-active-index': String(Math.max(activeIndex.value, 0)),
  '--pr-toggle-group-indicator-opacity': activeIndex.value >= 0 ? '1' : '0',
}))

const toggleGroupClass = computed(() => [
  'pr-toggle-group inline-flex flex-wrap items-center gap-[var(--pr-space-2)] rounded-[var(--pr-radius-lg)] border border-[var(--pr-color-border)] p-[var(--pr-space-1)]',
  props.type === 'single'
    ? "pr-toggle-group--single relative inline-grid auto-cols-[minmax(max-content,1fr)] grid-flow-col gap-0 overflow-hidden before:pointer-events-none before:absolute before:top-[var(--pr-space-1)] before:bottom-[var(--pr-space-1)] before:left-[var(--pr-space-1)] before:w-[calc((100%-(var(--pr-space-1)*2))/var(--pr-toggle-group-count))] before:rounded-[var(--pr-radius-md)] before:bg-[var(--pr-color-primary)] before:opacity-[var(--pr-toggle-group-indicator-opacity)] before:translate-x-[calc(var(--pr-toggle-group-active-index)*100%)] before:transition-[transform,opacity,background-color] before:duration-[var(--pr-duration-fast)] before:ease-[var(--pr-ease-standard)] has-[.pr-toggle-group__item[data-state=on]:hover]:before:bg-[var(--pr-color-primary-hover)]"
    : '',
])

const toggleGroupItemClass = [
  'pr-toggle-group__item relative z-[1] inline-grid min-h-[2.375rem] min-w-[2.375rem] cursor-pointer place-items-center rounded-[var(--pr-radius-md)] border border-transparent bg-[var(--pr-color-surface)] px-[var(--pr-space-3)] font-[650] text-[color:var(--pr-color-text)] transition-[background-color,border-color,color] duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)] hover:not-disabled:bg-[var(--pr-color-surface-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)] disabled:cursor-not-allowed disabled:opacity-[0.58] data-[state=on]:border-[var(--pr-color-primary)] data-[state=on]:bg-[var(--pr-color-primary)] data-[state=on]:text-[color:var(--pr-color-primary-contrast)] data-[state=on]:hover:not-disabled:border-[var(--pr-color-primary-hover)] data-[state=on]:hover:not-disabled:bg-[var(--pr-color-primary-hover)]',
  props.type === 'single'
    ? 'data-[state=on]:border-transparent data-[state=on]:bg-transparent data-[state=on]:hover:not-disabled:border-transparent data-[state=on]:hover:not-disabled:bg-transparent'
    : '',
]
</script>

<template>
  <ToggleGroupRoot
    :class="toggleGroupClass"
    :style="toggleGroupStyle"
    :type="type"
    :model-value="modelValue"
    :disabled="disabled"
    :aria-label="ariaLabel"
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
</template>
