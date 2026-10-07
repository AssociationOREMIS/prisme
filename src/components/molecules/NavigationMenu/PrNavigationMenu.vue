<script setup lang="ts">
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
  label?: string
}

withDefaults(defineProps<PrNavigationMenuProps>(), {
  items: () => [],
  label: 'Navigation',
})

function isActive(item: PrNavigationMenuItem): boolean {
  if (item.active !== undefined) return item.active
  if (typeof window === 'undefined') return false
  const path = window.location.pathname
  return path === item.href || path.startsWith(`${item.href}/`)
}
</script>

<template>
  <nav class="pr-navigation-menu pr:inline-flex pr:flex-wrap pr:items-center pr:gap-[var(--pr-space-1)]" :aria-label="label">
    <a
      v-for="item in items"
      :key="item.href"
      class="pr-navigation-menu__link pr:inline-flex pr:min-h-[2.375rem] pr:items-center pr:rounded-[var(--pr-radius-md)] pr:px-[var(--pr-space-3)] pr:text-[length:var(--pr-font-size-sm)] pr:font-[650] pr:text-[color:var(--pr-color-text-muted)] pr:no-underline pr:hover:bg-[var(--pr-color-surface-subtle)] pr:hover:text-[color:var(--pr-color-text)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]"
      :class="{ 'pr-navigation-menu__link--active pr:bg-[var(--pr-color-primary-soft)] pr:text-[color:var(--pr-color-primary)]': isActive(item) }"
      :href="item.href"
      :aria-current="isActive(item) ? 'page' : undefined"
    >
      {{ item.label }}
    </a>
  </nav>
</template>
