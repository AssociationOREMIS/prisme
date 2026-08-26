import type { InjectionKey, Ref } from 'vue'

export interface PrAppShellContext {
  collapsed: Ref<boolean>
  toggleCollapsed: () => void
  setCollapsed: (value: boolean) => void
}

export const prAppShellContextKey: InjectionKey<PrAppShellContext> = Symbol('pr-app-shell')
