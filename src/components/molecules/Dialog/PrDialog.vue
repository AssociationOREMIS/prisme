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
      <DialogOverlay class="pr-dialog__overlay" />
      <DialogContent class="pr-dialog">
        <div class="pr-dialog__header">
          <div>
            <DialogTitle v-if="title" class="pr-dialog__title">{{ title }}</DialogTitle>
            <DialogDescription v-if="description" class="pr-dialog__description">
              {{ description }}
            </DialogDescription>
          </div>
          <DialogClose class="pr-dialog__close" :aria-label="closeLabel">
            <X :size="18" aria-hidden="true" />
          </DialogClose>
        </div>
        <div class="pr-dialog__body">
          <slot />
        </div>
        <div v-if="$slots.footer" class="pr-dialog__footer">
          <slot name="footer" />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
