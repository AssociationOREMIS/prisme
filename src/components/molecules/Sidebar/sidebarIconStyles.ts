export const sidebarIconBaseClass = [
  'pr-sidebar-item__icon-box relative inline-grid size-9 shrink-0 place-items-center',
  'rounded-[var(--pr-radius-lg)] transition-[background-color,color]',
  'duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)]',
].join(' ')

export const sidebarIconBadgeCountClass = [
  'pr-sidebar-item__badge absolute -top-1 -right-1 z-[1] inline-flex h-[1.125rem] min-w-[1.125rem]',
  'items-center justify-center rounded-[var(--pr-radius-full)] border-2 border-[var(--pr-color-background)]',
  'bg-[var(--pr-color-danger)] px-[0.1875rem] text-[9px] font-[750] leading-none text-[color:var(--pr-neutral-0)]',
].join(' ')

export const sidebarIconBadgeDotClass = [
  'pr-sidebar-item__badge-dot absolute top-0 right-0 z-[1] size-2.5 rounded-[var(--pr-radius-full)]',
  'border-2 border-[var(--pr-color-background)] bg-[var(--pr-color-danger)]',
].join(' ')

export const sidebarIconInactiveClass = [
  'bg-[var(--pr-color-surface-subtle)] text-[color:var(--pr-color-text-muted)]',
  'group-hover/sidebar-item:bg-[var(--pr-color-border)]',
  'group-hover/sidebar-item:text-[color:var(--pr-color-text)]',
].join(' ')

export const sidebarIconActiveClass =
  'bg-[var(--pr-color-sidebar-active)] text-[color:var(--pr-neutral-0)]'
