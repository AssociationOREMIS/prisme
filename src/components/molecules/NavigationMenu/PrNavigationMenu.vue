<script setup lang="ts">
export interface PrNavigationMenuItem {
  label: string
  href: string
  active?: boolean
}

export interface PrNavigationMenuProps {
  items?: PrNavigationMenuItem[]
  label?: string
}

withDefaults(defineProps<PrNavigationMenuProps>(), {
  items: () => [],
  label: 'Navigation',
})
</script>

<template>
  <nav class="pr-navigation-menu inline-flex flex-wrap items-center gap-[var(--pr-space-1)]" :aria-label="label">
    <a
      v-for="item in items"
      :key="item.href"
      class="pr-navigation-menu__link inline-flex min-h-[2.375rem] items-center rounded-[var(--pr-radius-md)] px-[var(--pr-space-3)] text-[length:var(--pr-font-size-sm)] font-[650] text-[color:var(--pr-color-text-muted)] no-underline hover:bg-[var(--pr-color-surface-subtle)] hover:text-[color:var(--pr-color-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)]"
      :class="{ 'pr-navigation-menu__link--active bg-[var(--pr-color-primary-soft)] text-[color:var(--pr-color-primary)]': item.active }"
      :href="item.href"
      :aria-current="item.active ? 'page' : undefined"
    >
      {{ item.label }}
    </a>
  </nav>
</template>
