// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { PrTypingIndicator } from '.'

describe('PrTypingIndicator', () => {
  it('is a list row that says OREMIS writes, with three hidden dots', () => {
    const wrapper = mount(PrTypingIndicator)

    expect(wrapper.element.tagName).toBe('LI')
    expect(wrapper.find('.pr-visually-hidden').text()).toBe('OREMIS écrit')
    const dots = wrapper.findAll('.pr-typing-indicator__dot')
    expect(dots).toHaveLength(3)
    expect(dots.every(dot => dot.attributes('aria-hidden') === 'true' && dot.classes().includes('pr:motion-reduce:animate-none'))).toBe(true)
  })

  it('takes a name and another element', () => {
    const wrapper = mount(PrTypingIndicator, { props: { name: 'Alex DURAND', as: 'div' } })

    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.text()).toBe('Alex DURAND écrit')
  })
})
