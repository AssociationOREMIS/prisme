<script setup lang="ts">
export interface PrBadgeProps {
  variant?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

withDefaults(defineProps<PrBadgeProps>(), {
  variant: 'neutral',
})
</script>

<template>
  <span class="pr-badge" :class="`pr-badge--${variant}`">
    <slot />
  </span>
</template>
