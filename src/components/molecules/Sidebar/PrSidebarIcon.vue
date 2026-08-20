<script setup lang="ts">
import type { Component } from 'vue'
import { computed } from 'vue'
import {
  sidebarIconActiveClass,
  sidebarIconBaseClass,
  sidebarIconInactiveClass,
} from './sidebarIconStyles'

export interface PrSidebarIconProps {
  icon: Component
  size?: number
  strokeWidth?: number
  active?: boolean
}

const props = withDefaults(defineProps<PrSidebarIconProps>(), {
  size: 18,
  strokeWidth: 2,
  active: false,
})

const iconBoxClass = computed(() => [
  sidebarIconBaseClass,
  props.active ? sidebarIconActiveClass : sidebarIconInactiveClass,
])
</script>

<template>
  <span :class="iconBoxClass" aria-hidden="true">
    <component
      :is="icon"
      class="pr-sidebar-item__icon shrink-0"
      :size="size"
      :stroke-width="strokeWidth"
    />
  </span>
</template>
