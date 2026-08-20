<script setup lang="ts">
import { X } from '@lucide/vue'
import {
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'reka-ui'

export interface PrPopoverProps {
  open?: boolean
  defaultOpen?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  title?: string
  closeLabel?: string
}

withDefaults(defineProps<PrPopoverProps>(), {
  open: undefined,
  defaultOpen: false,
  side: 'bottom',
  align: 'start',
  title: undefined,
  closeLabel: 'Fermer',
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()
</script>

<template>
  <PopoverRoot
    :open="open"
    :default-open="defaultOpen"
    @update:open="emit('update:open', $event)"
  >
    <PopoverTrigger as-child>
      <slot name="trigger" />
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        class="pr-popover z-[70] w-[min(22rem,calc(100vw-var(--pr-space-6)))] rounded-[var(--pr-radius-lg)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] p-[var(--pr-space-4)] text-[color:var(--pr-color-text)] shadow-[var(--pr-shadow-md)] data-[state=open]:animate-[pr-floating-in_var(--pr-duration-fast)_var(--pr-ease-standard)] data-[state=closed]:animate-[pr-floating-out_var(--pr-duration-fast)_var(--pr-ease-standard)] data-[side=top]:origin-bottom data-[side=right]:origin-left data-[side=bottom]:origin-top data-[side=left]:origin-right"
        :side="side"
        :align="align"
        :side-offset="8"
      >
        <div v-if="title || $slots.header" class="pr-popover__header mb-[var(--pr-space-3)] flex items-start justify-between gap-[var(--pr-space-3)]">
          <slot name="header">
            <h2 class="pr-popover__title m-0 text-[length:var(--pr-font-size-sm)] font-[750] leading-[var(--pr-line-height-tight)]">{{ title }}</h2>
          </slot>
          <PopoverClose class="pr-popover__close -m-1 inline-grid size-8 shrink-0 cursor-pointer place-items-center rounded-[var(--pr-radius-md)] border-0 bg-transparent text-[color:var(--pr-color-text-muted)] hover:bg-[var(--pr-color-surface-subtle)] hover:text-[color:var(--pr-color-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)]" :aria-label="closeLabel">
            <X :size="16" aria-hidden="true" />
          </PopoverClose>
        </div>
        <div class="pr-popover__body text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-normal)]">
          <slot />
        </div>
        <PopoverArrow class="pr-popover__arrow fill-[var(--pr-color-surface)]" :width="12" :height="6" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
