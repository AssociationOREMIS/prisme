<script setup lang="ts">
import { computed, useId, type Component } from 'vue'
import { MessageCircleHeart } from '@lucide/vue'
import { PrStatusDot, type PrStatusDotProps } from '../../atoms/StatusDot'

export interface PrChatWindowProps {
  /** Name shown in the header, the window's accessible name. */
  title?: string
  /** Availability line under the title (« Un bénévole vous répond »), with a dot. */
  status?: string
  /** Color of the status dot; the text says the same, the color is never alone. */
  statusVariant?: PrStatusDotProps['variant']
  /** Soft pulse of the status dot (off with reduced motion). */
  statusPulse?: boolean
  /** Icon of the round avatar in the header (a Lucide component). Decorative. */
  icon?: Component
  /** Level of the title, `h2` by default. */
  headingLevel?: 2 | 3 | 4
  /**
   * Fixed size of a floating window (24 x 36 rem at most, never wider than the screen), or
   * `fill` to take the size of its container (a page dedicated to the chat).
   */
  size?: 'floating' | 'fill'
}

const props = withDefaults(defineProps<PrChatWindowProps>(), {
  title: 'OREMIS',
  status: undefined,
  statusVariant: 'success',
  statusPulse: false,
  icon: () => MessageCircleHeart,
  headingLevel: 2,
  size: 'floating',
})

const titleId = `pr-chat-window-${useId()}`

const windowClass = computed(() => [
  'pr-chat-window pr:flex pr:flex-col pr:overflow-hidden pr:rounded-[var(--pr-radius-xl)] pr:border pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)] pr:text-[color:var(--pr-color-text)] pr:shadow-[var(--pr-shadow-md)]',
  props.size === 'floating'
    ? 'pr:h-[min(36rem,calc(100svh-8rem))] pr:min-h-[20rem] pr:w-[min(24rem,calc(100vw-2rem))]'
    : 'pr:h-full pr:w-full',
])
</script>

<template>
  <!-- A named region: the header names it, the thread, the composer and any panel go inside. -->
  <section :class="windowClass" :aria-labelledby="titleId">
    <header class="pr-chat-window__header pr:flex pr:items-center pr:gap-[var(--pr-space-3)] pr:border-b pr:border-[var(--pr-color-border)] pr:px-[var(--pr-space-4)] pr:py-[var(--pr-space-3)]">
      <span class="pr-chat-window__avatar pr:inline-flex pr:size-10 pr:shrink-0 pr:items-center pr:justify-center pr:rounded-[var(--pr-radius-full)] pr:bg-[var(--pr-color-primary-soft)] pr:text-[color:var(--pr-color-primary)]" aria-hidden="true">
        <component :is="icon" :size="22" />
      </span>
      <div class="pr-chat-window__identity pr:grid pr:min-w-0 pr:flex-1 pr:gap-[0.125rem]">
        <component
          :is="`h${headingLevel}`"
          :id="titleId"
          class="pr-chat-window__title pr:m-0 pr:font-[family-name:var(--pr-font-heading)] pr:text-[length:var(--pr-font-size-lg)] pr:font-semibold pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-heading)]"
        >
          <slot name="title">{{ title }}</slot>
        </component>
        <PrStatusDot v-if="status" :variant="statusVariant" :label="status" :pulse="statusPulse" />
      </div>
      <div v-if="$slots.actions" class="pr-chat-window__actions pr:inline-flex pr:shrink-0 pr:items-center pr:gap-[var(--pr-space-1)]">
        <slot name="actions" />
      </div>
    </header>
    <slot />
    <slot name="footer" />
  </section>
</template>
