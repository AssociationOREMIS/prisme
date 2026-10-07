<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from 'reka-ui'
import { computed } from 'vue'

export interface PrCollapsibleProps {
  open?: boolean
  defaultOpen?: boolean
  title?: string
  disabled?: boolean
  /**
   * Keeps the content in the page while closed (hidden, still found by the browser's search): the
   * fields of a form inside keep their value and are still submitted.
   */
  keepMounted?: boolean
  /** `compact`: no frame, a small trigger like a link (« Options avancées »), the content right below. */
  variant?: 'default' | 'compact'
}

const props = withDefaults(defineProps<PrCollapsibleProps>(), {
  open: undefined,
  defaultOpen: false,
  title: undefined,
  disabled: false,
  keepMounted: false,
  variant: 'default',
})

const isCompact = computed(() => props.variant === 'compact')

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()
</script>

<template>
  <CollapsibleRoot
    class="pr-collapsible grid"
    :class="isCompact ? 'pr-collapsible--compact gap-[var(--pr-space-2)]' : 'overflow-hidden rounded-[var(--pr-radius-lg)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)]'"
    :open="open"
    :unmount-on-hide="!keepMounted"
    :default-open="defaultOpen"
    :disabled="disabled"
    @update:open="emit('update:open', $event)"
  >
    <CollapsibleTrigger
      class="pr-collapsible__trigger group flex cursor-pointer items-center gap-[var(--pr-space-3)] border-0 bg-transparent text-left text-[length:var(--pr-font-size-sm)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)]"
      :class="isCompact
        ? 'w-fit gap-[var(--pr-space-1)] rounded-[var(--pr-radius-sm)] p-0 font-semibold text-[color:var(--pr-color-primary)] hover:underline'
        : 'w-full justify-between p-[var(--pr-space-4)] font-[750] text-[color:var(--pr-color-text)] hover:bg-[var(--pr-color-surface-subtle)]'"
    >
      <slot name="trigger">
        {{ title }}
        <ChevronDown class="pr-collapsible__icon shrink-0 transition-transform duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)] group-data-[state=open]:rotate-180" :size="16" aria-hidden="true" />
      </slot>
    </CollapsibleTrigger>
    <CollapsibleContent class="pr-collapsible__content overflow-hidden data-[state=open]:animate-[pr-accordion-down_200ms_ease-out] data-[state=closed]:animate-[pr-accordion-up_200ms_ease-out]">
      <div
        class="pr-collapsible__content-inner text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-normal)]"
        :class="isCompact ? 'text-[color:var(--pr-color-text)]' : 'px-[var(--pr-space-4)] pb-[var(--pr-space-4)] text-[color:var(--pr-color-text-muted)]'"
      >
        <slot />
      </div>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
