import { describe, expect, it } from 'vitest'
import { compareDataTableValues, fromLaravelPaginator } from './utils'

describe('compareDataTableValues', () => {
  it('sorts nullish values last', () => {
    expect(compareDataTableValues(null, 1)).toBeGreaterThan(0)
    expect(compareDataTableValues(1, null)).toBeLessThan(0)
    expect(compareDataTableValues(null, null)).toBe(0)
  })

  it('compares numbers numerically', () => {
    expect(compareDataTableValues(2, 10)).toBeLessThan(0)
  })

  it('compares dates chronologically', () => {
    expect(compareDataTableValues(new Date('2024-01-01'), new Date('2024-06-01'))).toBeLessThan(0)
  })

  it('falls back to a natural string comparison', () => {
    expect(compareDataTableValues('item-2', 'item-10')).toBeLessThan(0)
  })
})

describe('fromLaravelPaginator', () => {
  const rows = [{ id: 1 }, { id: 2 }]

  it('maps the default Model::paginate() flat shape', () => {
    const state = fromLaravelPaginator({
      data: rows,
      current_page: 2,
      per_page: 15,
      total: 42,
    })

    expect(state).toEqual({ rows, page: 2, pageSize: 15, totalRows: 42 })
  })

  it('maps an API Resource collection wrapping the paginator in meta', () => {
    const state = fromLaravelPaginator({
      data: rows,
      meta: { current_page: 1, per_page: 10, total: 2 },
    })

    expect(state).toEqual({ rows, page: 1, pageSize: 10, totalRows: 2 })
  })
})
