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
  /** Milliseconds before closing. Default 5000, except `danger`: stays until dismissed. `Infinity` never closes. */
  duration?: number
  /** `default` is the deprecated name of `neutral` (removed in 1.0), kept so apps on the old name keep working. */
  variant?: 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'default'
  actionLabel?: string
  closeLabel?: string
}

withDefaults(defineProps<PrToastProps>(), {
  open: undefined,
  defaultOpen: false,
  title: undefined,
  description: undefined,
  duration: undefined,
  variant: 'neutral',
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
    <ToastViewport class="pr-toast__viewport pr:fixed pr:left-0 pr:right-0 pr:top-0 pr:z-[100] pr:m-0 pr:flex pr:max-h-screen pr:w-full pr:list-none pr:flex-col-reverse pr:gap-[var(--pr-space-3)] pr:p-[var(--pr-space-4)] pr:sm:bottom-0 pr:sm:left-auto pr:sm:right-0 pr:sm:top-auto pr:sm:w-[min(26.25rem,calc(100vw-var(--pr-space-8)))] pr:sm:flex-col" />
  </ToastProvider>
</template>
