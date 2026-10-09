// @vitest-environment jsdom
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { getPrSkeletonStyles, PR_SKELETON_COLORS, prSkeletonFor } from './skeleton'

const stylesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'styles')
const read = (file: string) => fs.readFileSync(path.join(stylesDir, file), 'utf8')

function declarations(css: string): Record<string, string> {
  return Object.fromEntries([...css.matchAll(/(--pr-[\w-]+)\s*:\s*([^;]+);/g)].map(([, name, value]) => [name, value.trim()]))
}

const palette = declarations(read('tokens.css'))
const themesCss = read('themes.css')
const themes = {
  light: declarations(themesCss.slice(0, themesCss.indexOf('[data-pr-theme="dark"],'))),
  dark: declarations(themesCss.slice(themesCss.indexOf('[data-pr-theme="dark"],'), themesCss.indexOf('@media'))),
}

function tokenValue(theme: Record<string, string>, token: string): string {
  let value = theme[token] ?? palette[token]
  while (value?.startsWith('var(')) {
    const name = value.slice(4, -1).trim()
    value = theme[name] ?? palette[name]
  }
  return value.toLowerCase()
}

const TOKENS = {
  navbar: '--pr-color-navbar',
  background: '--pr-color-background',
  border: '--pr-color-border',
  base: '--pr-color-skeleton',
  shine: '--pr-color-skeleton-shine',
} as const

describe('getPrSkeletonStyles', () => {
  it.each(['light', 'dark'] as const)('writes out the %s theme tokens', (theme) => {
    const expected = Object.fromEntries(Object.entries(TOKENS).map(([key, token]) => [key, tokenValue(themes[theme], token)]))

    expect(PR_SKELETON_COLORS[theme]).toEqual(expected)
  })

  it('makes the shine visible on the base, in both themes', () => {
    expect(PR_SKELETON_COLORS.light.shine).not.toBe(PR_SKELETON_COLORS.light.base)
    expect(PR_SKELETON_COLORS.dark.shine).not.toBe(PR_SKELETON_COLORS.dark.base)
  })

  it('stops the animation for people who reduce motion', () => {
    expect(getPrSkeletonStyles()).toContain('@media (prefers-reduced-motion: reduce) { .pr-sk { animation: none; } }')
  })
})

describe('prSkeletonFor', () => {
  it('draws a labelled field for a select', () => {
    const wrapper = mount(prSkeletonFor('PrSelect')!)

    expect(wrapper.findAll('.pr-sk').map(bone => bone.classes())).toEqual([['pr-sk', 'pr-sk--label'], ['pr-sk', 'pr-sk--field']])
    expect(wrapper.find('[aria-hidden="true"]').exists()).toBe(true)
  })

  it('leaves components without a usual shape empty', () => {
    expect(prSkeletonFor('PrToast')).toBeUndefined()
  })
})
