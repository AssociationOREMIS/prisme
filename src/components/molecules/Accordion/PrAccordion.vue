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
  items?: PrAccordionItem[]
  type?: 'single' | 'multiple'
  collapsible?: boolean
}

withDefaults(defineProps<PrAccordionProps>(), {
  modelValue: undefined,
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
    class="pr-accordion grid overflow-hidden rounded-[var(--pr-radius-lg)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] text-[color:var(--pr-color-text)]"
    :type="type"
    :model-value="modelValue"
    :collapsible="collapsible"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <AccordionItem
      v-for="item in items"
      :key="item.value"
      class="pr-accordion__item border-t border-[var(--pr-color-border)] first:border-t-0"
      :value="item.value"
      :disabled="item.disabled"
    >
      <AccordionHeader class="pr-accordion__header m-0">
        <AccordionTrigger class="pr-accordion__trigger group flex w-full cursor-pointer items-center justify-between gap-[var(--pr-space-3)] border-0 bg-transparent p-[var(--pr-space-4)] text-left text-[length:var(--pr-font-size-sm)] font-[750] text-[color:var(--pr-color-text)] hover:bg-[var(--pr-color-surface-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)]">
          {{ item.title }}
          <ChevronDown class="pr-accordion__icon shrink-0 transition-transform duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)] group-data-[state=open]:rotate-180" :size="16" aria-hidden="true" />
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionContent class="pr-accordion__content overflow-hidden data-[state=open]:animate-[pr-accordion-down_200ms_ease-out] data-[state=closed]:animate-[pr-accordion-up_200ms_ease-out]">
        <div class="pr-accordion__content-inner px-[var(--pr-space-4)] pb-[var(--pr-space-4)] text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-normal)] text-[color:var(--pr-color-text-muted)]">{{ item.content }}</div>
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>
