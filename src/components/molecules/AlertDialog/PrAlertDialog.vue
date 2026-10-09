<script setup lang="ts">
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from 'reka-ui'
import { PrButton } from '../../atoms/Button'
import { usePrMessages } from '../../../i18n/context'

export interface PrAlertDialogProps {
  open?: boolean
  defaultOpen?: boolean
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'primary' | 'danger'
}

withDefaults(defineProps<PrAlertDialogProps>(), {
  open: undefined,
  defaultOpen: false,
  title: undefined,
  description: undefined,
  confirmText: undefined,
  cancelText: undefined,
  variant: 'primary',
})

const messages = usePrMessages()

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
  cancel: []
}>()
</script>

<template>
  <AlertDialogRoot
    :open="open"
    :default-open="defaultOpen"
    @update:open="emit('update:open', $event)"
  >
    <AlertDialogTrigger as-child>
      <slot name="trigger" />
    </AlertDialogTrigger>
    <AlertDialogPortal>
      <AlertDialogOverlay class="pr-alert-dialog__overlay pr:fixed pr:inset-0 pr:z-[80] pr:bg-[var(--pr-color-overlay)] pr:data-[state=open]:animate-[pr-fade-in_150ms_var(--pr-ease-standard)] pr:data-[state=closed]:animate-[pr-fade-out_150ms_var(--pr-ease-standard)]" />
      <AlertDialogContent class="pr-alert-dialog pr:fixed pr:left-1/2 pr:top-1/2 pr:z-[90] pr:grid pr:max-h-[calc(100vh-var(--pr-space-8))] pr:w-[min(28rem,calc(100vw-var(--pr-space-6)))] pr:-translate-x-1/2 pr:-translate-y-1/2 pr:overflow-y-auto pr:rounded-[var(--pr-radius-lg)] pr:border pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)] pr:text-[color:var(--pr-color-text)] pr:shadow-[var(--pr-shadow-md)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)] pr:data-[state=open]:animate-[pr-dialog-in_200ms_var(--pr-ease-standard)] pr:data-[state=closed]:animate-[pr-dialog-out_200ms_var(--pr-ease-standard)]">
        <div class="pr-alert-dialog__header pr:grid pr:gap-[var(--pr-space-2)] pr:p-[var(--pr-space-5)] pr:pb-[var(--pr-space-3)]">
          <AlertDialogTitle class="pr-alert-dialog__title pr:m-0 pr:text-[length:var(--pr-font-size-xl)] pr:font-[750] pr:leading-[var(--pr-line-height-tight)]">{{ title ?? messages.alertDialog.title }}</AlertDialogTitle>
          <AlertDialogDescription v-if="description" class="pr-alert-dialog__description pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-normal)] pr:text-[color:var(--pr-color-text-muted)]">
            {{ description }}
          </AlertDialogDescription>
        </div>
        <div v-if="$slots.default" class="pr-alert-dialog__body pr:p-[var(--pr-space-5)] pr:pt-0 pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-normal)] pr:text-[color:var(--pr-color-text)]">
          <slot />
        </div>
        <div class="pr-alert-dialog__footer pr:flex pr:flex-wrap pr:justify-end pr:gap-[var(--pr-space-3)] pr:border-t pr:border-[var(--pr-color-border)] pr:p-[var(--pr-space-5)]">
          <AlertDialogCancel as-child @click="emit('cancel')">
            <PrButton variant="secondary">{{ cancelText ?? messages.alertDialog.cancel }}</PrButton>
          </AlertDialogCancel>
          <AlertDialogAction as-child @click="emit('confirm')">
            <PrButton :variant="variant === 'danger' ? 'danger' : 'primary'">
              {{ confirmText ?? messages.alertDialog.confirm }}
            </PrButton>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
