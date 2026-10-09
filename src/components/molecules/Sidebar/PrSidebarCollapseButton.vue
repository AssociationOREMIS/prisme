<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import { computed, inject } from 'vue'
import { prSidebarContextKey } from './sidebarContext'
import { usePrMessages } from '../../../i18n/context'

export interface PrSidebarCollapseButtonProps {
  collapseLabel?: string
  expandLabel?: string
}

const props = withDefaults(defineProps<PrSidebarCollapseButtonProps>(), {
  collapseLabel: undefined,
  expandLabel: undefined,
})

const messages = usePrMessages()

const sidebar = inject(prSidebarContextKey, null)
const ariaLabel = computed(() => (
  sidebar?.isNarrow.value ? (props.expandLabel ?? messages.sidebar.expand) : (props.collapseLabel ?? messages.sidebar.collapse)
))
</script>

<template>
  <!-- The label itself says what a press does ("Réduire" / "Étendre"): adding aria-pressed
       on top announced a contradictory "pressed" state. -->
  <button
    v-if="sidebar"
    class="pr-sidebar__collapse pr:inline-grid pr:w-full pr:grid-flow-col pr:cursor-pointer pr:place-items-center pr:justify-center pr:gap-[var(--pr-space-2)] pr:border-t pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface-subtle)] pr:p-[0.875rem] pr:text-[length:var(--pr-font-size-sm)] pr:font-[650] pr:text-[color:var(--pr-color-text-subtle)] pr:transition-[background-color,color] pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)] pr:hover:bg-[var(--pr-color-border)] pr:hover:text-[color:var(--pr-color-text)] pr:focus-visible:outline-2 pr:focus-visible:-outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]"
    type="button"
    :aria-label="ariaLabel"
    @click="sidebar.toggle"
  >
    <ChevronRight v-if="sidebar.isNarrow.value" aria-hidden="true" :size="18" />
    <ChevronLeft v-else aria-hidden="true" :size="18" />
    <span class="pr-sidebar__collapse-label pr:overflow-hidden pr:text-ellipsis pr:whitespace-nowrap">{{ collapseLabel ?? messages.sidebar.collapse }}</span>
  </button>
</template>
