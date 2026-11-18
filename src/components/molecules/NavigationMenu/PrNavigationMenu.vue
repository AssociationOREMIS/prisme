<script setup lang="ts">
import { computed } from 'vue'
import { PrLink, type PrLinkTo } from '../../atoms/Link'
import { usePrMessages } from '../../../i18n/context'
import { usePrNavigationOrientation } from './context'

export interface PrNavigationMenuItem {
  label: string
  /** Address of the page. */
  href?: string
  /** Route of the app's Vue Router, instead of `href`: navigates without reloading (see `PrLink`). */
  to?: PrLinkTo
  /**
   * Marks the current page. Worked out when omitted: from the router with `to`, otherwise by
   * comparing `href` with the address (sub-pages too, never for `/`), as `PrSidebarItem` does.
   */
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
  /**
   * `horizontal` (default): links side by side, wrapping onto a new line when they run out of
   * room. `vertical`: one link per line, the whole width, large touch targets: the menu of a
   * phone. Inside a `PrNavbarMenu`, vertical unless set otherwise.
   */
  orientation?: 'horizontal' | 'vertical'
}

const props = withDefaults(defineProps<PrNavigationMenuProps>(), {
  items: () => [],
  ariaLabel: undefined,
  variant: 'default',
  orientation: undefined,
})

const messages = usePrMessages()
const inherited = usePrNavigationOrientation()
const orientation = computed(() => props.orientation ?? inherited ?? 'horizontal')

const linkBaseClass = 'pr-navigation-menu__link pr:inline-flex pr:min-h-[2.375rem] pr:items-center pr:rounded-[var(--pr-radius-md)] pr:text-[length:var(--pr-font-size-sm)] pr:no-underline pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)] pr:[overflow-wrap:break-word]'

// The current page is styled from `data-current`, set by PrLink: the same rule whether the
// link was found current by the router or by the address.
const variantClass = {
  default: 'pr:px-[var(--pr-space-3)] pr:font-[650] pr:text-[color:var(--pr-color-text-muted)] pr:hover:bg-[var(--pr-color-surface-subtle)] pr:hover:text-[color:var(--pr-color-text)] pr:data-[current=true]:bg-[var(--pr-color-primary-soft)] pr:data-[current=true]:text-[color:var(--pr-color-primary)]',
  subtle: 'pr:px-[var(--pr-space-4)] pr:font-medium pr:text-[color:var(--pr-color-text)] pr:underline-offset-[6px] pr:decoration-2 pr:hover:underline pr:data-[current=true]:text-[color:var(--pr-color-primary)] pr:data-[current=true]:underline',
} as const

// Vertical: a phone menu, every link a full-width row of 44 px at least (WCAG 2.5.5), in the
// regular text size; the current one also gets the soft primary background.
const orientationClass = {
  horizontal: '',
  vertical: 'pr:w-full pr:min-h-[2.75rem] pr:text-[length:var(--pr-font-size-md)] pr:data-[current=true]:bg-[var(--pr-color-primary-soft)]',
} as const
</script>

<template>
  <nav
    class="pr-navigation-menu pr:gap-[var(--pr-space-1)]"
    :class="[
      `pr-navigation-menu--${variant}`,
      `pr-navigation-menu--${orientation}`,
      orientation === 'vertical' ? 'pr:flex pr:flex-col pr:items-stretch' : 'pr:inline-flex pr:flex-wrap pr:items-center',
    ]"
    :aria-label="ariaLabel ?? messages.navigationMenu.label"
  >
    <PrLink
      v-for="item in items"
      :key="item.href ?? JSON.stringify(item.to)"
      :class="[linkBaseClass, variantClass[variant], orientationClass[orientation]]"
      :href="item.href"
      :to="item.to"
      :current="item.active"
      current-detection
    >
      {{ item.label }}
    </PrLink>
  </nav>
</template>
