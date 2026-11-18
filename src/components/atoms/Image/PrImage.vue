<script setup lang="ts">
import { computed } from 'vue'

export interface PrImageProps {
  src: string
  /**
   * Text alternative: what the image says, or `""` when it is decorative (an illustration next
   * to a text that already says it all). Required, so it is never forgotten.
   */
  alt: string
  /** Natural width and height of the file: the room is kept while it loads, nothing jumps (CLS). */
  width?: number | string
  height?: number | string
  /** Widest the image may be (a CSS length, `22rem`). It always shrinks to fit its column. */
  maxWidth?: string
  /** Position in its column when narrower: `start` (default) or `center`. */
  align?: 'start' | 'center'
  /** Rounded corners, the radius of the big blocks. */
  rounded?: boolean
  /** `lazy` (default) waits until the image nears the screen; `eager` for the first screen. */
  loading?: 'lazy' | 'eager'
}

const props = withDefaults(defineProps<PrImageProps>(), {
  width: undefined,
  height: undefined,
  maxWidth: undefined,
  align: 'start',
  rounded: false,
  loading: 'lazy',
})

const imageStyle = computed(() => (props.maxWidth ? { maxWidth: `min(${props.maxWidth}, 100%)` } : undefined))

// Never wider than its column (100%), height following the width: no overflow at 320 px.
</script>

<template>
  <img
    class="pr-image pr:block pr:h-auto pr:w-full pr:max-w-full"
    :class="[align === 'center' ? 'pr:mx-auto' : '', { 'pr:rounded-[var(--pr-radius-xl)]': rounded }]"
    :style="imageStyle"
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="loading"
    decoding="async"
  >
</template>
