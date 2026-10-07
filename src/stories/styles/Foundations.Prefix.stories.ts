import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect } from 'storybook/test'
import '../stories.css'

// prefix-classes: ignore (the class names below are the ones Prisme must not define).
// Prisme's Tailwind classes are prefixed (`pr:flex`): it defines no `.hidden`, `.flex`, `.top-0`...
// that would override an app's classes of the same name (`hidden md:flex`), or lose to them.
const meta = {
  title: 'Foundations/Prefix',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function selectorsOf(rules: CSSRuleList, found: string[] = []): string[] {
  for (const rule of Array.from(rules)) {
    if (rule instanceof CSSStyleRule) found.push(rule.selectorText)
    if ('cssRules' in rule && (rule as CSSGroupingRule).cssRules) selectorsOf((rule as CSSGroupingRule).cssRules, found)
  }
  return found
}

// noinspection JSUnusedGlobalSymbols
export const NoUnprefixedUtilities: Story = {
  render: () => ({ template: '<p>Aucune classe Tailwind sans prefixe dans les styles de Prisme.</p>' }),
  play: async () => {
    const selectors = Array.from(document.styleSheets).flatMap((sheet) => {
      try {
        return selectorsOf(sheet.cssRules)
      } catch {
        return []
      }
    })
    await expect(selectors.some(selector => selector.includes('.pr\\:flex'))).toBe(true)
    for (const name of ['hidden', 'flex', 'grid', 'block', 'top-0', 'w-full', 'flex-col']) {
      await expect(selectors.filter(selector => new RegExp(`\\.${name}(?![\\w-])`).test(selector.replace(/\.pr\\:[^\s,.:]+/g, '')))).toEqual([])
    }
  },
}
