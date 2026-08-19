<script setup lang="ts">
export interface PrTableProps {
  caption?: string
}

withDefaults(defineProps<PrTableProps>(), {
  caption: undefined,
})
</script>

<template>
  <div class="pr-table-wrap">
    <table class="pr-table">
      <caption v-if="caption" class="pr-table__caption">{{ caption }}</caption>
      <slot />
    </table>
  </div>
</template>
