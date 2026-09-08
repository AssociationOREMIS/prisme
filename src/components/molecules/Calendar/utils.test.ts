import { describe, expect, it } from 'vitest'
import { parseIsoDate, toIsoDate } from './utils'

describe('toIsoDate', () => {
  it('formats a local date without shifting it through UTC', () => {
    // A naive `date.toISOString().slice(0, 10)` would return '2026-03-04' here
    // in any timezone ahead of UTC (e.g. Europe/Paris), since local midnight
    // converts to the previous day in UTC.
    const date = new Date(2026, 2, 5) // March 5th, 2026, local midnight
    expect(toIsoDate(date)).toBe('2026-03-05')
  })

  it('pads single-digit months and days', () => {
    expect(toIsoDate(new Date(2026, 0, 1))).toBe('2026-01-01')
  })
})

describe('parseIsoDate', () => {
  it('parses a YYYY-MM-DD string as a local date, not UTC', () => {
    const date = parseIsoDate('2026-03-05')
    expect(date.getFullYear()).toBe(2026)
    expect(date.getMonth()).toBe(2)
    expect(date.getDate()).toBe(5)
  })

  it('round-trips through toIsoDate without drifting', () => {
    expect(toIsoDate(parseIsoDate('2026-12-31'))).toBe('2026-12-31')
  })
})
