export const sidebarIconBaseClass = [
  'pr-sidebar-item__icon-box pr:relative pr:inline-grid pr:size-9 pr:shrink-0 pr:place-items-center',
  'pr:rounded-[var(--pr-radius-lg)] pr:transition-[background-color,color]',
  'pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)]',
].join(' ')

export const sidebarIconBadgeCountClass = [
  'pr-sidebar-item__badge pr:absolute pr:-top-1 pr:-right-1 pr:z-[1] pr:inline-flex pr:h-[1.125rem] pr:min-w-[1.125rem]',
  'pr:items-center pr:justify-center pr:rounded-[var(--pr-radius-full)] pr:border-2 pr:border-[var(--pr-color-background)]',
  'pr:bg-[var(--pr-color-danger-solid)] pr:px-[0.1875rem] pr:text-[9px] pr:font-[750] pr:leading-none pr:text-[color:var(--pr-neutral-0)]',
].join(' ')

export const sidebarIconBadgeDotClass = [
  'pr-sidebar-item__badge-dot pr:absolute pr:top-0 pr:right-0 pr:z-[1] pr:size-2.5 pr:rounded-[var(--pr-radius-full)]',
  'pr:border-2 pr:border-[var(--pr-color-background)] pr:bg-[var(--pr-color-danger)]',
].join(' ')

export const sidebarIconInactiveClass = [
  'pr:bg-[var(--pr-color-surface-subtle)] pr:text-[color:var(--pr-color-text-muted)]',
  'pr:group-hover/sidebar-item:bg-[var(--pr-color-border)]',
  'pr:group-hover/sidebar-item:text-[color:var(--pr-color-text)]',
].join(' ')

export const sidebarIconActiveClass =
  // White icon on the data/formation green, kept by design choice although it reaches only
  // 2.23:1 (WCAG asks 3:1 for icons): the active entry is also marked by aria-current.
  'pr:bg-[var(--pr-color-sidebar-active)] pr:text-[color:var(--pr-neutral-0)]'
