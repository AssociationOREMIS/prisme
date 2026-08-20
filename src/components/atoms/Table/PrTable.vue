<script setup lang="ts">
export interface PrTableProps {
  caption?: string
}

withDefaults(defineProps<PrTableProps>(), {
  caption: undefined,
})
</script>

<template>
  <div class="pr-table-wrap w-full overflow-x-auto rounded-[var(--pr-radius-lg)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)]">
    <table class="pr-table w-full min-w-[min(36rem,100%)] border-collapse text-[length:var(--pr-font-size-sm)] text-[color:var(--pr-color-text)] [&_td]:border-b [&_td]:border-[var(--pr-color-border)] [&_td]:p-[var(--pr-space-3)] [&_td]:text-left [&_th]:border-b [&_th]:border-[var(--pr-color-border)] [&_th]:bg-[var(--pr-color-surface-subtle)] [&_th]:p-[var(--pr-space-3)] [&_th]:text-left [&_th]:font-[750]">
      <caption v-if="caption" class="pr-table__caption p-[var(--pr-space-3)] text-left text-[color:var(--pr-color-text-muted)]">{{ caption }}</caption>
      <slot />
    </table>
  </div>
</template>
