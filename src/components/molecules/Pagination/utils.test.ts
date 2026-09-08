import { describe, expect, it } from 'vitest'
import { buildPaginationItems } from './utils'

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
