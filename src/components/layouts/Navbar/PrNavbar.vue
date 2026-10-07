<script setup lang="ts">
import { computed } from 'vue'

export interface PrNavbarProps {
  title?: string
  brandLabel?: string
  logoVariant?: 'icon-only'
  /** Overrides the default brand logo `<img>` source. Ignored if the `#brand` slot is used. */
  logoSrc?: string
  /** Overrides the default brand icon `<img>` source when `logoVariant` is `'icon-only'`. Ignored if the `#brand` slot is used. */
  iconSrc?: string
  /** Swaps in a reduced logo below the mobile breakpoint (780px), e.g. an icon-only mark. Ignored if the `#brand` slot is used. */
  mobileLogoSrc?: string
  diagonalDivider?: boolean
  /** Hides the default/`#actions` slot content below the mobile breakpoint (780px). Off by default. */
  hideActionsOnMobile?: boolean
}

const props = withDefaults(defineProps<PrNavbarProps>(), {
  title: undefined,
  brandLabel: 'OREMIS',
  logoVariant: undefined,
  logoSrc: undefined,
  iconSrc: undefined,
  mobileLogoSrc: undefined,
  diagonalDivider: false,
  hideActionsOnMobile: false,
})

const navbarTitle = computed(() => props.title ?? props.brandLabel)
const resolvedLogoSrc = computed(() => {
  if (props.logoVariant === 'icon-only') {
    return props.iconSrc ?? '/oremis-icon.svg'
  }
  return props.logoSrc ?? 'https://static.oremis.fr/img/logos/oremis-logo-white.svg'
})
const hasMobileLogo = computed(() => !!props.mobileLogoSrc)
</script>

<template>
  <!-- A <header> (banner), not a <nav>: it holds the brand, theme and user menu, while the
       sidebar is the navigation. The app name is a <p>, leaving each page its own <h1>. -->
  <!-- Focus rings sit on the dark navbar here: a light blue (8:1) instead of the default blue-500 (2.35:1). -->
  <header class="pr-navbar [--pr-color-focus:var(--pr-blue-200)] sticky top-0 col-[1/-1] row-[1] z-[50] flex h-[var(--pr-navbar-height)] w-full items-center justify-between bg-[var(--pr-color-navbar)] px-[var(--pr-space-4)] py-[var(--pr-space-3)] text-[color:var(--pr-color-navbar-text)] max-[780px]:px-[var(--pr-space-3)]">
    <div class="pr-navbar__brand inline-flex min-w-0 items-center gap-[var(--pr-space-3)]">
      <slot name="brand">
        <img
          class="pr-navbar__logo block h-9 w-auto shrink-0 object-contain object-center"
          :class="[
            { 'pr-navbar__logo--icon w-9': logoVariant === 'icon-only' },
            { 'max-[780px]:hidden': hasMobileLogo },
          ]"
          :src="resolvedLogoSrc"
          alt="OREMIS"
        />
        <img
          v-if="hasMobileLogo"
          class="pr-navbar__logo pr-navbar__logo--mobile hidden h-9 w-9 shrink-0 object-contain object-center max-[780px]:block"
          :src="mobileLogoSrc"
          alt="OREMIS"
        />
        <span
          class="pr-navbar__divider"
          :class="[
            'h-8 w-0.5 shrink-0 bg-[var(--pr-color-navbar-muted)]',
            { 'pr-navbar__divider--diagonal rotate-12': diagonalDivider },
          ]"
          aria-hidden="true"
        />
        <p class="pr-navbar__title m-0 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[length:var(--pr-font-size-lg)] font-semibold leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-navbar-text)]">{{ navbarTitle }}</p>
      </slot>
    </div>

    <div
      v-if="$slots.default || $slots.actions"
      class="pr-navbar__actions ml-auto inline-flex shrink-0 items-center gap-[var(--pr-space-1)]"
      :class="{ 'max-[780px]:hidden': hideActionsOnMobile }"
    >
      <slot />
      <slot name="actions" />
    </div>

    <div v-if="$slots.user" class="pr-navbar__user ml-[var(--pr-space-3)] inline-flex shrink-0 items-center gap-[var(--pr-space-1)] border-l border-[var(--pr-color-navbar-border)] pl-[var(--pr-space-3)] max-[780px]:ml-[var(--pr-space-2)] max-[780px]:pl-[var(--pr-space-2)]">
      <slot name="user" />
    </div>
  </header>
</template>
