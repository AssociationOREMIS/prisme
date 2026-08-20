<script setup lang="ts">
import { Menu } from '@lucide/vue'
import { computed, inject } from 'vue'
import { prAppShellContextKey } from '../AppShell/appShellContext'

export interface PrNavbarProps {
  title?: string
  brandLabel?: string
  logoVariant?: 'icon-only'
  diagonalDivider?: boolean
  mobileMenuLabel?: string
}

const props = withDefaults(defineProps<PrNavbarProps>(), {
  title: undefined,
  brandLabel: 'OREMIS',
  logoVariant: undefined,
  diagonalDivider: false,
  mobileMenuLabel: 'Ouvrir la navigation',
})

const shell = inject(prAppShellContextKey, null)
const navbarTitle = computed(() => props.title ?? props.brandLabel)
const logoSrc = computed(() =>
  props.logoVariant === 'icon-only' ? '/oremis-icon.svg' : '/oremis-logo.svg',
)
</script>

<template>
  <nav class="pr-navbar sticky top-0 col-[1/-1] row-[1] z-[50] flex h-[var(--pr-navbar-height)] w-full items-center justify-between bg-[#0d2c99] px-[var(--pr-space-4)] py-[var(--pr-space-3)] text-white [[data-pr-theme=dark]_&]:bg-[#21212e] max-[780px]:px-[var(--pr-space-3)]" aria-label="Navigation principale">
    <div class="pr-navbar__brand inline-flex min-w-0 items-center gap-[var(--pr-space-3)]">
      <button
        v-if="shell"
        class="pr-navbar__menu-button hidden size-9 cursor-pointer place-items-center rounded-[var(--pr-radius-md)] bg-transparent text-white transition-[background-color,color,border-color] duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)] hover:bg-white/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)] max-[780px]:inline-grid"
        type="button"
        :aria-label="mobileMenuLabel"
        :aria-expanded="shell.mobileOpen.value"
        @click="shell.toggleMobile"
      >
        <Menu aria-hidden="true" :size="20" />
      </button>

      <slot name="brand">
        <img
          class="pr-navbar__logo block h-9 w-auto shrink-0 object-contain object-center"
          :class="{ 'pr-navbar__logo--icon w-9': logoVariant === 'icon-only' }"
          :src="logoSrc"
          alt="OREMIS"
        />
        <span
          class="pr-navbar__divider"
          :class="[
            'h-8 w-0.5 shrink-0 bg-[#6d83cc] [[data-pr-theme=dark]_&]:bg-[#8b8ca9]',
            { 'pr-navbar__divider--diagonal rotate-12': diagonalDivider },
          ]"
          aria-hidden="true"
        />
        <h1 class="pr-navbar__title m-0 whitespace-nowrap text-[length:var(--pr-font-size-lg)] font-semibold leading-[var(--pr-line-height-tight)] text-white">{{ navbarTitle }}</h1>
      </slot>
    </div>

    <div v-if="$slots.default || $slots.actions" class="pr-navbar__actions ml-auto inline-flex items-center gap-[var(--pr-space-1)] max-[780px]:hidden">
      <slot />
      <slot name="actions" />
    </div>

    <div v-if="$slots.user" class="pr-navbar__user ml-[var(--pr-space-3)] inline-flex items-center gap-[var(--pr-space-1)] border-l border-[var(--pr-color-navbar-border)] pl-[var(--pr-space-3)] max-[780px]:ml-[var(--pr-space-2)] max-[780px]:pl-[var(--pr-space-2)]">
      <slot name="user" />
    </div>
  </nav>
</template>
