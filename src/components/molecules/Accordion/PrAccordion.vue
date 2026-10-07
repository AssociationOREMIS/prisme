<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'
import {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from 'reka-ui'

export interface PrAccordionItem {
  title: string
  value: string
  content: string
  disabled?: boolean
}

export interface PrAccordionProps {
  modelValue?: string | string[]
  defaultValue?: string | string[]
  items?: PrAccordionItem[]
  type?: 'single' | 'multiple'
  collapsible?: boolean
}

withDefaults(defineProps<PrAccordionProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  items: () => [],
  type: 'single',
  collapsible: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | string[] | undefined]
}>()
</script>

<template>
  <AccordionRoot
    class="pr-accordion pr:grid pr:overflow-hidden pr:rounded-[var(--pr-radius-lg)] pr:border pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)] pr:text-[color:var(--pr-color-text)]"
    :type="type"
    :model-value="modelValue"
    :default-value="defaultValue"
    :collapsible="collapsible"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <AccordionItem
      v-for="item in items"
      :key="item.value"
      class="pr-accordion__item pr:border-t pr:border-[var(--pr-color-border)] pr:first:border-t-0"
      :value="item.value"
      :disabled="item.disabled"
    >
      <AccordionHeader class="pr-accordion__header pr:m-0">
        <AccordionTrigger class="pr-accordion__trigger pr:group pr:flex pr:w-full pr:cursor-pointer pr:items-center pr:justify-between pr:gap-[var(--pr-space-3)] pr:border-0 pr:bg-transparent pr:p-[var(--pr-space-4)] pr:text-left pr:text-[length:var(--pr-font-size-sm)] pr:font-[750] pr:text-[color:var(--pr-color-text)] pr:hover:bg-[var(--pr-color-surface-subtle)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]">
          {{ item.title }}
          <ChevronDown class="pr-accordion__icon pr:shrink-0 pr:transition-transform pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)] pr:group-data-[state=open]:rotate-180" :size="16" aria-hidden="true" />
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionContent class="pr-accordion__content pr:overflow-hidden pr:data-[state=open]:animate-[pr-accordion-down_200ms_ease-out] pr:data-[state=closed]:animate-[pr-accordion-up_200ms_ease-out]">
        <div class="pr-accordion__content-inner pr:px-[var(--pr-space-4)] pr:pb-[var(--pr-space-4)] pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-normal)] pr:text-[color:var(--pr-color-text-muted)]">{{ item.content }}</div>
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>
