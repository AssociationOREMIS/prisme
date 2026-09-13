<script setup lang="ts">
import type { Component } from 'vue'
import { computed } from 'vue'
import {
  sidebarIconActiveClass,
  sidebarIconBadgeCountClass,
  sidebarIconBadgeDotClass,
  sidebarIconBaseClass,
  sidebarIconInactiveClass,
} from './sidebarIconStyles'

export interface PrSidebarIconProps {
  icon: Component
  size?: number
  strokeWidth?: number
  active?: boolean
  /** Displays a red counter badge on the icon (e.g. pending items). Capped at `badgeMax`. */
  badgeCount?: number
  badgeMax?: number
  /** Displays a plain red dot badge, for a "there's something new" indicator with no exact count. */
  badgeDot?: boolean
}

const props = withDefaults(defineProps<PrSidebarIconProps>(), {
  size: 18,
  strokeWidth: 2,
  active: false,
  badgeCount: undefined,
  badgeMax: 99,
  badgeDot: false,
})

const iconBoxClass = computed(() => [
  sidebarIconBaseClass,
  props.active ? sidebarIconActiveClass : sidebarIconInactiveClass,
])

const hasCount = computed(() => (props.badgeCount ?? 0) > 0)
const showBadge = computed(() => hasCount.value || props.badgeDot)
const badgeLabel = computed(() => {
  if (!hasCount.value) return ''
  return props.badgeCount! > props.badgeMax ? `${props.badgeMax}+` : String(props.badgeCount)
})
const badgeAriaLabel = computed(() =>
  hasCount.value
    ? `${props.badgeCount} notification${props.badgeCount! > 1 ? 's' : ''}`
    : 'Notification',
)
</script>

<template>
  <span :class="iconBoxClass">
    <component
      :is="icon"
      class="pr-sidebar-item__icon shrink-0"
      :size="size"
      :stroke-width="strokeWidth"
      aria-hidden="true"
    />
    <span
      v-if="showBadge"
      :class="hasCount ? sidebarIconBadgeCountClass : sidebarIconBadgeDotClass"
      role="status"
      :aria-label="badgeAriaLabel"
    >
      {{ badgeLabel }}
    </span>
  </span>
</template>
