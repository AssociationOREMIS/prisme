<script setup lang="ts">
import { usePrMessages } from '../../../i18n/context'
export interface PrNavigationMenuItem {
  label: string
  href: string
  /** Defaults to comparing `href` against `window.location.pathname` (matching sub-paths too) when omitted — same auto-detection as `PrSidebarItem`. */
  active?: boolean
}

/**
 * A flat list of navigation links with active-state detection — not the full
 * reka-ui `NavigationMenu` pattern (nested submenus opened by a trigger).
 * Use `PrDropdownMenu` for an actual flyout, or `PrSidebarItem`/`PrSidebarSubItem`
 * if a two-level nav structure is needed.
 */
export interface PrNavigationMenuProps {
  items?: PrNavigationMenuItem[]
  /** Name for screen readers (the element shows no text of its own). */
  ariaLabel?: string
  /**
   * `default`: links on a grey hover, the active one on a light primary background.
   * `subtle`: plain text links for a site header; the active one in the primary color and
   * underlined (not by its color alone, WCAG 1.4.1).
   */
  variant?: 'default' | 'subtle'
}

const props = withDefaults(defineProps<PrNavigationMenuProps>(), {
  items: () => [],
  ariaLabel: undefined,
  variant: 'default',
})

const messages = usePrMessages()

const linkBaseClass = 'pr-navigation-menu__link pr:inline-flex pr:min-h-[2.375rem] pr:items-center pr:rounded-[var(--pr-radius-md)] pr:text-[length:var(--pr-font-size-sm)] pr:no-underline pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]'

const variantClass = {
  default: {
    link: 'pr:px-[var(--pr-space-3)] pr:font-[650] pr:hover:bg-[var(--pr-color-surface-subtle)] pr:hover:text-[color:var(--pr-color-text)]',
    idle: 'pr:text-[color:var(--pr-color-text-muted)]',
    active: 'pr-navigation-menu__link--active pr:bg-[var(--pr-color-primary-soft)] pr:text-[color:var(--pr-color-primary)]',
  },
  subtle: {
    link: 'pr:px-[var(--pr-space-4)] pr:font-medium pr:underline-offset-[6px] pr:decoration-2 pr:hover:underline',
    idle: 'pr:text-[color:var(--pr-color-text)]',
    active: 'pr-navigation-menu__link--active pr:text-[color:var(--pr-color-primary)] pr:underline',
  },
} as const

function linkClass(item: PrNavigationMenuItem) {
  const classes = variantClass[props.variant]
  return [linkBaseClass, classes.link, isActive(item) ? classes.active : classes.idle]
}

function isActive(item: PrNavigationMenuItem): boolean {
  if (item.active !== undefined) return item.active
  if (typeof window === 'undefined') return false
  const path = window.location.pathname
  return path === item.href || path.startsWith(`${item.href}/`)
}
</script>

<template>
  <nav class="pr-navigation-menu pr:inline-flex pr:flex-wrap pr:items-center pr:gap-[var(--pr-space-1)]" :class="`pr-navigation-menu--${variant}`" :aria-label="ariaLabel ?? messages.navigationMenu.label">
    <a
      v-for="item in items"
      :key="item.href"
      :class="linkClass(item)"
      :href="item.href"
      :aria-current="isActive(item) ? 'page' : undefined"
    >
      {{ item.label }}
    </a>
  </nav>
</template>
