// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { PrContainer } from '.'

describe('PrContainer', () => {
  it('spans the whole width by default, with gutters', () => {
    const wrapper = mount(PrContainer, { slots: { default: 'Contenu' } })
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.classes()).toContain('pr:px-[var(--pr-space-10)]')
    expect(wrapper.classes()).not.toContain('pr:mx-auto')
    expect(wrapper.text()).toBe('Contenu')
  })

  it.each([
    ['wide', 'pr:max-w-[80rem]'],
    ['narrow', 'pr:max-w-[48rem]'],
  ] as const)('centers a %s container', (width, maxWidth) => {
    const wrapper = mount(PrContainer, { props: { width, as: 'main' } })
    expect(wrapper.element.tagName).toBe('MAIN')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['pr:mx-auto', maxWidth]))
  })
})
