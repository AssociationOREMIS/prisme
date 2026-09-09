<script setup lang="ts">
import { inject } from 'vue'
import { ToastProvider, ToastViewport } from 'reka-ui'
import { prToastProviderKey } from './context'
import PrToastContent from './PrToastContent.vue'

export interface PrToastProps {
  open?: boolean
  defaultOpen?: boolean
  title?: string
  description?: string
  duration?: number
  variant?: 'default' | 'info' | 'success' | 'warning' | 'danger'
  actionLabel?: string
  closeLabel?: string
}

withDefaults(defineProps<PrToastProps>(), {
  open: undefined,
  defaultOpen: false,
  title: undefined,
  description: undefined,
  duration: 5000,
  variant: 'default',
  actionLabel: undefined,
  closeLabel: 'Fermer',
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  action: []
}>()

const isInToastProvider = inject(prToastProviderKey, false)
</script>

<template>
  <PrToastContent
    v-if="isInToastProvider"
    :open="open"
    :default-open="defaultOpen"
    :duration="duration"
    :variant="variant"
    :title="title"
    :description="description"
    :action-label="actionLabel"
    :close-label="closeLabel"
    @update:open="emit('update:open', $event)"
    @action="emit('action')"
  >
    <slot />
  </PrToastContent>

  <ToastProvider v-else>
    <PrToastContent
      :open="open"
      :default-open="defaultOpen"
      :duration="duration"
      :variant="variant"
      :title="title"
      :description="description"
      :action-label="actionLabel"
      :close-label="closeLabel"
      @update:open="emit('update:open', $event)"
      @action="emit('action')"
    >
      <slot />
    </PrToastContent>
    <ToastViewport class="pr-toast__viewport fixed left-0 right-0 top-0 z-[100] m-0 flex max-h-screen w-full list-none flex-col-reverse gap-[var(--pr-space-3)] p-[var(--pr-space-4)] sm:bottom-0 sm:left-auto sm:right-0 sm:top-auto sm:w-[min(26.25rem,calc(100vw-var(--pr-space-8)))] sm:flex-col" />
  </ToastProvider>
</template>
