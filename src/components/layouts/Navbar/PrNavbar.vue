<script setup lang="ts">
import { computed } from 'vue'
import { usePrMessages } from '../../../i18n/context'

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
  /** Hides the app title and its divider below 780px, keeping only the logo. */
  hideTitleOnMobile?: boolean
  /** Makes the logo and the title a link to this address, the app's home page. Ignored if the `#brand` slot is used. */
  homeHref?: string
  /** Text alternative of the logo (defaults to `brandLabel`). Left empty when the title shown next to it already says it. */
  logoAlt?: string
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
  hideTitleOnMobile: false,
  homeHref: undefined,
  logoAlt: undefined,
})

const messages = usePrMessages()

const navbarTitle = computed(() => props.title ?? props.brandLabel)
const resolvedLogoSrc = computed(() => {
  if (props.logoVariant === 'icon-only') {
    return props.iconSrc ?? '/oremis-icon.svg'
  }
  return props.logoSrc ?? 'https://static.oremis.fr/img/logos/oremis-logo-white.svg'
})
const hasMobileLogo = computed(() => !!props.mobileLogoSrc)
// The logo's alternative, unless the title next to it, always shown, already says the same:
// « OREMIS OREMIS » was read otherwise.
const resolvedLogoAlt = computed(() => {
  const alt = props.logoAlt ?? props.brandLabel
  return !props.hideTitleOnMobile && navbarTitle.value === alt ? '' : alt
})
</script>

<template>
  <!-- A <header> (banner), not a <nav>: it holds the brand, theme and user menu, while the
       sidebar is the navigation. The app name is a <p>, leaving each page its own <h1>. -->
  <!-- Focus rings sit on the dark navbar here: a light blue (8:1) instead of the default blue-500 (2.35:1). -->
  <header class="pr-navbar pr:[--pr-color-focus:var(--pr-blue-200)] pr:sticky pr:top-0 pr:col-[1/-1] pr:row-[1] pr:z-[50] pr:flex pr:h-[var(--pr-navbar-height)] pr:w-full pr:items-center pr:justify-between pr:bg-[var(--pr-color-navbar)] pr:px-[var(--pr-space-4)] pr:py-[var(--pr-space-3)] pr:text-[color:var(--pr-color-navbar-text)] pr:max-[780px]:px-[var(--pr-space-3)]">
    <div class="pr-navbar__brand pr:inline-flex pr:min-w-0 pr:items-center pr:gap-[var(--pr-space-3)]">
      <slot name="brand">
        <component
          :is="homeHref ? 'a' : 'div'"
          class="pr-navbar__home pr:inline-flex pr:min-w-0 pr:items-center pr:gap-[var(--pr-space-3)] pr:rounded-[var(--pr-radius-md)] pr:text-inherit pr:no-underline pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]"
          :href="homeHref"
        >
          <img
            class="pr-navbar__logo pr:block pr:h-9 pr:w-auto pr:shrink-0 pr:object-contain pr:object-center"
            :class="[
              { 'pr-navbar__logo--icon pr:w-9': logoVariant === 'icon-only' },
              { 'pr:max-[780px]:hidden': hasMobileLogo },
            ]"
            :src="resolvedLogoSrc"
            :alt="resolvedLogoAlt"
          >
          <img
            v-if="hasMobileLogo"
            class="pr-navbar__logo pr-navbar__logo--mobile pr:hidden pr:h-9 pr:w-9 pr:shrink-0 pr:object-contain pr:object-center pr:max-[780px]:block"
            :src="mobileLogoSrc"
            :alt="resolvedLogoAlt"
          >
          <span
            class="pr-navbar__divider"
            :class="[
              'pr:h-8 pr:w-0.5 pr:shrink-0 pr:bg-[var(--pr-color-navbar-muted)]',
              { 'pr-navbar__divider--diagonal pr:rotate-12': diagonalDivider, 'pr:max-[780px]:hidden': hideTitleOnMobile },
            ]"
            aria-hidden="true"
          />
          <!-- Two lines at most, rather than cut: a long title stays readable with larger text spacing (WCAG 1.4.12). -->
          <p :class="{ 'pr:max-[780px]:hidden': hideTitleOnMobile }" class="pr-navbar__title pr:font-[family-name:var(--pr-font-heading)] pr:m-0 pr:min-w-0 pr:line-clamp-2 pr:break-words pr:text-[length:var(--pr-font-size-lg)] pr:font-semibold pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-navbar-text)]">{{ navbarTitle }}</p>
          <span v-if="homeHref" class="pr:sr-only">({{ messages.navbar.home }})</span>
        </component>
      </slot>
    </div>

    <div
      v-if="$slots.default || $slots.actions"
      class="pr-navbar__actions pr:ml-auto pr:inline-flex pr:shrink-0 pr:items-center pr:gap-[var(--pr-space-1)]"
      :class="{ 'pr:max-[780px]:hidden': hideActionsOnMobile }"
    >
      <slot />
      <slot name="actions" />
    </div>

    <div v-if="$slots.user" class="pr-navbar__user pr:ml-[var(--pr-space-3)] pr:inline-flex pr:shrink-0 pr:items-center pr:gap-[var(--pr-space-1)] pr:border-l pr:border-[var(--pr-color-navbar-border)] pr:pl-[var(--pr-space-3)] pr:max-[780px]:ml-[var(--pr-space-2)] pr:max-[780px]:pl-[var(--pr-space-2)]">
      <slot name="user" />
    </div>
  </header>
</template>
