// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { PrSplit } from '.'

describe('PrSplit', () => {
  it('keeps the text first in the DOM, reverse only swapping the columns visually', () => {
    const wrapper = mount(PrSplit, { props: { reverse: true }, slots: { default: '<p>Texte</p>', media: '<img alt="">' } })
    const [first, second] = wrapper.element.children
    expect(first.classList.contains('pr-split__content')).toBe(true)
    expect(first.className).toContain('pr:min-[900px]:order-2')
    expect(second.classList.contains('pr-split__media')).toBe(true)
    expect(wrapper.classes()).toContain('pr:grid-cols-1')
  })

  it('has no media column without media', () => {
    expect(mount(PrSplit, { slots: { default: 'Texte' } }).find('.pr-split__media').exists()).toBe(false)
  })
})
