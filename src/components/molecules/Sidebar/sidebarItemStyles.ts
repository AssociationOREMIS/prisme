export const sidebarItemClass = 'pr-sidebar-item min-w-0'

export const sidebarItemLinkBaseClass = [
  'pr-sidebar-item__link flex min-h-[3.25rem] w-full min-w-0 cursor-pointer items-center',
  'gap-[var(--pr-space-3)] rounded-[var(--pr-radius-lg)] border border-transparent',
  'bg-transparent p-[var(--pr-space-2)] text-left text-[length:var(--pr-font-size-sm)]',
  'font-[650] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-text)]',
  'no-underline transition-[background-color,border-color,color] duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)]',
  'hover:bg-transparent hover:text-[color:var(--pr-color-text)]',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)]',
].join(' ')

export const sidebarItemLinkDisabledClass =
  'cursor-not-allowed opacity-[0.55]'

export const sidebarItemLabelBaseClass =
  'pr-sidebar-item__label overflow-hidden text-ellipsis whitespace-nowrap text-[color:var(--pr-color-text)]'

export const sidebarItemLabelActiveClass =
  'font-[750] text-[color:var(--pr-color-text)]'

export const sidebarItemDescriptionClass =
  'pr-sidebar-item__description overflow-hidden text-ellipsis whitespace-nowrap text-[length:var(--pr-font-size-xs)] font-medium text-[color:var(--pr-color-text-muted)]'
