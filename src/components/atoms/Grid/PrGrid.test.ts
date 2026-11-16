// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { PrGrid } from '.'

describe('PrGrid', () => {
  it('fills columns of at least 18rem, never wider than its container', () => {
    const wrapper = mount(PrGrid)
    expect(wrapper.classes()).toContain('pr:grid-cols-[repeat(auto-fill,minmax(min(100%,var(--pr-grid-min)),1fr))]')
    expect(wrapper.classes()).toContain('pr:gap-[var(--pr-space-4)]')
    expect((wrapper.element as HTMLElement).style.getPropertyValue('--pr-grid-min')).toBe('18rem')
  })

  it('takes the narrowest column width, gap and element', () => {
    const wrapper = mount(PrGrid, { props: { min: '12rem', gap: 6, as: 'ul' } })
    expect(wrapper.element.tagName).toBe('UL')
    expect(wrapper.classes()).toContain('pr:gap-[var(--pr-space-6)]')
    expect((wrapper.element as HTMLElement).style.getPropertyValue('--pr-grid-min')).toBe('12rem')
  })
})
