<script setup lang="ts">
import { computed } from 'vue'

export interface PrSkeletonProps {
  variant?: 'text' | 'block' | 'circle'
}

const props = withDefaults(defineProps<PrSkeletonProps>(), {
  variant: 'block',
})

const skeletonVariantClass: Record<NonNullable<PrSkeletonProps['variant']>, string> = {
  text: 'pr:h-[0.875rem] pr:w-full',
  block: 'pr:h-16 pr:w-full',
  circle: 'pr:size-8 pr:rounded-[var(--pr-radius-full)]',
}

const skeletonClass = computed(() => [
  'pr-skeleton pr:block pr:overflow-hidden pr:rounded-[var(--pr-radius-md)] pr:bg-[linear-gradient(90deg,var(--pr-color-skeleton),var(--pr-color-skeleton-shine),var(--pr-color-skeleton))] pr:bg-[length:200%_100%] pr:animate-[pr-skeleton_1.4s_ease-in-out_infinite]',
  skeletonVariantClass[props.variant],
])
</script>

<template>
  <span :class="skeletonClass" aria-hidden="true" />
</template>
