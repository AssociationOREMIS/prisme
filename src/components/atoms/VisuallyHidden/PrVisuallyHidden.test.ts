// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { PrVisuallyHidden } from '.'

describe('PrVisuallyHidden', () => {
  it('renders its content in a span hidden with sr-only', () => {
    const wrapper = mount(PrVisuallyHidden, { slots: { default: () => 'Vous :' } })

    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.text()).toBe('Vous :')
    expect(wrapper.classes()).toContain('pr:sr-only')
    expect(wrapper.classes()).not.toContain('pr:focus:not-sr-only')
  })

  it('takes another element and shows itself again on focus when focusable', () => {
    const wrapper = mount(PrVisuallyHidden, { props: { as: 'div', focusable: true } })

    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['pr:sr-only', 'pr:focus:not-sr-only', 'pr:focus-within:not-sr-only']))
  })
})
