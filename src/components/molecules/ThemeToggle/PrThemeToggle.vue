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
    class="pr-theme-toggle"
    type="button"
    :aria-label="nextThemeLabel"
    :title="nextThemeLabel"
    @click="toggleTheme"
  >
    <component :is="icon" aria-hidden="true" :size="18" :stroke-width="2" />
    <span class="pr-theme-toggle__label">{{ label }}</span>
  </button>
</template>
