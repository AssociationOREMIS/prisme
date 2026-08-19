<script setup lang="ts">
import type { Component } from 'vue'
import { PrSidebarItem } from '../SidebarItem'

export interface PrSidebarSubItemProps {
  as?: string | Component
  href?: string
  icon: Component
  label: string
  description?: string
  active?: boolean
  disabled?: boolean
}

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
