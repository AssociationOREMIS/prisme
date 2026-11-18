<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { PrLink, type PrLinkTo } from '../../atoms/Link'
import PrNavbarMenu from './PrNavbarMenu.vue'
import { usePrMessages } from '../../../i18n/context'
import { usePrTheme } from '../../../composables/usePrTheme'

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
  /** Same as `homeHref` with a route of the app's Vue Router (see `PrLink`). */
  homeTo?: PrLinkTo
  /** Text alternative of the logo (defaults to `brandLabel`). Left empty when the title shown next to it already says it. */
  logoAlt?: string
  /**
   * `default`: the dark bar of the apps, full width. `floating`: the header of a public site, a
   * light rounded bar with a shadow, floating above the page with a margin around it; the
   * title is in the primary color, and the `nav` slot sits right after the brand.
   */
  variant?: 'default' | 'floating'
  /**
   * Logo shown in the dark theme. With `variant="floating"` the bar is light in the light theme:
   * the default logo is then the color one, and this white one in the dark theme.
   */
  logoSrcDark?: string
  /**
   * With `variant="floating"`: width of the bar, as `PrContainer`. `full` (default) spans the page;
   * `wide` and `narrow` center it so that the logo lines up with the text of a container of the
   * same width.
   */
  width?: 'full' | 'wide' | 'narrow'
  /**
   * With `variant="floating"`, below 780 px: the `nav` slot and the actions move into a menu
   * (`PrNavbarMenu`) opened by a button, and the bar stays on one line. On by default; the
   * `user` slot always stays in the bar (theme, « Quitter vite »).
   */
  mobileMenu?: boolean
  /** Name of the mobile menu's button and title of its panel, « Menu » by default. */
  menuLabel?: string
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
  homeTo: undefined,
  logoAlt: undefined,
  variant: 'default',
  logoSrcDark: undefined,
  width: 'full',
  mobileMenu: true,
  menuLabel: undefined,
})

const messages = usePrMessages()
// Only a bar that changes its logo with the theme follows it: usePrTheme() starts managing the
// theme of the page (stored choice, system preference), which an app bar must not do on its own.
const isDark = props.variant === 'floating' || props.logoSrcDark ? usePrTheme().isDark : computed(() => false)
const floating = computed(() => props.variant === 'floating')
const hasMenu = computed(() => floating.value && props.mobileMenu)

// Once the page has scrolled, the floating bar gets a stronger shadow, to stand out from the
// content passing under it. Passive listener, and only for the floating bar.
const scrolled = ref(false)
function updateScrolled() {
  scrolled.value = window.scrollY > 4
}
onMounted(() => {
  if (!floating.value) return
  updateScrolled()
  window.addEventListener('scroll', updateScrolled, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', updateScrolled))

// Lined up with PrContainer: its 80rem (or 48rem) box, side gutters included, is the bar's box,
// whose own padding (the same gutter) puts the logo on the edge of the container's text.
const widthClass = {
  full: '',
  wide: 'pr:mx-auto pr:max-w-[80rem]',
  narrow: 'pr:mx-auto pr:max-w-[48rem]',
} as const

// Focus rings on the dark bar: a light blue (8:1) instead of the default blue-500 (2.35:1).
// The floating bar is light: the theme's own focus color.
const headerClass = computed(() => floating.value
  ? 'pr-navbar pr-navbar--floating pr:sticky pr:top-0 pr:z-[50] pr:w-full pr:px-[2.5rem] pr:py-[var(--pr-space-6)] pr:max-[780px]:px-[var(--pr-space-3)] pr:max-[780px]:py-[var(--pr-space-3)]'
  : 'pr-navbar pr:[--pr-color-focus:var(--pr-blue-200)] pr:sticky pr:top-0 pr:col-[1/-1] pr:row-[1] pr:z-[50] pr:flex pr:h-[var(--pr-navbar-height)] pr:w-full pr:items-center pr:justify-between pr:bg-[var(--pr-color-navbar)] pr:px-[var(--pr-space-4)] pr:py-[var(--pr-space-3)] pr:text-[color:var(--pr-color-navbar-text)] pr:max-[780px]:px-[var(--pr-space-3)]')

// The default bar lays its children out itself: the inner box is transparent to the layout.
const innerClass = computed(() => floating.value
  // 90% opaque and blurred: the page shows a little under it while the text stays sharp. Fully
  // opaque for people who ask for less transparency (low vision, visual fatigue).
  ? ['pr-navbar__inner pr:flex pr:flex-wrap pr:items-center pr:justify-between pr:gap-y-[var(--pr-space-2)] pr:rounded-[var(--pr-radius-xl)] pr:bg-[color-mix(in_srgb,var(--pr-color-surface)_90%,transparent)] pr:px-[2.5rem] pr:py-[var(--pr-space-4)] pr:text-[color:var(--pr-color-text)] pr:shadow-[var(--pr-shadow-md)] pr:backdrop-blur-md pr:transition-shadow pr:duration-[var(--pr-duration-fast)] pr:data-[scrolled=true]:shadow-[0_0.75rem_2rem_rgb(15_23_42/0.18)] pr:[@media(prefers-reduced-transparency:reduce)]:bg-[var(--pr-color-surface)] pr:[@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none pr:max-[780px]:px-[var(--pr-space-4)] pr:max-[780px]:py-[var(--pr-space-3)]', widthClass[props.width], hasMenu.value && 'pr:max-[780px]:flex-nowrap']
  : 'pr-navbar__inner pr:contents')

const navbarTitle = computed(() => props.title ?? props.brandLabel)
const resolvedLogoSrc = computed(() => {
  if (props.logoVariant === 'icon-only') {
    return props.iconSrc ?? '/oremis-icon.svg'
  }
  if (isDark.value && props.logoSrcDark) return props.logoSrcDark
  if (props.variant === 'floating') {
    return isDark.value
      ? (props.logoSrcDark ?? 'https://static.oremis.fr/img/logos/oremis-logo-white.svg')
      : (props.logoSrc ?? 'https://static.oremis.fr/img/logos/oremis-logo.svg')
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
  <!-- floating: the header of a public site, a light rounded bar floating in a margin; its inner
       box carries the look, the <header> only the sticky position and the margin around it. -->
  <header :class="headerClass">
    <div :class="innerClass" :data-scrolled="floating ? String(scrolled) : undefined">
      <div class="pr-navbar__brand pr:inline-flex pr:min-w-0 pr:items-center pr:gap-[var(--pr-space-3)]">
        <slot name="brand">
          <component
            :is="homeHref || homeTo ? PrLink : 'div'"
            class="pr-navbar__home pr:inline-flex pr:min-w-0 pr:items-center pr:gap-[var(--pr-space-3)] pr:rounded-[var(--pr-radius-md)] pr:text-inherit pr:no-underline pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]"
            v-bind="homeHref || homeTo ? { href: homeHref, to: homeTo } : {}"
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
                floating ? 'pr:h-8 pr:w-px pr:shrink-0 pr:bg-[var(--pr-color-primary-border)]' : 'pr:h-8 pr:w-0.5 pr:shrink-0 pr:bg-[var(--pr-color-navbar-muted)]',
                { 'pr-navbar__divider--diagonal pr:rotate-12': diagonalDivider, 'pr:max-[780px]:hidden': hideTitleOnMobile, 'pr:max-[400px]:hidden': hasMenu },
              ]"
              aria-hidden="true"
            />
            <!-- Two lines at most, rather than cut: a long title stays readable with larger text spacing (WCAG 1.4.12).
                 Below 400 px, next to the theme and menu buttons, it has no room left: only screen
                 readers get it, the logo still leads home. -->
            <p
              :class="[{ 'pr:max-[780px]:hidden': hideTitleOnMobile, 'pr:max-[400px]:sr-only': hasMenu }, floating ? 'pr:text-[length:var(--pr-font-size-xl)] pr:text-[color:var(--pr-color-primary)] pr:max-[780px]:text-[length:var(--pr-font-size-lg)]' : 'pr:text-[length:var(--pr-font-size-lg)] pr:text-[color:var(--pr-color-navbar-text)]']"
              class="pr-navbar__title pr:font-[family-name:var(--pr-font-heading)] pr:m-0 pr:min-w-0 pr:line-clamp-2 pr:break-words pr:font-semibold pr:leading-[var(--pr-line-height-tight)]"
            >
              {{ navbarTitle }}
            </p>
            <span v-if="homeHref || homeTo" class="pr:sr-only">({{ messages.navbar.home }})</span>
          </component>
        </slot>
      </div>

      <!-- The site's main navigation (a PrNavigationMenu), right after the brand; below 780 px it
         takes a row of its own under the brand. -->
      <div
        v-if="$slots.nav"
        class="pr-navbar__nav pr:ms-[var(--pr-space-8)] pr:me-auto pr:min-w-0 pr:max-[780px]:order-last pr:max-[780px]:ms-0 pr:max-[780px]:w-full"
        :class="{ 'pr:max-[780px]:hidden': hasMenu }"
      >
        <slot name="nav" />
      </div>

      <div
        v-if="$slots.default || $slots.actions"
        class="pr-navbar__actions pr:ml-auto pr:inline-flex pr:shrink-0 pr:items-center pr:gap-[var(--pr-space-1)]"
        :class="{ 'pr:max-[780px]:hidden': hideActionsOnMobile || hasMenu }"
      >
        <slot />
        <slot name="actions" />
      </div>

      <div
        v-if="$slots.user"
        class="pr-navbar__user pr:ml-[var(--pr-space-3)] pr:inline-flex pr:shrink-0 pr:items-center pr:gap-[var(--pr-space-2)] pr:max-[780px]:ml-[var(--pr-space-2)]"
        :class="[floating ? '' : 'pr:border-l pr:border-[var(--pr-color-navbar-border)] pr:pl-[var(--pr-space-3)] pr:max-[780px]:pl-[var(--pr-space-2)]', { 'pr:max-[780px]:ml-auto': hasMenu }]"
      >
        <slot name="user" />
      </div>

      <!-- Below 780 px, the navigation and the actions go into the mobile menu, opened by a button
           at the end of the bar. Its panel only renders them once opened. -->
      <div
        v-if="hasMenu && ($slots.nav || $slots.default || $slots.actions)"
        class="pr-navbar__menu pr:inline-flex pr:shrink-0 pr:min-[781px]:hidden"
        :class="$slots.user ? 'pr:ml-[var(--pr-space-2)]' : 'pr:ml-auto'"
      >
        <PrNavbarMenu :label="menuLabel">
          <slot name="nav" />
          <div v-if="$slots.default || $slots.actions" class="pr-navbar__menu-actions pr:grid pr:justify-items-start pr:gap-[var(--pr-space-3)]">
            <slot />
            <slot name="actions" />
          </div>
        </PrNavbarMenu>
      </div>
    </div>
  </header>
</template>
