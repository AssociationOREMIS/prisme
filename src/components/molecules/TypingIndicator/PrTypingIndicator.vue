<script setup lang="ts">
import { PrVisuallyHidden } from '../../atoms/VisuallyHidden'
import { usePrMessages } from '../../../i18n/context'

export interface PrTypingIndicatorProps {
  /** Who is writing, read to screen readers: « OREMIS écrit ». */
  name?: string
  /** Element rendered: `li` in a `PrChatThread` (a row like a message), `div` elsewhere. */
  as?: string
}

withDefaults(defineProps<PrTypingIndicatorProps>(), {
  name: 'OREMIS',
  as: 'li',
})

const messages = usePrMessages()

const delays = ['pr:[animation-delay:-320ms]', 'pr:[animation-delay:-160ms]', 'pr:[animation-delay:0ms]']
</script>

<template>
  <component :is="as" class="pr-typing-indicator pr:flex pr:items-start">
    <span class="pr-typing-indicator__bubble pr:inline-flex pr:items-center pr:gap-[var(--pr-space-1)] pr:rounded-[var(--pr-radius-xl)] pr:rounded-bl-[var(--pr-radius-xs)] pr:border pr:border-transparent pr:bg-[var(--pr-color-surface)] pr:px-[var(--pr-space-4)] pr:py-[var(--pr-space-3)] pr:shadow-[var(--pr-shadow-xs)]">
      <PrVisuallyHidden>{{ messages.chat.typing(name) }}</PrVisuallyHidden>
      <!-- The dots are drawn in the text colour: they stay visible in forced colors. -->
      <span
        v-for="(delay, index) in delays"
        :key="index"
        class="pr-typing-indicator__dot pr:size-2 pr:rounded-[var(--pr-radius-full)] pr:bg-current pr:text-[color:var(--pr-color-text-muted)] pr:animate-bounce pr:[animation-duration:1.2s] pr:motion-reduce:animate-none pr:forced-colors:forced-color-adjust-none pr:forced-colors:bg-[CanvasText]"
        :class="delay"
        aria-hidden="true"
      />
    </span>
  </component>
</template>
