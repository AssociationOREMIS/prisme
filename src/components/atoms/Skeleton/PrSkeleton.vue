<script setup lang="ts">
import { computed } from 'vue'

export interface PrSkeletonProps {
  variant?: 'text' | 'block' | 'circle'
}

const props = withDefaults(defineProps<PrSkeletonProps>(), {
  variant: 'block',
})

const skeletonVariantClass: Record<NonNullable<PrSkeletonProps['variant']>, string> = {
  text: 'h-[0.875rem] w-full',
  block: 'h-16 w-full',
  circle: 'size-8 rounded-[var(--pr-radius-full)]',
}

const skeletonClass = computed(() => [
  'pr-skeleton block overflow-hidden rounded-[var(--pr-radius-md)] bg-[linear-gradient(90deg,var(--pr-color-surface-subtle),var(--pr-color-border),var(--pr-color-surface-subtle))] bg-[length:200%_100%] animate-[pr-skeleton_1.4s_ease-in-out_infinite]',
  skeletonVariantClass[props.variant],
])
</script>

<template>
  <span :class="skeletonClass" aria-hidden="true" />
</template>
