<script setup lang="ts">
import { computed } from 'vue'
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

export interface PrSheetProps {
  open?: boolean
  defaultOpen?: boolean
  side?: 'left' | 'right' | 'top' | 'bottom'
  title?: string
  description?: string
  closeLabel?: string
}

const props = withDefaults(defineProps<PrSheetProps>(), {
  open: undefined,
  defaultOpen: false,
  side: 'right',
  title: undefined,
  description: undefined,
  closeLabel: 'Fermer',
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const sheetSideClass = computed(() => ({
  right: 'right-0 top-0 bottom-0 w-[min(26rem,100vw)] data-[state=open]:animate-[pr-sheet-in-right_500ms_var(--pr-ease-standard)] data-[state=closed]:animate-[pr-sheet-out-right_300ms_var(--pr-ease-standard)]',
  left: 'left-0 top-0 bottom-0 w-[min(26rem,100vw)] data-[state=open]:animate-[pr-sheet-in-left_500ms_var(--pr-ease-standard)] data-[state=closed]:animate-[pr-sheet-out-left_300ms_var(--pr-ease-standard)]',
  top: 'left-0 right-0 top-0 max-h-[min(28rem,100vh)] data-[state=open]:animate-[pr-sheet-in-top_500ms_var(--pr-ease-standard)] data-[state=closed]:animate-[pr-sheet-out-top_300ms_var(--pr-ease-standard)]',
  bottom: 'left-0 right-0 bottom-0 max-h-[min(28rem,100vh)] data-[state=open]:animate-[pr-sheet-in-bottom_500ms_var(--pr-ease-standard)] data-[state=closed]:animate-[pr-sheet-out-bottom_300ms_var(--pr-ease-standard)]',
})[props.side])
</script>

<template>
  <DialogRoot :open="open" :default-open="defaultOpen" @update:open="emit('update:open', $event)">
    <DialogTrigger as-child>
      <slot name="trigger" />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="pr-sheet__overlay fixed inset-0 z-[80] bg-[var(--pr-color-overlay)] data-[state=open]:animate-[pr-fade-in_150ms_var(--pr-ease-standard)] data-[state=closed]:animate-[pr-fade-out_150ms_var(--pr-ease-standard)]" />
      <DialogContent
        class="pr-sheet fixed z-[90] grid max-h-screen max-w-screen overflow-hidden border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] text-[color:var(--pr-color-text)] shadow-[var(--pr-shadow-md)]"
        :class="sheetSideClass"
      >
        <div class="pr-sheet__header flex items-start justify-between gap-[var(--pr-space-4)] border-b border-[var(--pr-color-border)] p-[var(--pr-space-5)]">
          <div>
            <DialogTitle v-if="title" class="pr-sheet__title m-0 text-[length:var(--pr-font-size-xl)] font-[750] leading-[var(--pr-line-height-tight)]">{{ title }}</DialogTitle>
            <DialogDescription v-if="description" class="pr-sheet__description mt-[var(--pr-space-2)] mb-0 text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-normal)] text-[color:var(--pr-color-text-muted)]">
              {{ description }}
            </DialogDescription>
          </div>
          <DialogClose class="pr-sheet__close inline-grid size-8 shrink-0 cursor-pointer place-items-center rounded-[var(--pr-radius-md)] border-0 bg-transparent text-[color:var(--pr-color-text-muted)] hover:bg-[var(--pr-color-surface-subtle)] hover:text-[color:var(--pr-color-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)]" :aria-label="closeLabel">
            <X :size="18" aria-hidden="true" />
          </DialogClose>
        </div>
        <div class="pr-sheet__body min-h-0 overflow-y-auto p-[var(--pr-space-5)]">
          <slot />
        </div>
        <div v-if="$slots.footer" class="pr-sheet__footer flex justify-end gap-[var(--pr-space-3)] border-t border-[var(--pr-color-border)] p-[var(--pr-space-5)]">
          <slot name="footer" />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
