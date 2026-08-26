import type { ComputedRef, InjectionKey, Ref } from 'vue'

export interface PrSidebarContext {
  /** Desktop collapse preference (rail vs. full width when the sidebar is in normal flow). */
  collapsed: Ref<boolean>
  /** Whether the sidebar is currently rendered narrow (rail/icon-only), on any viewport. */
  isNarrow: ComputedRef<boolean>
  /** Whether the current viewport is at or below the mobile breakpoint (780px). */
  isMobile: Ref<boolean>
  /** Toggles `collapsed` on desktop, or the mobile flyout on mobile. */
  toggle: () => void
  /** Closes the mobile flyout, if open. No-op outside the mobile breakpoint. */
  closeMobileFlyout: () => void
}

export const prSidebarContextKey: InjectionKey<PrSidebarContext> = Symbol('pr-sidebar')
