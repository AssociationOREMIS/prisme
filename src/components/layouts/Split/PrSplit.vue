<script setup lang="ts">
export interface PrSplitProps {
  /**
   * Share of the width: `7/5` (default) gives the text the larger column, `1/1` halves, `5/7`
   * gives the larger one to the `media` slot.
   */
  ratio?: '7/5' | '1/1' | '5/7'
  /** The `media` slot on the left on wide screens. The text always comes first when read. */
  reverse?: boolean
  /** Vertical alignment of the two columns. */
  align?: 'start' | 'center' | 'end'
  /** Space between the columns, a step of the spacing scale (`--pr-space-N`). */
  gap?: 4 | 6 | 8 | 10 | 12
  /** Element to render, `div` by default. */
  as?: string
}

const props = withDefaults(defineProps<PrSplitProps>(), {
  ratio: '7/5',
  reverse: false,
  align: 'center',
  gap: 10,
  as: 'div',
})

// The text column's share first, then the media's. `reverse` only swaps the visual order of the
// columns: the DOM keeps the text first, so the reading and tab order never jump (WCAG 1.3.2, 2.4.3).
const columnsClass = {
  '7/5': { normal: 'pr:min-[900px]:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]', reverse: 'pr:min-[900px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]' },
  '1/1': { normal: 'pr:min-[900px]:grid-cols-2', reverse: 'pr:min-[900px]:grid-cols-2' },
  '5/7': { normal: 'pr:min-[900px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]', reverse: 'pr:min-[900px]:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]' },
} as const

const alignClass = { start: 'pr:items-start', center: 'pr:items-center', end: 'pr:items-end' } as const

const gapClass = {
  4: 'pr:gap-[var(--pr-space-4)]',
  6: 'pr:gap-[var(--pr-space-6)]',
  8: 'pr:gap-[var(--pr-space-8)]',
  10: 'pr:gap-[var(--pr-space-10)] pr:max-[780px]:gap-[var(--pr-space-8)]',
  12: 'pr:gap-[var(--pr-space-12)] pr:max-[780px]:gap-[var(--pr-space-8)]',
} as const
</script>

<template>
  <component
    :is="as"
    class="pr-split pr:grid pr:grid-cols-1"
    :class="[columnsClass[props.ratio][props.reverse ? 'reverse' : 'normal'], alignClass[props.align], gapClass[props.gap], { 'pr-split--reverse': props.reverse }]"
  >
    <!-- One column below 900 px, the text above the media. Two columns above. -->
    <div class="pr-split__content pr:min-w-0" :class="{ 'pr:min-[900px]:order-2': props.reverse }">
      <slot />
    </div>
    <div v-if="$slots.media" class="pr-split__media pr:min-w-0" :class="{ 'pr:min-[900px]:order-1': props.reverse }">
      <slot name="media" />
    </div>
  </component>
</template>
