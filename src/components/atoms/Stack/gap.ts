/** A step of the spacing scale: `4` is `--pr-space-4`. */
export type PrSpaceStep = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12

/** The `gap` of each step, written out in full: Tailwind only generates the classes it finds in the source. */
export const prGapClass: Record<PrSpaceStep, string> = {
  1: 'pr:gap-[var(--pr-space-1)]',
  2: 'pr:gap-[var(--pr-space-2)]',
  3: 'pr:gap-[var(--pr-space-3)]',
  4: 'pr:gap-[var(--pr-space-4)]',
  5: 'pr:gap-[var(--pr-space-5)]',
  6: 'pr:gap-[var(--pr-space-6)]',
  8: 'pr:gap-[var(--pr-space-8)]',
  10: 'pr:gap-[var(--pr-space-10)]',
  12: 'pr:gap-[var(--pr-space-12)]',
}
