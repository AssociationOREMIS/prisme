<script setup lang="ts">
import { ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from 'reka-ui'

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
// No ScrollAreaCorner: it measures the scrollbars while they resize, a ResizeObserver
// loop error at mount. With both scrollbars, the vertical one stops above the horizontal one instead
// (reka-ui places its bottom with this variable, set here on the scrollbar itself).
const scrollbarClass = 'pr-scroll-area__scrollbar pr:absolute pr:flex pr:touch-none pr:select-none pr:transition-colors pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)] pr:data-[orientation=vertical]:right-0 pr:data-[orientation=vertical]:top-0 pr:data-[orientation=vertical]:bottom-0 pr:data-[orientation=vertical]:w-2.5 pr:data-[orientation=vertical]:p-[0.1875rem] pr:data-[orientation=horizontal]:bottom-0 pr:data-[orientation=horizontal]:left-0 pr:data-[orientation=horizontal]:right-0 pr:data-[orientation=horizontal]:h-2.5 pr:data-[orientation=horizontal]:flex-col pr:data-[orientation=horizontal]:p-[0.1875rem]'
</script>

<template>
  <ScrollAreaRoot
    type="auto"
    class="pr-scroll-area pr:group/scroll-area pr:flex pr:flex-col pr:overflow-hidden pr:rounded-[var(--pr-radius-lg)] pr:border pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)]"
    :style="{ maxHeight }"
  >
    <ScrollAreaViewport class="pr-scroll-area__viewport pr:min-h-0 pr:min-w-0 pr:flex-1 pr:p-[var(--pr-space-4)]">
      <slot />
    </ScrollAreaViewport>
    <ScrollAreaScrollbar :class="[scrollbarClass, 'pr:group-has-[[data-orientation=horizontal]]/scroll-area:[--reka-scroll-area-corner-height:0.625rem]']" orientation="vertical">
      <ScrollAreaThumb class="pr-scroll-area__thumb pr:relative pr:flex-1 pr:rounded-[var(--pr-radius-full)] pr:bg-[var(--pr-color-border-strong)]" />
    </ScrollAreaScrollbar>
    <ScrollAreaScrollbar :class="scrollbarClass" orientation="horizontal">
      <ScrollAreaThumb class="pr-scroll-area__thumb pr:relative pr:flex-1 pr:rounded-[var(--pr-radius-full)] pr:bg-[var(--pr-color-border-strong)]" />
    </ScrollAreaScrollbar>
  </ScrollAreaRoot>
</template>
