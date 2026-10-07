export const sidebarItemClass = 'pr-sidebar-item pr:min-w-0'

export const sidebarItemLinkBaseClass = [
  'pr-sidebar-item__link pr:flex pr:w-full pr:min-w-0 pr:cursor-pointer pr:items-center',
  'pr:gap-[var(--pr-space-4)] pr:rounded-[var(--pr-radius-lg)] pr:border pr:border-transparent',
  'pr:bg-transparent pr:p-0 pr:text-left pr:text-[length:var(--pr-font-size-md)]',
  'pr:font-[650] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text)]',
  'pr:no-underline pr:transition-[background-color,border-color,color] pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)]',
  'pr:hover:bg-transparent pr:hover:text-[color:var(--pr-color-text)]',
  'pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]',
].join(' ')

export const sidebarItemLinkDisabledClass =
  'pr:cursor-not-allowed pr:opacity-[0.55]'

export const sidebarItemLabelBaseClass =
  'pr-sidebar-item__label pr:overflow-hidden pr:text-ellipsis pr:whitespace-nowrap pr:text-[color:var(--pr-color-text)]'

export const sidebarItemLabelActiveClass =
  'pr:font-[750] pr:text-[color:var(--pr-color-text)]'

export const sidebarItemDescriptionClass =
  'pr-sidebar-item__description pr:overflow-hidden pr:text-ellipsis pr:whitespace-nowrap pr:text-[0.8125rem] pr:font-normal pr:text-[color:var(--pr-color-text-subtle)]'
