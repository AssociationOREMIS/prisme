<script setup lang="ts">
import { X } from '@lucide/vue'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui'
import { usePrMessages } from '../../../i18n/context'

export interface PrDialogProps {
  open?: boolean
  defaultOpen?: boolean
  title?: string
  /** Accessible name when there is no visible `title`: screen readers announce the dialog by it. */
  ariaLabel?: string
  description?: string
  closeLabel?: string
}

const props = withDefaults(defineProps<PrDialogProps>(), {
  open: undefined,
  defaultOpen: false,
  title: undefined,
  ariaLabel: undefined,
  description: undefined,
  closeLabel: undefined,
})

const messages = usePrMessages()

if (!props.title && !props.ariaLabel) {
  console.warn('[prisme] PrDialog: without `title`, give it an `aria-label`, its name for screen readers.')
}

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()
</script>

<template>
  <DialogRoot :open="open" :default-open="defaultOpen" @update:open="emit('update:open', $event)">
    <DialogTrigger as-child>
      <slot name="trigger" />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="pr-dialog__overlay pr:fixed pr:inset-0 pr:z-[80] pr:bg-[var(--pr-color-overlay)] pr:data-[state=open]:animate-[pr-fade-in_150ms_var(--pr-ease-standard)] pr:data-[state=closed]:animate-[pr-fade-out_150ms_var(--pr-ease-standard)]" />
      <DialogContent class="pr-dialog pr:fixed pr:left-1/2 pr:top-1/2 pr:z-[90] pr:grid pr:max-h-[calc(100vh-var(--pr-space-8))] pr:w-[min(34rem,calc(100vw-var(--pr-space-6)))] pr:-translate-x-1/2 pr:-translate-y-1/2 pr:overflow-hidden pr:rounded-[var(--pr-radius-lg)] pr:border pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)] pr:text-[color:var(--pr-color-text)] pr:shadow-[var(--pr-shadow-md)] pr:data-[state=open]:animate-[pr-dialog-in_200ms_var(--pr-ease-standard)] pr:data-[state=closed]:animate-[pr-dialog-out_200ms_var(--pr-ease-standard)]">
        <div class="pr-dialog__header pr:flex pr:items-start pr:justify-between pr:gap-[var(--pr-space-4)] pr:border-b pr:border-[var(--pr-color-border)] pr:p-[var(--pr-space-5)]">
          <!-- min-w-0: a long title wraps instead of pushing the close button out. -->
          <div class="pr:min-w-0 pr:[overflow-wrap:anywhere]">
            <DialogTitle v-if="title" class="pr-dialog__title pr:font-[family-name:var(--pr-font-heading)] pr:m-0 pr:text-[length:var(--pr-font-size-xl)] pr:font-[750] pr:leading-[var(--pr-line-height-tight)]">{{ title }}</DialogTitle>
            <DialogTitle v-else-if="ariaLabel" class="pr:sr-only">{{ ariaLabel }}</DialogTitle>
            <DialogDescription v-if="description" class="pr-dialog__description pr:mt-[var(--pr-space-2)] pr:mb-0 pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-normal)] pr:text-[color:var(--pr-color-text-muted)]">
              {{ description }}
            </DialogDescription>
          </div>
          <DialogClose class="pr-dialog__close pr:inline-grid pr:size-8 pr:shrink-0 pr:cursor-pointer pr:place-items-center pr:rounded-[var(--pr-radius-md)] pr:border-0 pr:bg-transparent pr:text-[color:var(--pr-color-text-muted)] pr:hover:bg-[var(--pr-color-surface-subtle)] pr:hover:text-[color:var(--pr-color-text)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]" :aria-label="closeLabel ?? messages.common.close">
            <X :size="18" aria-hidden="true" />
          </DialogClose>
        </div>
        <div class="pr-dialog__body pr:min-h-0 pr:overflow-y-auto pr:p-[var(--pr-space-5)]">
          <slot />
        </div>
        <div v-if="$slots.footer" class="pr-dialog__footer pr:flex pr:flex-wrap pr:justify-end pr:gap-[var(--pr-space-3)] pr:border-t pr:border-[var(--pr-color-border)] pr:p-[var(--pr-space-5)]">
          <slot name="footer" />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
