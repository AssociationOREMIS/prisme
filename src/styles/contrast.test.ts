import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

// WCAG contrast of the theme tokens, computed from tokens.css and themes.css, so a color change
// cannot silently make text or field borders unreadable again. OREMIS apps serve pupils with
// disabilities and non-technical volunteers: AA is the floor (4.5:1 for text, 3:1 for the
// borders that identify a field and for focus rings).

const dirname = path.dirname(fileURLToPath(import.meta.url))
const read = (file: string) => fs.readFileSync(path.resolve(dirname, file), 'utf8')

function declarations(css: string): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [, name, value] of css.matchAll(/(--pr-[\w-]+)\s*:\s*([^;]+);/g)) result[name] = value.trim()
  return result
}

const palette = declarations(read('tokens.css'))
const themesCss = read('themes.css')
const light = declarations(themesCss.slice(0, themesCss.indexOf('[data-pr-theme="dark"],')))
const dark = declarations(themesCss.slice(themesCss.indexOf('[data-pr-theme="dark"],'), themesCss.indexOf('@media')))

type Rgba = [number, number, number, number]

function resolve(theme: Record<string, string>, token: string): Rgba {
  let value = theme[token] ?? palette[token]
  for (let guard = 0; value?.startsWith('var('); guard++) {
    const name = value.slice(4, -1).trim()
    value = theme[name] ?? palette[name]
    if (guard > 5) break
  }
  if (!value) throw new Error(`Unknown token ${token}`)
  const hex = value.match(/^#([0-9a-f]{6})$/i)
  if (hex) return [0, 2, 4].map(i => parseInt(hex[1].slice(i, i + 2), 16)).concat(1) as Rgba
  const rgb = value.match(/^rgb\((\d+) (\d+) (\d+)(?: \/ (\d+)%)?\)$/)
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3]), rgb[4] ? Number(rgb[4]) / 100 : 1]
  throw new Error(`Unsupported color ${value} for ${token}`)
}

// A translucent color (dark theme "soft" backgrounds) is blended over the surface it sits on.
function over([r, g, b, a]: Rgba, [br, bg, bb]: Rgba): Rgba {
  return [r * a + br * (1 - a), g * a + bg * (1 - a), b * a + bb * (1 - a), 1]
}

function luminance([r, g, b]: Rgba): number {
  const channel = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

function contrast(theme: Record<string, string>, foreground: string, background: string, base = '--pr-color-surface'): number {
  const surface = resolve(theme, base)
  const bg = over(resolve(theme, background), surface)
  const fg = over(resolve(theme, foreground), bg)
  const [l1, l2] = [luminance(fg), luminance(bg)].sort((a, b) => b - a)
  return (l1 + 0.05) / (l2 + 0.05)
}

const TEXT: Array<[string, string]> = [
  ['--pr-color-text', '--pr-color-surface'],
  ['--pr-color-text-muted', '--pr-color-surface'],
  ['--pr-color-text-muted', '--pr-color-background'],
  ['--pr-color-text-subtle', '--pr-color-surface'],
  ['--pr-color-text-subtle', '--pr-color-background'],
  ['--pr-color-text-muted', '--pr-color-surface-subtle'],
  ['--pr-color-text-subtle', '--pr-color-surface-subtle'],
  ['--pr-color-text-muted', '--pr-color-primary-soft'],
  ['--pr-color-primary-contrast', '--pr-color-primary'],
  ['--pr-color-primary-contrast-accent', '--pr-color-primary'],
  ['--pr-color-success', '--pr-color-success-soft'],
  ['--pr-color-danger', '--pr-color-danger-soft'],
  ['--pr-color-info', '--pr-color-info-soft'],
  ['--pr-neutral-0', '--pr-color-danger-solid'],
  ['--pr-neutral-0', '--pr-color-danger-solid-hover'],
  ['--pr-color-warning', '--pr-color-warning-soft'],
  // The active tab, compact links, a badge.
  ['--pr-color-primary', '--pr-color-surface'],
  ['--pr-color-primary', '--pr-color-primary-soft'],
  // Error messages under the fields.
  ['--pr-color-danger', '--pr-color-surface'],
  // Primary buttons, hovered and pressed.
  ['--pr-color-primary-contrast', '--pr-color-primary-hover'],
  ['--pr-color-primary-contrast', '--pr-color-primary-active'],
  // The navbar.
  ['--pr-color-navbar-text', '--pr-color-navbar'],
]

const NON_TEXT: Array<[string, string]> = [
  ['--pr-color-border-strong', '--pr-color-surface'],
  ['--pr-color-border-strong', '--pr-color-background'],
  // Hovering a field must not lower the contrast of its border.
  ['--pr-color-border-hover', '--pr-color-surface'],
  ['--pr-color-focus', '--pr-color-surface'],
  ['--pr-color-focus', '--pr-color-background'],
  ['--pr-color-focus', '--pr-color-surface-subtle'],
  // Checked boxes, the progress and slider fill.
  ['--pr-color-primary', '--pr-color-surface'],
  ['--pr-color-primary', '--pr-color-surface-subtle'],
  // The switch thumb when off, on its track.
  ['--pr-color-text-muted', '--pr-color-surface-subtle'],
  // The active sidebar entry: its box against the sidebar and the inactive boxes, its icon on it.
  ['--pr-color-sidebar-active', '--pr-color-background'],
  ['--pr-color-sidebar-active', '--pr-color-surface-subtle'],
  ['--pr-color-sidebar-active-contrast', '--pr-color-sidebar-active'],
]

// Focus rings on the dark navbar use a light blue of their own (PrNavbar).
const NAVBAR_FOCUS = '--pr-blue-200'

describe.each([
  ['light', light],
  ['dark', dark],
])('%s theme contrast', (_name, theme) => {
  it.each(TEXT)('%s on %s reaches 4.5:1', (foreground, background) => {
    expect(contrast(theme, foreground, background)).toBeGreaterThanOrEqual(4.5)
  })

  it.each(NON_TEXT)('%s on %s reaches 3:1', (foreground, background) => {
    expect(contrast(theme, foreground, background)).toBeGreaterThanOrEqual(3)
  })

  it('navbar focus ring reaches 3:1 on the navbar', () => {
    expect(contrast(theme, NAVBAR_FOCUS, '--pr-color-navbar')).toBeGreaterThanOrEqual(3)
  })
})

describe('dark theme blocks', () => {
  // The dark theme is written twice: for data-pr-theme="dark" and for the system preference
  // (@media prefers-color-scheme). A token changed in one only would make them drift apart.
  it('declare the same tokens with the same values', () => {
    const media = themesCss.slice(themesCss.indexOf('@media'))
    expect(declarations(media)).toEqual(dark)
  })
})
