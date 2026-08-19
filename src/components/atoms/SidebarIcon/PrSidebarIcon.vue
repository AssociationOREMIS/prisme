<script setup lang="ts">
import type { Component } from 'vue'

export interface PrSidebarIconProps {
  icon: Component
  size?: number
  strokeWidth?: number
}

withDefaults(defineProps<PrSidebarIconProps>(), {
  size: 18,
  strokeWidth: 2,
})
</script>

<template>
  <span class="pr-sidebar-item__icon-box" aria-hidden="true">
    <component
      :is="icon"
      class="pr-sidebar-item__icon"
      :size="size"
      :stroke-width="strokeWidth"
    />
  </span>
</template>
