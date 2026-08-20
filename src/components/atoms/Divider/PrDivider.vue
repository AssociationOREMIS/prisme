<script setup lang="ts">
import { computed } from 'vue'

export interface PrDividerProps {
  orientation?: 'horizontal' | 'vertical'
}

const props = withDefaults(defineProps<PrDividerProps>(), {
  orientation: 'horizontal',
})

const dividerOrientationClass: Record<NonNullable<PrDividerProps['orientation']>, string> = {
  horizontal: 'my-[var(--pr-space-4)] h-px w-full',
  vertical: 'mx-[var(--pr-space-4)] min-h-6 w-px self-stretch',
}

const dividerClass = computed(() => [
  'pr-divider shrink-0 border-0 bg-[var(--pr-color-border)]',
  dividerOrientationClass[props.orientation],
])
</script>

<template>
  <hr
    :class="dividerClass"
    :aria-orientation="orientation"
  >
</template>
