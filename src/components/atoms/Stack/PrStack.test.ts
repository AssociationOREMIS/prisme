// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { PrStack } from '.'

describe('PrStack', () => {
  it('stacks vertically with the default gap', () => {
    const wrapper = mount(PrStack)
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['pr:flex', 'pr:flex-col', 'pr:gap-[var(--pr-space-4)]']))
    expect(wrapper.classes()).not.toContain('pr:flex-wrap')
  })

  it('maps direction, gap, alignment, wrapping and element', () => {
    const wrapper = mount(PrStack, { props: { direction: 'horizontal', gap: 8, align: 'center', justify: 'between', wrap: true, as: 'ul' } })
    expect(wrapper.element.tagName).toBe('UL')
    expect(wrapper.classes()).toEqual(expect.arrayContaining([
      'pr:flex-row',
      'pr:gap-[var(--pr-space-8)]',
      'pr:items-center',
      'pr:justify-between',
      'pr:flex-wrap',
    ]))
  })
})
