<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from 'reka-ui'

export interface PrCollapsibleProps {
  open?: boolean
  defaultOpen?: boolean
  title?: string
  disabled?: boolean
}

withDefaults(defineProps<PrCollapsibleProps>(), {
  open: undefined,
  defaultOpen: false,
  title: undefined,
  disabled: false,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()
</script>

<template>
  <CollapsibleRoot
    class="pr-collapsible grid overflow-hidden rounded-[var(--pr-radius-lg)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)]"
    :open="open"
    :default-open="defaultOpen"
    :disabled="disabled"
    @update:open="emit('update:open', $event)"
  >
    <CollapsibleTrigger class="pr-collapsible__trigger group flex w-full cursor-pointer items-center justify-between gap-[var(--pr-space-3)] border-0 bg-transparent p-[var(--pr-space-4)] text-left text-[length:var(--pr-font-size-sm)] font-[750] text-[color:var(--pr-color-text)] hover:bg-[var(--pr-color-surface-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)]">
      <slot name="trigger">
        {{ title }}
        <ChevronDown class="pr-collapsible__icon shrink-0 transition-transform duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)] group-data-[state=open]:rotate-180" :size="16" aria-hidden="true" />
      </slot>
    </CollapsibleTrigger>
    <CollapsibleContent class="pr-collapsible__content overflow-hidden data-[state=open]:animate-[pr-accordion-down_200ms_ease-out] data-[state=closed]:animate-[pr-accordion-up_200ms_ease-out]">
      <div class="pr-collapsible__content-inner px-[var(--pr-space-4)] pb-[var(--pr-space-4)] text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-normal)] text-[color:var(--pr-color-text-muted)]">
        <slot />
      </div>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
