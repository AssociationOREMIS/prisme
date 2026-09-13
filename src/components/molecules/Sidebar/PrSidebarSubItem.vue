<script setup lang="ts">
import PrSidebarItem from './PrSidebarItem.vue'
import type { PrSidebarSubItemProps } from './types'

withDefaults(defineProps<PrSidebarSubItemProps>(), {
  as: undefined,
  href: undefined,
  description: undefined,
  active: undefined,
  disabled: false,
  badgeCount: undefined,
  badgeMax: 99,
  badgeDot: false,
})
</script>

<template>
  <PrSidebarItem
    :as="as"
    :href="href"
    :icon="icon"
    :label="label"
    :description="description"
    :active="active"
    :disabled="disabled"
    :badge-count="badgeCount"
    :badge-max="badgeMax"
    :badge-dot="badgeDot"
  />
</template>
