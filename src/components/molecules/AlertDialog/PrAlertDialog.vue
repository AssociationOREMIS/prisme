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
  title: 'Confirmer cette action',
  description: undefined,
  confirmText: 'Confirmer',
  cancelText: 'Annuler',
  variant: 'primary',
})

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
      <AlertDialogOverlay class="pr-alert-dialog__overlay fixed inset-0 z-[80] bg-[var(--pr-color-overlay)] data-[state=open]:animate-[pr-fade-in_150ms_var(--pr-ease-standard)] data-[state=closed]:animate-[pr-fade-out_150ms_var(--pr-ease-standard)]" />
      <AlertDialogContent class="pr-alert-dialog fixed left-1/2 top-1/2 z-[90] grid max-h-[calc(100vh-var(--pr-space-8))] w-[min(28rem,calc(100vw-var(--pr-space-6)))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[var(--pr-radius-lg)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] text-[color:var(--pr-color-text)] shadow-[var(--pr-shadow-md)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)] data-[state=open]:animate-[pr-dialog-in_200ms_var(--pr-ease-standard)] data-[state=closed]:animate-[pr-dialog-out_200ms_var(--pr-ease-standard)]">
        <div class="pr-alert-dialog__header grid gap-[var(--pr-space-2)] p-[var(--pr-space-5)] pb-[var(--pr-space-3)]">
          <AlertDialogTitle class="pr-alert-dialog__title m-0 text-[length:var(--pr-font-size-xl)] font-[750] leading-[var(--pr-line-height-tight)]">{{ title }}</AlertDialogTitle>
          <AlertDialogDescription v-if="description" class="pr-alert-dialog__description m-0 text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-normal)] text-[color:var(--pr-color-text-muted)]">
            {{ description }}
          </AlertDialogDescription>
        </div>
        <div v-if="$slots.default" class="pr-alert-dialog__body p-[var(--pr-space-5)] pt-0 text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-normal)] text-[color:var(--pr-color-text)]">
          <slot />
        </div>
        <div class="pr-alert-dialog__footer flex justify-end gap-[var(--pr-space-3)] border-t border-[var(--pr-color-border)] p-[var(--pr-space-5)]">
          <AlertDialogCancel as-child @click="emit('cancel')">
            <PrButton variant="secondary">{{ cancelText }}</PrButton>
          </AlertDialogCancel>
          <AlertDialogAction as-child @click="emit('confirm')">
            <PrButton :variant="variant === 'danger' ? 'danger' : 'primary'">
              {{ confirmText }}
            </PrButton>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
