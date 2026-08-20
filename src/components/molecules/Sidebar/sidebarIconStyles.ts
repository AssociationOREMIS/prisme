export const sidebarIconBaseClass = [
  'pr-sidebar-item__icon-box inline-grid size-9 shrink-0 place-items-center',
  'rounded-[var(--pr-radius-md)] border transition-[background-color,border-color,color,box-shadow]',
  'duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)]',
].join(' ')

export const sidebarIconInactiveClass = [
  'border-[var(--pr-color-border)] bg-[var(--pr-color-surface-subtle)] text-[color:var(--pr-color-text-muted)]',
  'group-hover/sidebar-item:border-[var(--pr-color-primary-border)]',
  'group-hover/sidebar-item:bg-[var(--pr-color-primary-soft)]',
  'group-hover/sidebar-item:text-[color:var(--pr-color-primary)]',
].join(' ')

export const sidebarIconActiveClass =
  'border-[var(--pr-color-primary)] bg-[var(--pr-color-primary)] text-[color:var(--pr-color-primary-contrast)] shadow-[var(--pr-shadow-xs)]'
