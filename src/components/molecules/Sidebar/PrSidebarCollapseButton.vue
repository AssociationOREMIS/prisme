<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import { computed, inject } from 'vue'
import { prSidebarContextKey } from './sidebarContext'

export interface PrSidebarCollapseButtonProps {
  collapseLabel?: string
  expandLabel?: string
}

const props = withDefaults(defineProps<PrSidebarCollapseButtonProps>(), {
  collapseLabel: 'Reduire la navigation',
  expandLabel: 'Etendre la navigation',
})

const sidebar = inject(prSidebarContextKey, null)
const ariaLabel = computed(() => (
  sidebar?.isNarrow.value ? props.expandLabel : props.collapseLabel
))
</script>

<template>
  <button
    v-if="sidebar"
    class="pr-sidebar__collapse inline-grid w-full grid-flow-col cursor-pointer place-items-center justify-center gap-[var(--pr-space-2)] border-t border-[var(--pr-color-border)] bg-[var(--pr-color-surface-subtle)] p-[0.875rem] text-[length:var(--pr-font-size-sm)] font-[650] text-[color:var(--pr-color-text-subtle)] transition-[background-color,color] duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)] hover:bg-[var(--pr-color-border)] hover:text-[color:var(--pr-color-text)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--pr-color-focus)]"
    type="button"
    :aria-label="ariaLabel"
    :aria-pressed="sidebar.isNarrow.value"
    @click="sidebar.toggle"
  >
    <ChevronRight v-if="sidebar.isNarrow.value" aria-hidden="true" :size="18" />
    <ChevronLeft v-else aria-hidden="true" :size="18" />
    <span class="pr-sidebar__collapse-label overflow-hidden text-ellipsis whitespace-nowrap">{{ collapseLabel }}</span>
  </button>
</template>
