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
    class="pr-accordion"
    :type="type"
    :model-value="modelValue"
    :collapsible="collapsible"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <AccordionItem
      v-for="item in items"
      :key="item.value"
      class="pr-accordion__item"
      :value="item.value"
      :disabled="item.disabled"
    >
      <AccordionHeader class="pr-accordion__header">
        <AccordionTrigger class="pr-accordion__trigger">
          {{ item.title }}
          <ChevronDown class="pr-accordion__icon" :size="16" aria-hidden="true" />
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionContent class="pr-accordion__content">
        <div class="pr-accordion__content-inner">{{ item.content }}</div>
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>
