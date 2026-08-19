<script setup lang="ts">
import { Menu } from '@lucide/vue'
import { inject } from 'vue'
import { prAppShellContextKey } from '../AppShell/appShellContext'

export interface PrNavbarProps {
  brandLabel?: string
  mobileMenuLabel?: string
}

withDefaults(defineProps<PrNavbarProps>(), {
  brandLabel: 'OREMIS',
  mobileMenuLabel: 'Ouvrir la navigation',
})

const shell = inject(prAppShellContextKey, null)
</script>

<template>
  <header class="pr-navbar">
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
        <span class="pr-navbar__brand-mark" aria-hidden="true">P</span>
        <span class="pr-navbar__brand-label">{{ brandLabel }}</span>
      </slot>
    </div>

    <div class="pr-navbar__spacer" />

    <div v-if="$slots.actions" class="pr-navbar__actions">
      <slot name="actions" />
    </div>

    <div v-if="$slots.user" class="pr-navbar__user">
      <slot name="user" />
    </div>
  </header>
</template>
