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
  <nav class="pr-navbar" aria-label="Navigation principale">
    <div class="pr-navbar__brand">
      <button
        v-if="shell"
        class="pr-navbar__menu-button"
        type="button"
        :aria-label="mobileMenuLabel"
        :aria-expanded="shell.mobileOpen.value"
        @click="shell.toggleMobile"
      >
        <Menu aria-hidden="true" :size="20" />
      </button>

      <slot name="brand">
        <img
          class="pr-navbar__logo"
          :class="{ 'pr-navbar__logo--icon': logoVariant === 'icon-only' }"
          :src="logoSrc"
          alt="OREMIS"
        />
        <span
          class="pr-navbar__divider"
          :class="{ 'pr-navbar__divider--diagonal': diagonalDivider }"
          aria-hidden="true"
        />
        <h1 class="pr-navbar__title">{{ navbarTitle }}</h1>
      </slot>
    </div>

    <div v-if="$slots.default || $slots.actions" class="pr-navbar__actions">
      <slot />
      <slot name="actions" />
    </div>

    <div v-if="$slots.user" class="pr-navbar__user">
      <slot name="user" />
    </div>
  </nav>
</template>
