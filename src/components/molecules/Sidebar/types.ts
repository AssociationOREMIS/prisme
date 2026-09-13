import type { Component } from 'vue'

export interface PrSidebarItemProps {
  as?: string | Component
  href?: string
  icon: Component
  label: string
  description?: string
  active?: boolean
  disabled?: boolean
  expanded?: boolean
  defaultExpanded?: boolean
  /** Displays a red counter badge on the icon (e.g. pending items). Capped at `badgeMax`. */
  badgeCount?: number
  badgeMax?: number
  /** Displays a plain red dot badge, for a "there's something new" indicator with no exact count. */
  badgeDot?: boolean
}

export interface PrSidebarSubItemProps {
  as?: string | Component
  href?: string
  icon: Component
  label: string
  description?: string
  active?: boolean
  disabled?: boolean
  badgeCount?: number
  badgeMax?: number
  badgeDot?: boolean
}
