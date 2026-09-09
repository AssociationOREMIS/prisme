<script setup lang="ts">
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from '@lucide/vue'
import { computed, inject } from 'vue'
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
  variant?: 'default' | 'info' | 'success' | 'warning' | 'danger'
  actionLabel?: string
  closeLabel?: string
}

const props = withDefaults(defineProps<PrToastProps>(), {
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

const variantIcon = computed(() => ({
  default: null,
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  danger: AlertCircle,
})[props.variant])

// A neutral surface with a colored accent (left border, icon, progress bar) reads better
// for a transient toast than a fully tinted background, which is closer to `PrAlert`'s
// look and works fine for a message that stays on screen.
const variantAccentClass = computed(() => ({
  default: '',
  info: 'border-l-4 border-l-[var(--pr-color-info)]',
  success: 'border-l-4 border-l-[var(--pr-color-success)]',
  warning: 'border-l-4 border-l-[var(--pr-color-warning)]',
  danger: 'border-l-4 border-l-[var(--pr-color-danger)]',
})[props.variant])

const variantIconClass = computed(() => ({
  default: '',
  info: 'text-[color:var(--pr-color-info)]',
  success: 'text-[color:var(--pr-color-success)]',
  warning: 'text-[color:var(--pr-color-warning)]',
  danger: 'text-[color:var(--pr-color-danger)]',
})[props.variant])

const variantProgressClass = computed(() => ({
  default: 'bg-[var(--pr-color-text-subtle)]',
  info: 'bg-[var(--pr-color-info)]',
  success: 'bg-[var(--pr-color-success)]',
  warning: 'bg-[var(--pr-color-warning)]',
  danger: 'bg-[var(--pr-color-danger)]',
})[props.variant])

// `Infinity` (or any non-finite/non-positive value) means "don't auto-dismiss" —
// showing a depleting bar for a toast that never closes would be misleading.
const showProgress = computed(() => Number.isFinite(props.duration) && props.duration > 0)
</script>

<template>
  <template v-if="isInToastProvider">
    <ToastRoot
      class="pr-toast pointer-events-auto relative grid w-full grid-cols-[1fr_auto_auto] items-start gap-[var(--pr-space-3)] overflow-hidden rounded-[var(--pr-radius-lg)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] p-[var(--pr-space-4)] pr-[var(--pr-space-6)] text-[color:var(--pr-color-text)] shadow-[var(--pr-shadow-md)] transition-all duration-200 ease-[var(--pr-ease-standard)] data-[swipe=move]:translate-x-[var(--reka-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[swipe=cancel]:translate-x-0 data-[swipe=end]:animate-[pr-toast-swipe-out-x_150ms_ease-out_forwards]"
      :class="variantAccentClass"
      :open="open"
      :default-open="defaultOpen"
      :duration="duration"
      @update:open="emit('update:open', $event)"
    >
      <component :is="variantIcon" v-if="variantIcon" class="pr-toast__icon mt-[0.0625rem] shrink-0" :class="variantIconClass" :size="18" aria-hidden="true" />
      <div class="pr-toast__content grid min-w-0 gap-[var(--pr-space-1)]">
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
      <div
        v-if="showProgress"
        class="pr-toast__progress absolute inset-x-0 bottom-0 h-[3px] origin-left [animation-fill-mode:forwards] [animation-name:pr-toast-progress] [animation-timing-function:linear]"
        :class="variantProgressClass"
        :style="{ animationDuration: `${duration}ms` }"
        aria-hidden="true"
      />
    </ToastRoot>
  </template>

  <ToastProvider v-else>
    <ToastRoot
      class="pr-toast pointer-events-auto relative grid w-full grid-cols-[1fr_auto_auto] items-start gap-[var(--pr-space-3)] overflow-hidden rounded-[var(--pr-radius-lg)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] p-[var(--pr-space-4)] pr-[var(--pr-space-6)] text-[color:var(--pr-color-text)] shadow-[var(--pr-shadow-md)] transition-all duration-200 ease-[var(--pr-ease-standard)] data-[swipe=move]:translate-x-[var(--reka-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[swipe=cancel]:translate-x-0 data-[swipe=end]:animate-[pr-toast-swipe-out-x_150ms_ease-out_forwards]"
      :class="variantAccentClass"
      :open="open"
      :default-open="defaultOpen"
      :duration="duration"
      @update:open="emit('update:open', $event)"
    >
      <component :is="variantIcon" v-if="variantIcon" class="pr-toast__icon mt-[0.0625rem] shrink-0" :class="variantIconClass" :size="18" aria-hidden="true" />
      <div class="pr-toast__content grid min-w-0 gap-[var(--pr-space-1)]">
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
      <div
        v-if="showProgress"
        class="pr-toast__progress absolute inset-x-0 bottom-0 h-[3px] origin-left [animation-fill-mode:forwards] [animation-name:pr-toast-progress] [animation-timing-function:linear]"
        :class="variantProgressClass"
        :style="{ animationDuration: `${duration}ms` }"
        aria-hidden="true"
      />
    </ToastRoot>
    <ToastViewport class="pr-toast__viewport fixed left-0 right-0 top-0 z-[100] m-0 flex max-h-screen w-full list-none flex-col-reverse gap-[var(--pr-space-3)] p-[var(--pr-space-4)] sm:bottom-0 sm:left-auto sm:right-0 sm:top-auto sm:w-[min(26.25rem,calc(100vw-var(--pr-space-8)))] sm:flex-col" />
  </ToastProvider>
</template>
