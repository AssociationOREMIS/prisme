<script setup lang="ts">
export interface PrTableProps {
  caption?: string
}

withDefaults(defineProps<PrTableProps>(), {
  caption: undefined,
})
</script>

<template>
  <div class="pr-table-wrap pr:w-full pr:overflow-x-auto pr:rounded-[var(--pr-radius-lg)] pr:border pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)]">
    <table class="pr-table pr:w-full pr:min-w-[min(36rem,100%)] pr:border-collapse pr:text-[length:var(--pr-font-size-sm)] pr:text-[color:var(--pr-color-text)] pr:[&_td]:border-b pr:[&_td]:border-[var(--pr-color-border)] pr:[&_td]:p-[var(--pr-space-3)] pr:[&_td]:text-left pr:[&_th]:border-b pr:[&_th]:border-[var(--pr-color-border)] pr:[&_th]:bg-[var(--pr-color-surface-subtle)] pr:[&_th]:p-[var(--pr-space-3)] pr:[&_th]:text-left pr:[&_th]:font-[750]">
      <caption v-if="caption" class="pr-table__caption pr:p-[var(--pr-space-3)] pr:text-left pr:text-[color:var(--pr-color-text-muted)]">{{ caption }}</caption>
      <slot />
    </table>
  </div>
</template>
