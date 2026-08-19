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
      <AlertDialogOverlay class="pr-alert-dialog__overlay" />
      <AlertDialogContent class="pr-alert-dialog">
        <div class="pr-alert-dialog__header">
          <AlertDialogTitle class="pr-alert-dialog__title">{{ title }}</AlertDialogTitle>
          <AlertDialogDescription v-if="description" class="pr-alert-dialog__description">
            {{ description }}
          </AlertDialogDescription>
        </div>
        <div v-if="$slots.default" class="pr-alert-dialog__body">
          <slot />
        </div>
        <div class="pr-alert-dialog__footer">
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
