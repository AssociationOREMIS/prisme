<script setup lang="ts">
import { ScrollAreaCorner, ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from 'reka-ui'

export interface PrScrollAreaProps {
  maxHeight?: string
}

withDefaults(defineProps<PrScrollAreaProps>(), {
  maxHeight: '16rem',
})

// Absolutely positioned (overlay) rather than laid out in normal flow: `ScrollAreaRoot`
// only ever gets a `max-height` (it grows with content up to that cap, it isn't a fixed
// size), and a percentage-height Viewport inside an "auto"-height parent is a CSS no-op —
// the flex/min-h-0 pair below is what actually bounds the viewport so it can scroll.
const scrollbarClass = 'pr-scroll-area__scrollbar absolute flex touch-none select-none transition-colors duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)] data-[orientation=vertical]:right-0 data-[orientation=vertical]:top-0 data-[orientation=vertical]:bottom-0 data-[orientation=vertical]:w-2.5 data-[orientation=vertical]:p-[0.1875rem] data-[orientation=horizontal]:bottom-0 data-[orientation=horizontal]:left-0 data-[orientation=horizontal]:right-0 data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:p-[0.1875rem]'
</script>

<template>
  <ScrollAreaRoot
    type="always"
    class="pr-scroll-area flex flex-col overflow-hidden rounded-[var(--pr-radius-lg)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)]"
    :style="{ maxHeight }"
  >
    <ScrollAreaViewport class="pr-scroll-area__viewport min-h-0 min-w-0 flex-1 p-[var(--pr-space-4)]">
      <slot />
    </ScrollAreaViewport>
    <ScrollAreaScrollbar :class="scrollbarClass" orientation="vertical">
      <ScrollAreaThumb class="pr-scroll-area__thumb relative flex-1 rounded-[var(--pr-radius-full)] bg-[var(--pr-color-border-strong)]" />
    </ScrollAreaScrollbar>
    <ScrollAreaScrollbar :class="scrollbarClass" orientation="horizontal">
      <ScrollAreaThumb class="pr-scroll-area__thumb relative flex-1 rounded-[var(--pr-radius-full)] bg-[var(--pr-color-border-strong)]" />
    </ScrollAreaScrollbar>
    <ScrollAreaCorner class="pr-scroll-area__corner bg-[var(--pr-color-border)]" />
  </ScrollAreaRoot>
</template>
