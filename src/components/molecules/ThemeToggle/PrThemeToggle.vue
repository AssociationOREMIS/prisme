<script setup lang="ts">
import { Moon, Sun } from '@lucide/vue'
import { computed } from 'vue'
import { usePrTheme } from '../../../composables/usePrTheme'
import { usePrMessages } from '../../../i18n/context'
import { warnDeprecated } from '../../deprecation'

export interface PrThemeToggleProps {
  /** Name for screen readers (the element shows no text of its own). */
  ariaLabel?: string
  /** @deprecated Use `ariaLabel` (`aria-label`) instead: `label` is for visible text. Removed in 1.0. */
  label?: string
}

const props = withDefaults(defineProps<PrThemeToggleProps>(), {
  ariaLabel: undefined,
  label: undefined,
})

if (props.label !== undefined) warnDeprecated('PrThemeToggle', 'label', 'aria-label')

const messages = usePrMessages()

const { resolvedTheme, toggleTheme } = usePrTheme()

const nextThemeLabel = computed(() => (
  resolvedTheme.value === 'light' ? messages.themeToggle.toDark : messages.themeToggle.toLight
))
const accessibleLabel = computed(() => props.ariaLabel ?? props.label ?? nextThemeLabel.value)
const icon = computed(() => (resolvedTheme.value === 'light' ? Moon : Sun))
</script>

<template>
  <button
    class="pr-theme-toggle pr:inline-grid pr:size-8 pr:cursor-pointer pr:place-items-center pr:rounded-[var(--pr-radius-md)] pr:border pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)] pr:text-[color:var(--pr-color-text-muted)] pr:shadow-[var(--pr-shadow-xs)] pr:transition-[background-color,border-color,color] pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)] pr:hover:border-[var(--pr-color-primary-border)] pr:hover:bg-[var(--pr-color-primary-soft)] pr:hover:text-[color:var(--pr-color-text)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]"
    type="button"
    :aria-label="accessibleLabel"
    :title="accessibleLabel"
    @click="toggleTheme"
  >
    <component :is="icon" aria-hidden="true" :size="18" :stroke-width="2" />
  </button>
</template>
