import type { InjectionKey, Ref } from 'vue'

export interface PrAppShellContext {
  collapsed: Ref<boolean>
  mobileOpen: Ref<boolean>
  toggleCollapsed: () => void
  setCollapsed: (value: boolean) => void
  openMobile: () => void
  closeMobile: () => void
  toggleMobile: () => void
}

export const prAppShellContextKey: InjectionKey<PrAppShellContext> = Symbol('pr-app-shell')
