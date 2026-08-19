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
  <nav class="pr-navigation-menu" :aria-label="label">
    <a
      v-for="item in items"
      :key="item.href"
      class="pr-navigation-menu__link"
      :class="{ 'pr-navigation-menu__link--active': item.active }"
      :href="item.href"
      :aria-current="item.active ? 'page' : undefined"
    >
      {{ item.label }}
    </a>
  </nav>
</template>
