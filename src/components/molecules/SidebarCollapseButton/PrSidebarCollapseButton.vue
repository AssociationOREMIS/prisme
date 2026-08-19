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
    class="pr-sidebar__collapse"
    type="button"
    :aria-label="ariaLabel"
    :aria-pressed="shell.collapsed.value"
    @click="shell.toggleCollapsed"
  >
    <ChevronRight v-if="shell.collapsed.value" aria-hidden="true" :size="18" />
    <ChevronLeft v-else aria-hidden="true" :size="18" />
    <span class="pr-sidebar__collapse-label">{{ collapseLabel }}</span>
  </button>
</template>
