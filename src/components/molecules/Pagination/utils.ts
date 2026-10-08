export type PrPaginationItem = number | 'ellipsis'

/**
 * Builds the list of page buttons to render: every page when there are few,
 * otherwise first/last plus a window around the current page with ellipses —
 * so a large server-side total doesn't render one button per page.
 */
export function buildPaginationItems(total: number, current: number): PrPaginationItem[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const windowStart = Math.max(2, current - 1)
  const windowEnd = Math.min(total - 1, current + 1)
  const items: PrPaginationItem[] = [1]

  if (windowStart > 2) items.push('ellipsis')
  for (let page = windowStart; page <= windowEnd; page++) items.push(page)
  if (windowEnd < total - 1) items.push('ellipsis')
  items.push(total)

  return items
}

/**
 * Address of `page` for a server-paginated list (Laravel `?page=2`): the
 * current address with only the page parameter changed, so the other query
 * parameters (filters, the page of another list) are kept. `fragment` replaces
 * the hash, to land back on the list instead of the top of the page.
 */
export function buildPageHref(currentHref: string, pageParam: string, page: number, fragment?: string): string {
  const url = new URL(currentHref)
  url.searchParams.set(pageParam, String(page))
  url.hash = fragment ? `#${fragment.replace(/^#/, '')}` : ''

  return url.href
}
