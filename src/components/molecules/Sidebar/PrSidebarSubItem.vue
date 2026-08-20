<script setup lang="ts">
import PrSidebarItem from './PrSidebarItem.vue'
import type { PrSidebarSubItemProps } from './types'

withDefaults(defineProps<PrSidebarSubItemProps>(), {
  as: undefined,
  href: undefined,
  description: undefined,
  active: false,
  disabled: false,
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
  />
</template>
