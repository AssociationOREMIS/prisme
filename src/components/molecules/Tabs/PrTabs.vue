<script setup lang="ts">
import { computed } from 'vue'
import {
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from 'reka-ui'

export interface PrTab {
  value: string
  label: string
  disabled?: boolean
}

export interface PrTabsProps {
  modelValue?: string
  defaultValue?: string
  tabs?: PrTab[]
  orientation?: 'horizontal' | 'vertical'
  /** Name of the list of tabs for screen readers (« Sections du dossier »). */
  ariaLabel?: string
  /**
   * `underline` (default): tabs on a line, the active one underlined. `pills`: a group of
   * buttons on a grey background, the active one filled with the primary color, for a filter
   * above a list. The tabs wrap on a narrow screen instead of scrolling.
   */
  variant?: 'underline' | 'pills'
}

const props = withDefaults(defineProps<PrTabsProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  tabs: () => [],
  orientation: 'horizontal',
  ariaLabel: undefined,
  variant: 'underline',
})

const listClass = computed(() => {
  if (props.variant === 'pills') {
    return [
      'pr-tabs__list--pills pr:w-fit pr:max-w-full pr:flex-wrap pr:gap-[var(--pr-space-1)] pr:rounded-[var(--pr-radius-md)] pr:bg-[var(--pr-color-surface-subtle)] pr:p-[var(--pr-space-1)]',
      props.orientation === 'vertical' ? 'pr:flex-col' : 'pr:flex-row',
    ]
  }
  return [
    'pr:border-[var(--pr-color-border)]',
    props.orientation === 'vertical' ? 'pr:flex-col pr:border-r' : 'pr:flex-row pr:overflow-x-auto pr:border-b',
  ]
})

const triggerClass = computed(() => props.variant === 'pills'
  // The active pill is filled: not told apart by a text color alone (WCAG 1.4.1).
  ? 'pr:rounded-[var(--pr-radius-sm)] pr:px-[var(--pr-space-3)] pr:py-[0.375rem] pr:font-medium pr:text-[color:var(--pr-color-text)] pr:hover:bg-[var(--pr-color-surface)] pr:data-[state=active]:bg-[var(--pr-color-primary)] pr:data-[state=active]:text-[color:var(--pr-color-primary-contrast)] pr:data-[state=active]:shadow-[var(--pr-shadow-xs)]'
  : 'pr:px-[var(--pr-space-4)] pr:py-[var(--pr-space-3)] pr:font-semibold pr:text-[color:var(--pr-color-text-muted)] pr:hover:text-[color:var(--pr-color-text)] pr:data-[state=active]:text-[color:var(--pr-color-primary)]')

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <!-- min-w-0: in a grid or flex parent, the row of tabs (which scrolls sideways) no longer widens
       the page column to its full length on a phone. Vertical tabs go above their panel below
       780 px (still a column, as wide as its labels): beside it, the panel kept about 100 px of a
       320 px screen. -->
  <TabsRoot
    class="pr-tabs pr:flex pr:min-w-0"
    :class="orientation === 'vertical' ? 'pr:flex-row pr:gap-[var(--pr-space-4)] pr:max-[780px]:flex-col' : 'pr:flex-col'"
    :model-value="modelValue"
    :default-value="defaultValue"
    :orientation="orientation"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <TabsList
      :aria-label="ariaLabel"
      class="pr-tabs__list pr:relative pr:flex pr:shrink-0"
      :class="[listClass, { 'pr:max-[780px]:self-start': orientation === 'vertical' }]"
    >
      <TabsIndicator
        v-if="variant === 'underline'"
        class="pr-tabs__indicator pr:absolute pr:bg-[var(--pr-color-primary)] pr:transition-all pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)]"
        :class="orientation === 'vertical'
          ? 'pr:right-0 pr:top-0 pr:w-0.5 pr:h-[var(--reka-tabs-indicator-size)] pr:translate-x-px pr:translate-y-[var(--reka-tabs-indicator-position)]'
          : 'pr:bottom-0 pr:left-0 pr:h-0.5 pr:w-[var(--reka-tabs-indicator-size)] pr:translate-x-[var(--reka-tabs-indicator-position)]'"
      />
      <TabsTrigger
        v-for="tab in tabs"
        :key="tab.value"
        class="pr-tabs__trigger pr:relative pr:inline-flex pr:shrink-0 pr:cursor-pointer pr:items-center pr:gap-[var(--pr-space-2)] pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:transition-colors pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)] pr:data-[disabled]:cursor-not-allowed pr:data-[disabled]:opacity-50"
        :class="triggerClass"
        :value="tab.value"
        :disabled="tab.disabled"
      >
        {{ tab.label }}
      </TabsTrigger>
    </TabsList>
    <TabsContent
      v-for="tab in tabs"
      :key="tab.value"
      class="pr-tabs__content pr:min-w-0 pr:grow pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]"
      :value="tab.value"
      :class="{ 'pr:pt-[var(--pr-space-4)]': variant === 'pills' }"
    >
      <slot :name="tab.value" />
    </TabsContent>
  </TabsRoot>
</template>
