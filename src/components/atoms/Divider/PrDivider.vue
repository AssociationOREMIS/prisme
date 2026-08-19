<script setup lang="ts">
export interface PrDividerProps {
  orientation?: 'horizontal' | 'vertical'
}

withDefaults(defineProps<PrDividerProps>(), {
  orientation: 'horizontal',
})
</script>

<template>
  <hr
    class="pr-divider"
    :class="`pr-divider--${orientation}`"
    :aria-orientation="orientation"
  >
</template>
