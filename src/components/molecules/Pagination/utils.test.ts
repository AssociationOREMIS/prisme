import { describe, expect, it } from 'vitest'
import { buildPageHref, buildPaginationItems } from './utils'

describe('buildPaginationItems', () => {
  it('lists every page when there are few', () => {
    expect(buildPaginationItems(5, 1)).toEqual([1, 2, 3, 4, 5])
    expect(buildPaginationItems(7, 4)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('truncates a large total around the current page', () => {
    expect(buildPaginationItems(100, 1)).toEqual([1, 2, 'ellipsis', 100])
    expect(buildPaginationItems(100, 50)).toEqual([1, 'ellipsis', 49, 50, 51, 'ellipsis', 100])
    expect(buildPaginationItems(100, 100)).toEqual([1, 'ellipsis', 99, 100])
  })

  it('never produces more than a bounded number of items regardless of total', () => {
    const items = buildPaginationItems(100_000, 50_000)
    expect(items.length).toBeLessThanOrEqual(7)
  })
})

describe('buildPageHref', () => {
  it('changes only the page parameter of the current address', () => {
    expect(buildPageHref('https://app.test/users?q=martin&other_page=3', 'page', 2)).toBe('https://app.test/users?q=martin&other_page=3&page=2')
    expect(buildPageHref('https://app.test/?absent_page=4&inactive_page=2', 'absent_page', 5)).toBe('https://app.test/?absent_page=5&inactive_page=2')
  })

  it('replaces the hash with the fragment, or drops it', () => {
    expect(buildPageHref('https://app.test/?page=1#top', 'page', 2, 'staff')).toBe('https://app.test/?page=2#staff')
    expect(buildPageHref('https://app.test/?page=1#top', 'page', 2, '#staff')).toBe('https://app.test/?page=2#staff')
    expect(buildPageHref('https://app.test/?page=1#top', 'page', 2)).toBe('https://app.test/?page=2')
  })
})
