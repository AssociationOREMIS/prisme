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

export interface PrSheetProps {
  open?: boolean
  defaultOpen?: boolean
  side?: 'left' | 'right' | 'top' | 'bottom'
  title?: string
  description?: string
  closeLabel?: string
}

withDefaults(defineProps<PrSheetProps>(), {
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
</script>

<template>
  <DialogRoot :open="open" :default-open="defaultOpen" @update:open="emit('update:open', $event)">
    <DialogTrigger as-child>
      <slot name="trigger" />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="pr-sheet__overlay" />
      <DialogContent class="pr-sheet" :class="`pr-sheet--${side}`">
        <div class="pr-sheet__header">
          <div>
            <DialogTitle v-if="title" class="pr-sheet__title">{{ title }}</DialogTitle>
            <DialogDescription v-if="description" class="pr-sheet__description">
              {{ description }}
            </DialogDescription>
          </div>
          <DialogClose class="pr-sheet__close" :aria-label="closeLabel">
            <X :size="18" aria-hidden="true" />
          </DialogClose>
        </div>
        <div class="pr-sheet__body">
          <slot />
        </div>
        <div v-if="$slots.footer" class="pr-sheet__footer">
          <slot name="footer" />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
