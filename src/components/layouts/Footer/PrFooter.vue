<script setup lang="ts">
import { computed, useId, type Component } from 'vue'
import { PrButton } from '../../atoms/Button'
import { PrLink, type PrLinkTo } from '../../atoms/Link'
import { usePrMessages } from '../../../i18n/context'
import { usePrTheme } from '../../../composables/usePrTheme'

export interface PrFooterLink {
  label: string
  /** Address of the page. */
  href?: string
  /** Route of the app's Vue Router, instead of `href` (see `PrLink`). */
  to?: PrLinkTo
}

export interface PrFooterColumn {
  /** Title of the column, also the name of its navigation landmark. */
  title: string
  links: PrFooterLink[]
}

export interface PrFooterSocial {
  /** Name of the network, the accessible name and tooltip of the icon-only link. */
  label: string
  href: string
  /** Icon of the network: `PrIconDiscord`, `PrIconInstagram`... (`@oremis/prisme` brand icons). */
  icon: Component
}

export interface PrFooterProps {
  /** Name of the site, shown after the logo with a thin divider. */
  siteName?: string
  /** Logo of the light theme. */
  logoSrc?: string
  /** Logo of the dark theme (a white logo). */
  logoSrcDark?: string
  /** Text alternative of the logo. */
  logoAlt?: string
  /** Makes the logo and the site name a link to this address, the home page. */
  homeHref?: string
  /** Same as `homeHref` with a route of the app's Vue Router (see `PrLink`). */
  homeTo?: PrLinkTo
  /** Short text under the brand (or the `description` slot). */
  description?: string
  /** One to four columns of links, each a navigation landmark named by its title. */
  columns?: PrFooterColumn[]
  /** Icon-only links to the social networks, under the description. */
  socials?: PrFooterSocial[]
  /** Links of the bottom line (legal notice, accessibility, privacy), in a navigation landmark. */
  legalLinks?: PrFooterLink[]
  /** Text of the bottom line, `© <year> Association OREMIS` by default. */
  copyright?: string
  /**
   * Width of the content, as `PrContainer`: `full` (default) spans the page, `wide` (80rem) and
   * `narrow` (48rem) center it on the text of a container of the same width. The background
   * always spans the page.
   */
  width?: 'full' | 'wide' | 'narrow'
  /** No margin above: the footer follows a full-width section (an image, a colored band) directly. */
  flush?: boolean
}

const props = withDefaults(defineProps<PrFooterProps>(), {
  siteName: undefined,
  logoSrc: 'https://static.oremis.fr/img/logos/oremis-logo.svg',
  logoSrcDark: 'https://static.oremis.fr/img/logos/oremis-logo-white.svg',
  logoAlt: 'OREMIS',
  homeHref: undefined,
  homeTo: undefined,
  description: undefined,
  columns: () => [],
  socials: () => [],
  legalLinks: () => [],
  copyright: undefined,
  width: 'full',
  flush: false,
})

// The footer's padding is PrContainer's gutter: capping the content at the container's width minus
// two gutters lines it up with the text of the sections above.
const contentWidthClass = {
  full: '',
  wide: 'pr:mx-auto pr:max-w-[calc(80rem-2*var(--pr-space-10))]',
  narrow: 'pr:mx-auto pr:max-w-[calc(48rem-2*var(--pr-space-10))]',
} as const

/** A link given by `to` or `href`, keyed by either. */
const linkKey = (link: PrFooterLink) => link.href ?? JSON.stringify(link.to)

const messages = usePrMessages()
const { isDark } = usePrTheme()
const id = useId()

const visibleColumns = computed(() => props.columns.slice(0, 4))
const resolvedLogoSrc = computed(() => (isDark.value ? props.logoSrcDark : props.logoSrc))
const resolvedCopyright = computed(() => props.copyright ?? messages.footer.copyright(new Date().getFullYear()))
const gridStyle = computed(() => ({ '--pr-footer-columns': String(Math.max(visibleColumns.value.length, 1)) }))

const linkClass = 'pr-footer__link pr:inline-flex pr:min-h-6 pr:items-center pr:rounded-[var(--pr-radius-xs)] pr:text-[length:var(--pr-font-size-sm)] pr:text-[color:var(--pr-color-text)] pr:no-underline pr:hover:underline pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]'
</script>

<template>
  <footer
    class="pr-footer pr:box-border pr:w-full pr:bg-[var(--pr-color-surface-subtle)] pr:p-[var(--pr-space-10)] pr:text-[color:var(--pr-color-text)] pr:max-[780px]:px-[var(--pr-space-4)] pr:max-[780px]:py-[var(--pr-space-8)]"
    :class="flush ? 'pr:mt-0' : 'pr:mt-[var(--pr-space-12)]'"
  >
    <!-- A <footer>: the contentinfo landmark of the page. -->
    <!-- The brand, then one column per group of links. Below 780px: the brand on its own row, the columns two by two. -->
    <div
      :class="contentWidthClass[width]"
      class="pr-footer__grid pr:grid pr:grid-cols-[minmax(0,2.2fr)_repeat(var(--pr-footer-columns),minmax(0,1fr))] pr:gap-[var(--pr-space-8)] pr:max-[780px]:grid-cols-2 pr:max-[780px]:gap-[var(--pr-space-6)]"
      :style="gridStyle"
    >
      <div class="pr-footer__brand pr:grid pr:content-start pr:gap-[var(--pr-space-4)] pr:max-[780px]:col-span-full">
        <slot name="brand">
          <component
            :is="homeHref || homeTo ? PrLink : 'div'"
            v-bind="homeHref || homeTo ? { href: homeHref, to: homeTo } : {}"
            class="pr-footer__home pr:inline-flex pr:w-fit pr:max-w-full pr:items-center pr:gap-[var(--pr-space-3)] pr:rounded-[var(--pr-radius-md)] pr:text-inherit pr:no-underline pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]"
          >
            <img class="pr-footer__logo pr:block pr:h-9 pr:w-auto pr:shrink-0" :src="resolvedLogoSrc" :alt="logoAlt">
            <template v-if="siteName">
              <span class="pr-footer__divider pr:h-8 pr:w-px pr:shrink-0 pr:bg-[var(--pr-color-border-strong)]" aria-hidden="true" />
              <p class="pr-footer__site-name pr:m-0 pr:min-w-0 pr:font-[family-name:var(--pr-font-heading)] pr:text-[length:var(--pr-font-size-lg)] pr:font-semibold pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-primary)] pr:[overflow-wrap:break-word]">
                {{ siteName }}
              </p>
            </template>
            <span v-if="homeHref || homeTo" class="pr:sr-only">({{ messages.navbar.home }})</span>
          </component>
        </slot>
        <div
          v-if="description || $slots.description"
          class="pr-footer__description pr:max-w-[28rem] pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-normal)] pr:text-[color:var(--pr-color-text-muted)]"
        >
          <slot name="description">{{ description }}</slot>
        </div>
        <ul
          v-if="socials.length"
          class="pr-footer__socials pr:m-0 pr:flex pr:list-none pr:flex-wrap pr:gap-[var(--pr-space-1)] pr:p-0"
          :aria-label="messages.footer.socials"
        >
          <li v-for="social in socials" :key="social.href">
            <PrButton class="pr-footer__social" variant="ghost" :href="social.href" :icon="social.icon" :label="social.label" />
          </li>
        </ul>
      </div>

      <nav
        v-for="(column, index) in visibleColumns"
        :key="column.title"
        class="pr-footer__column pr:grid pr:content-start pr:gap-[var(--pr-space-3)]"
        :aria-labelledby="`${id}-column-${index}`"
      >
        <p
          :id="`${id}-column-${index}`"
          class="pr-footer__column-title pr:m-0 pr:font-[family-name:var(--pr-font-heading)] pr:text-[length:var(--pr-font-size-sm)] pr:font-semibold pr:text-[color:var(--pr-color-text-muted)]"
        >
          {{ column.title }}
        </p>
        <ul class="pr-footer__links pr:m-0 pr:grid pr:list-none pr:gap-[var(--pr-space-1)] pr:p-0">
          <li v-for="link in column.links" :key="linkKey(link)">
            <PrLink :href="link.href" :to="link.to" :class="linkClass">{{ link.label }}</PrLink>
          </li>
        </ul>
      </nav>
    </div>

    <div v-if="$slots.default" class="pr-footer__extra pr:mt-[var(--pr-space-8)]" :class="contentWidthClass[width]">
      <slot />
    </div>

    <div :class="contentWidthClass[width]" class="pr-footer__bottom pr:mt-[var(--pr-space-8)] pr:flex pr:flex-wrap pr:items-center pr:justify-between pr:gap-x-[var(--pr-space-6)] pr:gap-y-[var(--pr-space-3)] pr:border-t pr:border-[var(--pr-color-border)] pr:pt-[var(--pr-space-6)]">
      <p class="pr-footer__copyright pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:text-[color:var(--pr-color-text-muted)]">
        {{ resolvedCopyright }}
      </p>
      <nav v-if="legalLinks.length" class="pr-footer__legal" :aria-label="messages.footer.legalNav">
        <ul class="pr:m-0 pr:flex pr:list-none pr:flex-wrap pr:gap-x-[var(--pr-space-5)] pr:gap-y-[var(--pr-space-1)] pr:p-0">
          <li v-for="link in legalLinks" :key="linkKey(link)">
            <PrLink :href="link.href" :to="link.to" :class="linkClass">{{ link.label }}</PrLink>
          </li>
        </ul>
      </nav>
      <slot name="bottom" />
    </div>
  </footer>
</template>
