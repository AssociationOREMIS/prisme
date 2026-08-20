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
}

export interface PrSidebarSubItemProps {
  as?: string | Component
  href?: string
  icon: Component
  label: string
  description?: string
  active?: boolean
  disabled?: boolean
}
