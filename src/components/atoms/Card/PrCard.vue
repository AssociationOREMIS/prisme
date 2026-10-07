<script setup lang="ts">
import { computed } from 'vue'

export interface PrCardProps {
  padded?: boolean
  elevation?: 'flat' | 'raised'
}

const props = withDefaults(defineProps<PrCardProps>(), {
  padded: true,
  elevation: 'flat',
})

const cardBaseClass = [
  'pr-card',
  'pr:rounded-[var(--pr-radius-lg)] pr:border pr:border-[var(--pr-color-border)]',
  'pr:bg-[var(--pr-color-surface)] pr:text-[color:var(--pr-color-text)]',
  'pr:shadow-[var(--pr-shadow-xs)]',
]

const cardElevationClass: Record<NonNullable<PrCardProps['elevation']>, string> = {
  flat: 'pr:shadow-none',
  raised: 'pr:shadow-[var(--pr-shadow-sm)]',
}

const cardClass = computed(() => [
  cardBaseClass,
  props.padded ? 'pr:p-[var(--pr-space-5)]' : '',
  cardElevationClass[props.elevation],
])
</script>

<template>
  <section :class="cardClass">
    <slot />
  </section>
</template>
