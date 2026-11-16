<script setup lang="ts">
import { computed } from 'vue'
import { PrVisuallyHidden } from '../../atoms/VisuallyHidden'
import { usePrMessages } from '../../../i18n/context'

export interface PrChatMessageProps {
  /** Who wrote it: `self` the person using the page, `other` the person answering, `system` an automatic message. */
  author: 'self' | 'other' | 'system'
  /** Name shown above an `other` message (« OREMIS »). */
  sender?: string
  /** Time of the message, as shown (« 14:32 »). */
  time?: string
  /** State of a `self` message, under it (« Envoyé », « Lu »). */
  status?: string
}

const props = withDefaults(defineProps<PrChatMessageProps>(), {
  sender: undefined,
  time: undefined,
  status: undefined,
})

const messages = usePrMessages()

/** French colon, after a non-breaking space so it never starts a line. */
const COLON = '\u00a0:'

const showSender = computed(() => props.author === 'other' && Boolean(props.sender))

/** Who wrote it, read before the message when no name is shown: « Vous : ». */
const hiddenSender = computed(() => {
  if (props.author === 'self') return messages.chat.you
  if (props.author === 'system') return messages.chat.system
  return undefined
})

const meta = computed(() => [props.time, props.author === 'self' ? props.status : undefined].filter(Boolean).join(' · '))

const rowClass: Record<PrChatMessageProps['author'], string> = {
  self: 'pr:items-end',
  other: 'pr:items-start',
  system: 'pr:items-center',
}

// System messages in the text colour: the muted one fails contrast on primary-soft in the dark theme.
// A transparent border: the bubbles keep their outline in forced colors, where backgrounds go.
const bubbleClass: Record<PrChatMessageProps['author'], string> = {
  self: 'pr:max-w-[85%] pr:rounded-[var(--pr-radius-xl)] pr:rounded-br-[var(--pr-radius-xs)] pr:bg-[var(--pr-color-primary)] pr:px-[var(--pr-space-4)] pr:py-[var(--pr-space-2)] pr:text-[length:var(--pr-font-size-md)] pr:text-[color:var(--pr-color-primary-contrast)] pr:[&_a]:text-current pr:[&_a]:underline',
  other: 'pr:max-w-[85%] pr:rounded-[var(--pr-radius-xl)] pr:rounded-bl-[var(--pr-radius-xs)] pr:bg-[var(--pr-color-surface)] pr:px-[var(--pr-space-4)] pr:py-[var(--pr-space-2)] pr:text-[length:var(--pr-font-size-md)] pr:text-[color:var(--pr-color-text)] pr:shadow-[var(--pr-shadow-xs)]',
  system: 'pr:max-w-[95%] pr:rounded-[var(--pr-radius-lg)] pr:bg-[var(--pr-color-primary-soft)] pr:px-[var(--pr-space-3)] pr:py-[var(--pr-space-2)] pr:text-center pr:text-[length:var(--pr-font-size-sm)] pr:text-[color:var(--pr-color-text)]',
}
</script>

<template>
  <li
    class="pr-chat-message pr:flex pr:min-w-0 pr:flex-col pr:gap-[var(--pr-space-1)]"
    :class="[`pr-chat-message--${author}`, rowClass[author]]"
  >
    <p
      v-if="showSender"
      class="pr-chat-message__sender pr:m-0 pr:px-[var(--pr-space-1)] pr:text-[length:var(--pr-font-size-xs)] pr:font-bold pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-primary)]"
    >
      {{ sender }}<PrVisuallyHidden>{{ COLON }}</PrVisuallyHidden>
    </p>
    <div
      class="pr-chat-message__bubble pr:border pr:border-transparent pr:leading-[var(--pr-line-height-normal)] pr:whitespace-pre-line pr:[overflow-wrap:anywhere] pr:[&>:first-child]:mt-0 pr:[&>:last-child]:mb-0"
      :class="bubbleClass[author]"
    >
      <PrVisuallyHidden v-if="hiddenSender">{{ `${hiddenSender}${COLON} ` }}</PrVisuallyHidden>
      <slot />
    </div>
    <p
      v-if="meta"
      class="pr-chat-message__meta pr:m-0 pr:px-[var(--pr-space-1)] pr:text-[length:var(--pr-font-size-xs)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text-muted)]"
    >
      {{ meta }}
    </p>
  </li>
</template>
