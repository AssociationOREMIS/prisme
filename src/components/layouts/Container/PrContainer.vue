<script setup lang="ts">
import { computed } from 'vue'

export interface PrContainerProps {
  /**
   * `full` (default) spans the whole width, `wide` stops at 80rem and `narrow` at 48rem (a text to
   * read), both centered. The side gutters stay in every case.
   */
  width?: 'full' | 'wide' | 'narrow'
  /** Element to render: `main`, `section`, `header`... */
  as?: string
}

const props = withDefaults(defineProps<PrContainerProps>(), {
  width: 'full',
  as: 'div',
})

const containerWidthClass: Record<NonNullable<PrContainerProps['width']>, string> = {
  full: '',
  wide: 'pr:mx-auto pr:max-w-[80rem]',
  narrow: 'pr:mx-auto pr:max-w-[48rem]',
}

const containerClass = computed(() => [
  'pr-container',
  'pr:box-border pr:w-full pr:px-[var(--pr-space-10)] pr:max-[780px]:px-[var(--pr-space-4)]',
  containerWidthClass[props.width],
])
</script>

<template>
  <component :is="as" :class="containerClass">
    <slot />
  </component>
</template>
