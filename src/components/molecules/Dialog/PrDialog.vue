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

export interface PrDialogProps {
  open?: boolean
  defaultOpen?: boolean
  title?: string
  description?: string
  closeLabel?: string
}

withDefaults(defineProps<PrDialogProps>(), {
  open: undefined,
  defaultOpen: false,
  title: undefined,
  description: undefined,
  closeLabel: 'Fermer',
})

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
      <DialogOverlay class="pr-dialog__overlay fixed inset-0 z-[80] bg-[var(--pr-color-overlay)] data-[state=open]:animate-[pr-fade-in_150ms_var(--pr-ease-standard)] data-[state=closed]:animate-[pr-fade-out_150ms_var(--pr-ease-standard)]" />
      <DialogContent class="pr-dialog fixed left-1/2 top-1/2 z-[90] grid max-h-[calc(100vh-var(--pr-space-8))] w-[min(34rem,calc(100vw-var(--pr-space-6)))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[var(--pr-radius-lg)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] text-[color:var(--pr-color-text)] shadow-[var(--pr-shadow-md)] data-[state=open]:animate-[pr-dialog-in_200ms_var(--pr-ease-standard)] data-[state=closed]:animate-[pr-dialog-out_200ms_var(--pr-ease-standard)]">
        <div class="pr-dialog__header flex items-start justify-between gap-[var(--pr-space-4)] border-b border-[var(--pr-color-border)] p-[var(--pr-space-5)]">
          <div>
            <DialogTitle v-if="title" class="pr-dialog__title m-0 text-[length:var(--pr-font-size-xl)] font-[750] leading-[var(--pr-line-height-tight)]">{{ title }}</DialogTitle>
            <DialogDescription v-if="description" class="pr-dialog__description mt-[var(--pr-space-2)] mb-0 text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-normal)] text-[color:var(--pr-color-text-muted)]">
              {{ description }}
            </DialogDescription>
          </div>
          <DialogClose class="pr-dialog__close inline-grid size-8 shrink-0 cursor-pointer place-items-center rounded-[var(--pr-radius-md)] border-0 bg-transparent text-[color:var(--pr-color-text-muted)] hover:bg-[var(--pr-color-surface-subtle)] hover:text-[color:var(--pr-color-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)]" :aria-label="closeLabel">
            <X :size="18" aria-hidden="true" />
          </DialogClose>
        </div>
        <div class="pr-dialog__body min-h-0 overflow-y-auto p-[var(--pr-space-5)]">
          <slot />
        </div>
        <div v-if="$slots.footer" class="pr-dialog__footer flex justify-end gap-[var(--pr-space-3)] border-t border-[var(--pr-color-border)] p-[var(--pr-space-5)]">
          <slot name="footer" />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
