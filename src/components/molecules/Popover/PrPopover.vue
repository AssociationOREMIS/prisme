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
        class="pr-popover pr:z-[95] pr:w-[min(22rem,calc(100vw-var(--pr-space-6)))] pr:rounded-[var(--pr-radius-lg)] pr:border pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)] pr:p-[var(--pr-space-4)] pr:text-[color:var(--pr-color-text)] pr:shadow-[var(--pr-shadow-md)] pr:data-[state=open]:animate-[pr-floating-in_var(--pr-duration-fast)_var(--pr-ease-standard)] pr:data-[state=closed]:animate-[pr-floating-out_var(--pr-duration-fast)_var(--pr-ease-standard)] pr:data-[side=top]:origin-bottom pr:data-[side=right]:origin-left pr:data-[side=bottom]:origin-top pr:data-[side=left]:origin-right"
        :side="side"
        :align="align"
        :side-offset="8"
      >
        <div v-if="title || $slots.header" class="pr-popover__header pr:mb-[var(--pr-space-3)] pr:flex pr:items-start pr:justify-between pr:gap-[var(--pr-space-3)]">
          <slot name="header">
            <h2 class="pr-popover__title pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:font-[750] pr:leading-[var(--pr-line-height-tight)]">{{ title }}</h2>
          </slot>
          <PopoverClose class="pr-popover__close pr:-m-1 pr:inline-grid pr:size-8 pr:shrink-0 pr:cursor-pointer pr:place-items-center pr:rounded-[var(--pr-radius-md)] pr:border-0 pr:bg-transparent pr:text-[color:var(--pr-color-text-muted)] pr:hover:bg-[var(--pr-color-surface-subtle)] pr:hover:text-[color:var(--pr-color-text)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]" :aria-label="closeLabel">
            <X :size="16" aria-hidden="true" />
          </PopoverClose>
        </div>
        <div class="pr-popover__body pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-normal)]">
          <slot />
        </div>
        <PopoverArrow class="pr-popover__arrow pr:fill-[var(--pr-color-surface)]" :width="12" :height="6" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
