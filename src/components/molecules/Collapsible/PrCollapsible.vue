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
    class="pr-collapsible pr:grid"
    :class="isCompact ? 'pr-collapsible--compact pr:gap-[var(--pr-space-2)]' : 'pr:overflow-hidden pr:rounded-[var(--pr-radius-lg)] pr:border pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)]'"
    :open="open"
    :unmount-on-hide="!keepMounted"
    :default-open="defaultOpen"
    :disabled="disabled"
    @update:open="emit('update:open', $event)"
  >
    <CollapsibleTrigger
      class="pr-collapsible__trigger pr:group pr:flex pr:cursor-pointer pr:items-center pr:gap-[var(--pr-space-3)] pr:border-0 pr:bg-transparent pr:text-left pr:text-[length:var(--pr-font-size-sm)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]"
      :class="isCompact
        ? 'pr:w-fit pr:gap-[var(--pr-space-1)] pr:rounded-[var(--pr-radius-sm)] pr:p-0 pr:font-semibold pr:text-[color:var(--pr-color-primary)] pr:hover:underline'
        : 'pr:w-full pr:justify-between pr:p-[var(--pr-space-4)] pr:font-[750] pr:text-[color:var(--pr-color-text)] pr:hover:bg-[var(--pr-color-surface-subtle)]'"
    >
      <slot name="trigger">
        {{ title }}
        <ChevronDown class="pr-collapsible__icon pr:shrink-0 pr:transition-transform pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)] pr:group-data-[state=open]:rotate-180" :size="16" aria-hidden="true" />
      </slot>
    </CollapsibleTrigger>
    <CollapsibleContent class="pr-collapsible__content pr:overflow-hidden pr:data-[state=open]:animate-[pr-accordion-down_200ms_ease-out] pr:data-[state=closed]:animate-[pr-accordion-up_200ms_ease-out]">
      <div
        class="pr-collapsible__content-inner pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-normal)]"
        :class="isCompact ? 'pr:text-[color:var(--pr-color-text)]' : 'pr:px-[var(--pr-space-4)] pr:pb-[var(--pr-space-4)] pr:text-[color:var(--pr-color-text-muted)]'"
      >
        <slot />
      </div>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
