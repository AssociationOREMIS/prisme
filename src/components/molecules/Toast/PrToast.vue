<script setup lang="ts">
import { X } from '@lucide/vue'
import { inject } from 'vue'
import {
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport,
} from 'reka-ui'
import { prToastProviderKey } from './context'

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

const isInToastProvider = inject(prToastProviderKey, false)
</script>

<template>
  <template v-if="isInToastProvider">
    <ToastRoot
      class="pr-toast pointer-events-auto relative grid w-full grid-cols-[1fr_auto_auto] items-start gap-[var(--pr-space-3)] overflow-hidden rounded-[var(--pr-radius-lg)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] p-[var(--pr-space-4)] pr-[var(--pr-space-6)] text-[color:var(--pr-color-text)] shadow-[var(--pr-shadow-md)] transition-all duration-200 ease-[var(--pr-ease-standard)] data-[swipe=move]:translate-x-[var(--reka-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[swipe=cancel]:translate-x-0 data-[swipe=end]:animate-[pr-toast-swipe-out-x_150ms_ease-out_forwards]"
      :open="open"
      :default-open="defaultOpen"
      :duration="duration"
      @update:open="emit('update:open', $event)"
    >
      <div class="pr-toast__content grid gap-[var(--pr-space-1)]">
        <ToastTitle v-if="title" class="pr-toast__title m-0 text-[length:var(--pr-font-size-sm)] font-[750] leading-[var(--pr-line-height-tight)]">{{ title }}</ToastTitle>
        <ToastDescription v-if="description" class="pr-toast__description m-0 text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-normal)] text-[color:var(--pr-color-text-muted)]">
          {{ description }}
        </ToastDescription>
        <slot />
      </div>
      <ToastAction
        v-if="actionLabel"
        class="pr-toast__action min-h-8 cursor-pointer rounded-[var(--pr-radius-md)] border-0 bg-transparent px-[var(--pr-space-3)] text-[length:var(--pr-font-size-sm)] font-bold text-[color:var(--pr-color-text)] hover:bg-[var(--pr-color-surface-subtle)] hover:text-[color:var(--pr-color-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)]"
        alt-text="Action"
        @click="emit('action')"
      >
        {{ actionLabel }}
      </ToastAction>
      <ToastClose class="pr-toast__close inline-grid size-8 cursor-pointer place-items-center rounded-[var(--pr-radius-md)] border-0 bg-transparent text-[color:var(--pr-color-text-muted)] hover:bg-[var(--pr-color-surface-subtle)] hover:text-[color:var(--pr-color-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)]" :aria-label="closeLabel">
        <X :size="16" aria-hidden="true" />
      </ToastClose>
    </ToastRoot>
  </template>

  <ToastProvider v-else>
    <ToastRoot
      class="pr-toast pointer-events-auto relative grid w-full grid-cols-[1fr_auto_auto] items-start gap-[var(--pr-space-3)] overflow-hidden rounded-[var(--pr-radius-lg)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] p-[var(--pr-space-4)] pr-[var(--pr-space-6)] text-[color:var(--pr-color-text)] shadow-[var(--pr-shadow-md)] transition-all duration-200 ease-[var(--pr-ease-standard)] data-[swipe=move]:translate-x-[var(--reka-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[swipe=cancel]:translate-x-0 data-[swipe=end]:animate-[pr-toast-swipe-out-x_150ms_ease-out_forwards]"
      :open="open"
      :default-open="defaultOpen"
      :duration="duration"
      @update:open="emit('update:open', $event)"
    >
      <div class="pr-toast__content grid gap-[var(--pr-space-1)]">
        <ToastTitle v-if="title" class="pr-toast__title m-0 text-[length:var(--pr-font-size-sm)] font-[750] leading-[var(--pr-line-height-tight)]">{{ title }}</ToastTitle>
        <ToastDescription v-if="description" class="pr-toast__description m-0 text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-normal)] text-[color:var(--pr-color-text-muted)]">
          {{ description }}
        </ToastDescription>
        <slot />
      </div>
      <ToastAction
        v-if="actionLabel"
        class="pr-toast__action min-h-8 cursor-pointer rounded-[var(--pr-radius-md)] border-0 bg-transparent px-[var(--pr-space-3)] text-[length:var(--pr-font-size-sm)] font-bold text-[color:var(--pr-color-text)] hover:bg-[var(--pr-color-surface-subtle)] hover:text-[color:var(--pr-color-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)]"
        alt-text="Action"
        @click="emit('action')"
      >
        {{ actionLabel }}
      </ToastAction>
      <ToastClose class="pr-toast__close inline-grid size-8 cursor-pointer place-items-center rounded-[var(--pr-radius-md)] border-0 bg-transparent text-[color:var(--pr-color-text-muted)] hover:bg-[var(--pr-color-surface-subtle)] hover:text-[color:var(--pr-color-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)]" :aria-label="closeLabel">
        <X :size="16" aria-hidden="true" />
      </ToastClose>
    </ToastRoot>
    <ToastViewport class="pr-toast__viewport fixed left-0 right-0 top-0 z-[100] m-0 flex max-h-screen w-full list-none flex-col-reverse gap-[var(--pr-space-3)] p-[var(--pr-space-4)] sm:bottom-0 sm:left-auto sm:right-0 sm:top-auto sm:w-[min(26.25rem,calc(100vw-var(--pr-space-8)))] sm:flex-col" />
  </ToastProvider>
</template>
