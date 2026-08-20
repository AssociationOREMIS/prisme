<script setup lang="ts">
import { Moon, Sun } from '@lucide/vue'
import { computed } from 'vue'
import { usePrTheme } from '../../../composables/usePrTheme'

export interface PrThemeToggleProps {
  label?: string
}

withDefaults(defineProps<PrThemeToggleProps>(), {
  label: 'Theme',
})

const { resolvedTheme, toggleTheme } = usePrTheme()

const nextThemeLabel = computed(() => (
  resolvedTheme.value === 'light' ? 'Passer en theme sombre' : 'Passer en theme clair'
))
const icon = computed(() => (resolvedTheme.value === 'light' ? Moon : Sun))
</script>

<template>
  <button
    class="pr-theme-toggle inline-grid size-8 cursor-pointer place-items-center rounded-[var(--pr-radius-md)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] text-[color:var(--pr-color-text-muted)] shadow-[var(--pr-shadow-xs)] transition-[background-color,border-color,color] duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)] hover:border-[var(--pr-color-primary-border)] hover:bg-[var(--pr-color-primary-soft)] hover:text-[color:var(--pr-color-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)]"
    type="button"
    :aria-label="nextThemeLabel"
    :title="nextThemeLabel"
    @click="toggleTheme"
  >
    <component :is="icon" aria-hidden="true" :size="18" :stroke-width="2" />
    <span class="pr-theme-toggle__label hidden">{{ label }}</span>
  </button>
</template>
