<script setup lang="ts">
import { computed } from 'vue'

export interface PrTableProps {
  /** Title of the table, read with it by screen readers. Without it (nor `ariaLabel`), a warning in the console. */
  caption?: string
  /** Keeps the `caption` for screen readers only, when a visible title already sits above the table. */
  captionHidden?: boolean
  /** Name of the table when it has no `caption` (prefer `caption`). */
  ariaLabel?: string
  /** `borderless`: no frame and no header band, a light line between rows, the hovered row highlighted (dashboard lists). */
  variant?: 'default' | 'borderless'
}

const props = withDefaults(defineProps<PrTableProps>(), {
  caption: undefined,
  captionHidden: false,
  ariaLabel: undefined,
  variant: 'default',
})

if (!props.caption && !props.ariaLabel) {
  console.warn('[prisme] PrTable: give the table a `caption` (or an `ariaLabel`), its name for screen readers.')
}

const borderless = computed(() => props.variant === 'borderless')
</script>

<template>
  <div
    class="pr-table-wrap pr:w-full pr:overflow-x-auto"
    :class="borderless
      ? 'pr-table-wrap--borderless'
      : 'pr:rounded-[var(--pr-radius-lg)] pr:border pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)]'"
  >
    <table
      :aria-label="caption ? undefined : ariaLabel"
      class="pr-table pr:w-full pr:min-w-[min(36rem,100%)] pr:border-collapse pr:text-[length:var(--pr-font-size-sm)] pr:text-[color:var(--pr-color-text)] pr:[&_td]:border-b pr:[&_td]:border-[var(--pr-color-border)] pr:[&_td]:p-[var(--pr-space-3)] pr:[&_td]:text-left pr:[&_th]:border-b pr:[&_th]:border-[var(--pr-color-border)] pr:[&_th]:p-[var(--pr-space-3)] pr:[&_th]:text-left"
      :class="borderless
        ? 'pr:[&_th]:font-bold pr:[&_th]:text-[color:var(--pr-color-text-muted)] pr:[&_td]:align-middle pr:[&_tbody_tr:last-child_td]:border-b-0 pr:[&_tbody_tr:hover_td]:bg-[var(--pr-color-surface-subtle)]'
        : 'pr:[&_th]:bg-[var(--pr-color-surface-subtle)] pr:[&_th]:font-[750]'"
    >
      <caption v-if="caption" class="pr-table__caption pr:p-[var(--pr-space-3)] pr:text-left pr:text-[color:var(--pr-color-text-muted)]" :class="{ 'pr:sr-only': captionHidden }">{{ caption }}</caption>
      <slot />
    </table>
  </div>
</template>
