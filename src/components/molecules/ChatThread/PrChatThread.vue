<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { usePrMessages } from '../../../i18n/context'

export interface PrChatThreadProps {
  /** Name of the list for screen readers, `messages.chat.thread` (« Conversation ») by default. */
  label?: string
  /**
   * Number of messages, optional: the thread already follows its content, this only makes the
   * scroll happen with Vue's update rather than after it.
   */
  count?: number
}

const props = withDefaults(defineProps<PrChatThreadProps>(), {
  label: undefined,
  count: undefined,
})

const messages = usePrMessages()

/** Distance (px) from the bottom under which the reader is still "at the bottom". */
const STICK_THRESHOLD = 32

const list = ref<HTMLOListElement | null>(null)
// Follows new messages while the reader is at the bottom, stays put once they scrolled up to
// read an older one, and follows again when they come back down.
let stuck = true

function isAtBottom(element: HTMLElement): boolean {
  return element.scrollHeight - element.scrollTop - element.clientHeight <= STICK_THRESHOLD
}

function onScroll() {
  if (list.value) stuck = isAtBottom(list.value)
}

/** Scrolls to the last message, and follows the new ones again. */
function scrollToBottom() {
  const element = list.value
  if (!element) return
  element.scrollTop = element.scrollHeight
  stuck = true
}

function follow() {
  if (stuck) scrollToBottom()
}

let observer: MutationObserver | undefined

onMounted(() => {
  scrollToBottom()
  if (typeof MutationObserver === 'undefined' || !list.value) return
  observer = new MutationObserver(follow)
  observer.observe(list.value, { childList: true, subtree: true, characterData: true })
})

onBeforeUnmount(() => observer?.disconnect())

watch(() => props.count, () => nextTick(follow), { flush: 'post' })

defineExpose({ scrollToBottom })
</script>

<template>
  <!-- tabindex: a scrolling region must be reachable with the keyboard (WCAG 2.1.1), to read the
       older messages with the arrow keys. -->
  <ol
    ref="list"
    class="pr-chat-thread pr:m-0 pr:flex pr:min-h-0 pr:flex-1 pr:list-none pr:flex-col pr:gap-[var(--pr-space-3)] pr:overflow-y-auto pr:overscroll-contain pr:bg-[var(--pr-color-surface-subtle)] pr:p-[var(--pr-space-4)] pr:focus-visible:outline-2 pr:focus-visible:-outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]"
    tabindex="0"
    aria-live="polite"
    :aria-label="label ?? messages.chat.thread"
    @scroll.passive="onScroll"
  >
    <slot />
  </ol>
</template>
