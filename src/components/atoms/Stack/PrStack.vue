<script setup lang="ts">
import { computed } from 'vue'
import { prGapClass, type PrSpaceStep } from './gap'

export interface PrStackProps {
  /** `vertical` (default): one under the other. `horizontal`: side by side. */
  direction?: 'vertical' | 'horizontal'
  /** Space between the children, a step of the spacing scale (`--pr-space-N`). */
  gap?: PrSpaceStep
  /** Alignment across the direction (`align-items`). */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  /** Distribution along the direction (`justify-content`). */
  justify?: 'start' | 'center' | 'end' | 'between'
  /** Lets the children go to the next line when there is no room. */
  wrap?: boolean
  /** Element to render: `ul` for a list... */
  as?: string
}

const props = withDefaults(defineProps<PrStackProps>(), {
  direction: 'vertical',
  gap: 4,
  align: undefined,
  justify: undefined,
  wrap: false,
  as: 'div',
})

const stackAlignClass: Record<NonNullable<PrStackProps['align']>, string> = {
  start: 'pr:items-start',
  center: 'pr:items-center',
  end: 'pr:items-end',
  stretch: 'pr:items-stretch',
  baseline: 'pr:items-baseline',
}

const stackJustifyClass: Record<NonNullable<PrStackProps['justify']>, string> = {
  start: 'pr:justify-start',
  center: 'pr:justify-center',
  end: 'pr:justify-end',
  between: 'pr:justify-between',
}

const stackClass = computed(() => [
  'pr-stack pr:flex',
  props.direction === 'horizontal' ? 'pr-stack--horizontal pr:flex-row' : 'pr-stack--vertical pr:flex-col',
  prGapClass[props.gap],
  props.align && stackAlignClass[props.align],
  props.justify && stackJustifyClass[props.justify],
  props.wrap && 'pr:flex-wrap',
])
</script>

<template>
  <component :is="as" :class="stackClass">
    <slot />
  </component>
</template>
