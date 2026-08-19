<script setup lang="ts">
export interface PrCardProps {
  padded?: boolean
  elevation?: 'flat' | 'raised'
}

withDefaults(defineProps<PrCardProps>(), {
  padded: true,
  elevation: 'flat',
})
</script>

<template>
  <section
    class="pr-card"
    :class="{
      'pr-card--padded': padded,
      [`pr-card--${elevation}`]: true,
    }"
  >
    <slot />
  </section>
</template>
