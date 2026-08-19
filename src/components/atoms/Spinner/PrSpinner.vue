<script setup lang="ts">
export interface PrSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

withDefaults(defineProps<PrSpinnerProps>(), {
  size: 'md',
  label: 'Chargement',
})
</script>

<template>
  <span
    class="pr-spinner"
    :class="`pr-spinner--${size}`"
    role="status"
    :aria-label="label"
  />
</template>
