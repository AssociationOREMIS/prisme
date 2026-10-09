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
import { usePrMessages } from '../../../i18n/context'

export interface PrSheetProps {
  open?: boolean
  defaultOpen?: boolean
  side?: 'left' | 'right' | 'top' | 'bottom'
  title?: string
  /** Accessible name when there is no visible `title`: screen readers announce the dialog by it. */
  ariaLabel?: string
  description?: string
  closeLabel?: string
}

const props = withDefaults(defineProps<PrSheetProps>(), {
  open: undefined,
  defaultOpen: false,
  side: 'right',
  title: undefined,
  ariaLabel: undefined,
  description: undefined,
  closeLabel: undefined,
})

const messages = usePrMessages()

if (!props.title && !props.ariaLabel) {
  console.warn('[prisme] PrSheet: without `title`, give it an `aria-label`, its name for screen readers.')
}

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const sheetSideClass = computed(() => ({
  right: 'pr:right-0 pr:top-0 pr:bottom-0 pr:w-[min(26rem,100vw)] pr:data-[state=open]:animate-[pr-sheet-in-right_500ms_var(--pr-ease-standard)] pr:data-[state=closed]:animate-[pr-sheet-out-right_300ms_var(--pr-ease-standard)]',
  left: 'pr:left-0 pr:top-0 pr:bottom-0 pr:w-[min(26rem,100vw)] pr:data-[state=open]:animate-[pr-sheet-in-left_500ms_var(--pr-ease-standard)] pr:data-[state=closed]:animate-[pr-sheet-out-left_300ms_var(--pr-ease-standard)]',
  top: 'pr:left-0 pr:right-0 pr:top-0 pr:max-h-[min(28rem,100vh)] pr:data-[state=open]:animate-[pr-sheet-in-top_500ms_var(--pr-ease-standard)] pr:data-[state=closed]:animate-[pr-sheet-out-top_300ms_var(--pr-ease-standard)]',
  bottom: 'pr:left-0 pr:right-0 pr:bottom-0 pr:max-h-[min(28rem,100vh)] pr:data-[state=open]:animate-[pr-sheet-in-bottom_500ms_var(--pr-ease-standard)] pr:data-[state=closed]:animate-[pr-sheet-out-bottom_300ms_var(--pr-ease-standard)]',
})[props.side])
</script>

<template>
  <DialogRoot :open="open" :default-open="defaultOpen" @update:open="emit('update:open', $event)">
    <DialogTrigger as-child>
      <slot name="trigger" />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="pr-sheet__overlay pr:fixed pr:inset-0 pr:z-[80] pr:bg-[var(--pr-color-overlay)] pr:data-[state=open]:animate-[pr-fade-in_150ms_var(--pr-ease-standard)] pr:data-[state=closed]:animate-[pr-fade-out_150ms_var(--pr-ease-standard)]" />
      <DialogContent
        class="pr-sheet pr:fixed pr:z-[90] pr:grid pr:max-h-screen pr:max-w-screen pr:overflow-hidden pr:border pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)] pr:text-[color:var(--pr-color-text)] pr:shadow-[var(--pr-shadow-md)]"
        :class="sheetSideClass"
      >
        <div class="pr-sheet__header pr:flex pr:items-start pr:justify-between pr:gap-[var(--pr-space-4)] pr:border-b pr:border-[var(--pr-color-border)] pr:p-[var(--pr-space-5)]">
          <!-- min-w-0: a long title wraps instead of pushing the close button out. -->
          <div class="pr:min-w-0 pr:[overflow-wrap:anywhere]">
            <DialogTitle v-if="title" class="pr-sheet__title pr:m-0 pr:text-[length:var(--pr-font-size-xl)] pr:font-[750] pr:leading-[var(--pr-line-height-tight)]">{{ title }}</DialogTitle>
            <DialogTitle v-else-if="ariaLabel" class="pr:sr-only">{{ ariaLabel }}</DialogTitle>
            <DialogDescription v-if="description" class="pr-sheet__description pr:mt-[var(--pr-space-2)] pr:mb-0 pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-normal)] pr:text-[color:var(--pr-color-text-muted)]">
              {{ description }}
            </DialogDescription>
          </div>
          <DialogClose class="pr-sheet__close pr:inline-grid pr:size-8 pr:shrink-0 pr:cursor-pointer pr:place-items-center pr:rounded-[var(--pr-radius-md)] pr:border-0 pr:bg-transparent pr:text-[color:var(--pr-color-text-muted)] pr:hover:bg-[var(--pr-color-surface-subtle)] pr:hover:text-[color:var(--pr-color-text)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]" :aria-label="closeLabel ?? messages.common.close">
            <X :size="18" aria-hidden="true" />
          </DialogClose>
        </div>
        <div class="pr-sheet__body pr:min-h-0 pr:overflow-y-auto pr:p-[var(--pr-space-5)]">
          <slot />
        </div>
        <div v-if="$slots.footer" class="pr-sheet__footer pr:flex pr:flex-wrap pr:justify-end pr:gap-[var(--pr-space-3)] pr:border-t pr:border-[var(--pr-color-border)] pr:p-[var(--pr-space-5)]">
          <slot name="footer" />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
