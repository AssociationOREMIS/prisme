<script setup lang="ts">
export interface PrSkeletonProps {
  variant?: 'text' | 'block' | 'circle'
}

withDefaults(defineProps<PrSkeletonProps>(), {
  variant: 'block',
})
</script>

<template>
  <span class="pr-skeleton" :class="`pr-skeleton--${variant}`" aria-hidden="true" />
</template>
