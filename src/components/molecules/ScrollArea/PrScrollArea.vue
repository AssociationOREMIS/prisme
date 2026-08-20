<script setup lang="ts">
export interface PrScrollAreaProps {
  maxHeight?: string
}

withDefaults(defineProps<PrScrollAreaProps>(), {
  maxHeight: '16rem',
})
</script>

<template>
  <div class="pr-scroll-area overflow-auto rounded-[var(--pr-radius-lg)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] p-[var(--pr-space-4)]" :style="{ maxHeight }">
    <slot />
  </div>
</template>
