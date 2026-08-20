<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import { computed, inject } from 'vue'
import { prAppShellContextKey } from '../../layouts/AppShell/appShellContext'

export interface PrSidebarCollapseButtonProps {
  collapseLabel?: string
  expandLabel?: string
}

const props = withDefaults(defineProps<PrSidebarCollapseButtonProps>(), {
  collapseLabel: 'Reduire la navigation',
  expandLabel: 'Etendre la navigation',
})

const shell = inject(prAppShellContextKey, null)
const ariaLabel = computed(() => (
  shell?.collapsed.value ? props.expandLabel : props.collapseLabel
))
</script>

<template>
  <button
    v-if="shell"
    class="pr-sidebar__collapse inline-grid min-h-9 w-full grid-flow-col cursor-pointer place-items-center justify-center gap-[var(--pr-space-2)] rounded-[var(--pr-radius-md)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] text-[length:var(--pr-font-size-sm)] font-[650] text-[color:var(--pr-color-text-muted)] transition-[background-color,color,border-color] duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)] hover:bg-[var(--pr-color-surface-subtle)] hover:text-[color:var(--pr-color-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)]"
    type="button"
    :aria-label="ariaLabel"
    :aria-pressed="shell.collapsed.value"
    @click="shell.toggleCollapsed"
  >
    <ChevronRight v-if="shell.collapsed.value" aria-hidden="true" :size="18" />
    <ChevronLeft v-else aria-hidden="true" :size="18" />
    <span class="pr-sidebar__collapse-label overflow-hidden text-ellipsis whitespace-nowrap">{{ collapseLabel }}</span>
  </button>
</template>
