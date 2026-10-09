<script setup lang="ts">
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from '@lucide/vue'
import { computed, ref } from 'vue'
import { ToastAction, ToastClose, ToastDescription, ToastRoot, ToastTitle } from 'reka-ui'
import { warnDeprecated } from '../../deprecation'
import { usePrMessages } from '../../../i18n/context'

interface PrToastContentProps {
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

const props = withDefaults(defineProps<PrToastContentProps>(), {
  open: undefined,
  defaultOpen: false,
  title: undefined,
  description: undefined,
  duration: undefined,
  variant: 'neutral',
  actionLabel: undefined,
  closeLabel: undefined,
})

const messages = usePrMessages()

const emit = defineEmits<{
  'update:open': [value: boolean]
  action: []
}>()

if (props.variant === 'default') warnDeprecated('PrToast', 'variant="default"', 'variant="neutral"')
const tone = computed(() => (props.variant === 'default' ? 'neutral' : props.variant))

const variantIcon = computed(() => ({
  neutral: null,
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  danger: AlertCircle,
})[tone.value])

// Laid out with flex, not a fixed grid: icon, action and close button are each optional,
// and the text always takes the remaining width.
// A neutral surface with a colored accent (left border, icon, progress bar) reads better
// for a transient toast than a fully tinted background, which is closer to `PrAlert`'s
// look and works fine for a message that stays on screen.
const variantAccentClass = computed(() => ({
  neutral: '',
  info: 'pr:border-l-4 pr:border-l-[var(--pr-color-info)]',
  success: 'pr:border-l-4 pr:border-l-[var(--pr-color-success)]',
  warning: 'pr:border-l-4 pr:border-l-[var(--pr-color-warning)]',
  danger: 'pr:border-l-4 pr:border-l-[var(--pr-color-danger)]',
})[tone.value])

const variantIconClass = computed(() => ({
  neutral: '',
  info: 'pr:text-[color:var(--pr-color-info)]',
  success: 'pr:text-[color:var(--pr-color-success)]',
  warning: 'pr:text-[color:var(--pr-color-warning)]',
  danger: 'pr:text-[color:var(--pr-color-danger)]',
})[tone.value])

const variantProgressClass = computed(() => ({
  neutral: 'pr:bg-[var(--pr-color-text-subtle)]',
  info: 'pr:bg-[var(--pr-color-info)]',
  success: 'pr:bg-[var(--pr-color-success)]',
  warning: 'pr:bg-[var(--pr-color-warning)]',
  danger: 'pr:bg-[var(--pr-color-danger)]',
})[tone.value])

// `Infinity` (or any non-finite/non-positive value) means "don't auto-dismiss" —
// showing a depleting bar for a toast that never closes would be misleading.
// Without an explicit duration, an error stays until dismissed (WCAG 2.2.1: someone reading
// slowly or using a screen reader must not lose it); other toasts close after 5 s.
const effectiveDuration = computed(() => props.duration ?? (tone.value === 'danger' ? Infinity : 5000))
const showProgress = computed(() => Number.isFinite(effectiveDuration.value) && effectiveDuration.value > 0)

// Reka pauses the close timer while the toast is hovered or focused, or the window is in the
// background, then resumes it with the time left: the bar must stop and restart with it, or it
// runs out while the toast stays open.
const paused = ref(false)
</script>

<template>
  <ToastRoot
    class="pr-toast pr:pointer-events-auto pr:relative pr:flex pr:w-full pr:items-start pr:gap-[var(--pr-space-3)] pr:overflow-hidden pr:rounded-[var(--pr-radius-lg)] pr:border pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)] pr:p-[var(--pr-space-4)] pr:pr-[var(--pr-space-6)] pr:text-[color:var(--pr-color-text)] pr:shadow-[var(--pr-shadow-md)] pr:transition-all pr:duration-200 pr:ease-[var(--pr-ease-standard)] pr:data-[swipe=move]:translate-x-[var(--reka-toast-swipe-move-x)] pr:data-[swipe=move]:transition-none pr:data-[swipe=cancel]:translate-x-0 pr:data-[swipe=end]:animate-[pr-toast-swipe-out-x_150ms_ease-out_forwards]"
    :class="variantAccentClass"
    :open="open"
    :default-open="defaultOpen"
    :duration="effectiveDuration"
    @update:open="emit('update:open', $event)"
    @pause="paused = true"
    @resume="paused = false"
  >
    <component :is="variantIcon" v-if="variantIcon" class="pr-toast__icon pr:mt-[0.0625rem] pr:shrink-0" :class="variantIconClass" :size="18" aria-hidden="true" />
    <div class="pr-toast__content pr:grid pr:min-w-0 pr:flex-1 pr:gap-[var(--pr-space-1)]">
      <ToastTitle v-if="title" class="pr-toast__title pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:font-[750] pr:leading-[var(--pr-line-height-tight)]">{{ title }}</ToastTitle>
      <ToastDescription v-if="description" class="pr-toast__description pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-normal)] pr:text-[color:var(--pr-color-text-muted)]">
        {{ description }}
      </ToastDescription>
      <slot />
    </div>
    <ToastAction
      v-if="actionLabel"
      class="pr-toast__action pr:min-h-8 pr:shrink-0 pr:cursor-pointer pr:rounded-[var(--pr-radius-md)] pr:border-0 pr:bg-transparent pr:px-[var(--pr-space-3)] pr:text-[length:var(--pr-font-size-sm)] pr:font-bold pr:text-[color:var(--pr-color-text)] pr:hover:bg-[var(--pr-color-surface-subtle)] pr:hover:text-[color:var(--pr-color-text)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]"
      :alt-text="actionLabel"
      @click="emit('action')"
    >
      {{ actionLabel }}
    </ToastAction>
    <ToastClose class="pr-toast__close pr:inline-grid pr:size-8 pr:shrink-0 pr:cursor-pointer pr:place-items-center pr:rounded-[var(--pr-radius-md)] pr:border-0 pr:bg-transparent pr:text-[color:var(--pr-color-text-muted)] pr:hover:bg-[var(--pr-color-surface-subtle)] pr:hover:text-[color:var(--pr-color-text)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]" :aria-label="closeLabel ?? messages.common.close">
      <X :size="16" aria-hidden="true" />
    </ToastClose>
    <div
      v-if="showProgress"
      class="pr-toast__progress pr:absolute pr:inset-x-0 pr:bottom-0 pr:h-[3px] pr:origin-left pr:[animation-fill-mode:forwards] pr:[animation-name:pr-toast-progress] pr:[animation-timing-function:linear]"
      :class="variantProgressClass"
      :style="{ animationDuration: `${effectiveDuration}ms`, animationPlayState: paused ? 'paused' : 'running' }"
      aria-hidden="true"
    />
  </ToastRoot>
</template>
