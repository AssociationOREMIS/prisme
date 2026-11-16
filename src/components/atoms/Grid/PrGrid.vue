<script setup lang="ts">
import { computed } from 'vue'
import { prGapClass, type PrSpaceStep } from '../Stack/gap'

export interface PrGridProps {
  /**
   * Narrowest width of a column (a CSS length): as many columns as fit, each at least this wide,
   * one only when the screen is narrower (never wider than the screen).
   */
  min?: string
  /** Space between the cells, a step of the spacing scale (`--pr-space-N`). */
  gap?: PrSpaceStep
  /** Element to render: `ul` for a list of cards... */
  as?: string
}

const props = withDefaults(defineProps<PrGridProps>(), {
  min: '18rem',
  gap: 4,
  as: 'div',
})

const gridClass = computed(() => [
  'pr-grid pr:grid pr:grid-cols-[repeat(auto-fill,minmax(min(100%,var(--pr-grid-min)),1fr))]',
  prGapClass[props.gap],
])
const gridStyle = computed(() => ({ '--pr-grid-min': props.min }))
</script>

<template>
  <component :is="as" :class="gridClass" :style="gridStyle">
    <slot />
  </component>
</template>
