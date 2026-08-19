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
        class="pr-popover"
        :side="side"
        :align="align"
        :side-offset="8"
      >
        <div v-if="title || $slots.header" class="pr-popover__header">
          <slot name="header">
            <h2 class="pr-popover__title">{{ title }}</h2>
          </slot>
          <PopoverClose class="pr-popover__close" :aria-label="closeLabel">
            <X :size="16" aria-hidden="true" />
          </PopoverClose>
        </div>
        <div class="pr-popover__body">
          <slot />
        </div>
        <PopoverArrow class="pr-popover__arrow" :width="12" :height="6" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
