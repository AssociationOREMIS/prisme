<script setup lang="ts">
import { X } from '@lucide/vue'
import {
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport,
} from 'reka-ui'

export interface PrToastProps {
  open?: boolean
  defaultOpen?: boolean
  title?: string
  description?: string
  duration?: number
  actionLabel?: string
  closeLabel?: string
}

withDefaults(defineProps<PrToastProps>(), {
  open: undefined,
  defaultOpen: false,
  title: undefined,
  description: undefined,
  duration: 5000,
  actionLabel: undefined,
  closeLabel: 'Fermer',
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  action: []
}>()
</script>

<template>
  <ToastProvider>
    <ToastRoot
      class="pr-toast"
      :open="open"
      :default-open="defaultOpen"
      :duration="duration"
      @update:open="emit('update:open', $event)"
    >
      <div class="pr-toast__content">
        <ToastTitle v-if="title" class="pr-toast__title">{{ title }}</ToastTitle>
        <ToastDescription v-if="description" class="pr-toast__description">
          {{ description }}
        </ToastDescription>
        <slot />
      </div>
      <ToastAction
        v-if="actionLabel"
        class="pr-toast__action"
        alt-text="Action"
        @click="emit('action')"
      >
        {{ actionLabel }}
      </ToastAction>
      <ToastClose class="pr-toast__close" :aria-label="closeLabel">
        <X :size="16" aria-hidden="true" />
      </ToastClose>
    </ToastRoot>
    <ToastViewport class="pr-toast__viewport" />
  </ToastProvider>
</template>
