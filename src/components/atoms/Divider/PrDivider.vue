<script setup lang="ts">
import { computed } from 'vue'

export interface PrDividerProps {
  orientation?: 'horizontal' | 'vertical'
}

const props = withDefaults(defineProps<PrDividerProps>(), {
  orientation: 'horizontal',
})

const dividerOrientationClass: Record<NonNullable<PrDividerProps['orientation']>, string> = {
  horizontal: 'pr:my-[var(--pr-space-4)] pr:h-px pr:w-full',
  vertical: 'pr:mx-[var(--pr-space-4)] pr:min-h-6 pr:w-px pr:self-stretch',
}

const dividerClass = computed(() => [
  'pr-divider pr:shrink-0 pr:border-0 pr:bg-[var(--pr-color-border)]',
  dividerOrientationClass[props.orientation],
])
</script>

<template>
  <hr
    :class="dividerClass"
    :aria-orientation="orientation"
  >
</template>
