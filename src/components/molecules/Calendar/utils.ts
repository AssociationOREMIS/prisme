/** Parses a `YYYY-MM-DD` string as a local calendar date, avoiding the UTC round-trip of `new Date(string)`. */
export function parseIsoDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/** Formats a local `Date` as `YYYY-MM-DD` without going through UTC (unlike `toISOString`), which would shift the date in any positive UTC-offset timezone. */
export function toIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
