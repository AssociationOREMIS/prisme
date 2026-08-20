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
  'rounded-[var(--pr-radius-lg)] border border-[var(--pr-color-border)]',
  'bg-[var(--pr-color-surface)] text-[color:var(--pr-color-text)]',
  'shadow-[var(--pr-shadow-xs)]',
]

const cardElevationClass: Record<NonNullable<PrCardProps['elevation']>, string> = {
  flat: 'shadow-none',
  raised: 'shadow-[var(--pr-shadow-sm)]',
}

const cardClass = computed(() => [
  cardBaseClass,
  props.padded ? 'p-[var(--pr-space-5)]' : '',
  cardElevationClass[props.elevation],
])
</script>

<template>
  <section :class="cardClass">
    <slot />
  </section>
</template>
