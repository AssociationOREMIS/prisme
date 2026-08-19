<script setup lang="ts">
export interface PrScrollAreaProps {
  maxHeight?: string
}

withDefaults(defineProps<PrScrollAreaProps>(), {
  maxHeight: '16rem',
})
</script>

<template>
  <div class="pr-scroll-area" :style="{ maxHeight }">
    <slot />
  </div>
</template>
