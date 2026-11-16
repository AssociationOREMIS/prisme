// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { PrHero } from '.'

describe('PrHero', () => {
  it('renders the title as h1, the description and a hidden pattern', () => {
    const wrapper = mount(PrHero, {
      props: { title: 'OREMIS DevOps', description: 'Les notes de l\'équipe.' },
      slots: { actions: '<a href="/notes">Lire</a>' },
    })
    expect(wrapper.find('h1').text()).toBe('OREMIS DevOps')
    expect(wrapper.find('.pr-hero__description').text()).toBe('Les notes de l\'équipe.')
    expect(wrapper.find('.pr-hero__actions a').exists()).toBe(true)
    const pattern = wrapper.find('.pr-hero__pattern')
    expect(pattern.attributes('aria-hidden')).toBe('true')
    expect(pattern.findAll('.pr-hero__square').length).toBeGreaterThan(0)
  })

  it('takes an h2 and drops the pattern', () => {
    const wrapper = mount(PrHero, { props: { title: 'Projets', headingLevel: 2, pattern: false } })
    expect(wrapper.find('h1').exists()).toBe(false)
    expect(wrapper.find('h2').text()).toBe('Projets')
    expect(wrapper.find('.pr-hero__pattern').exists()).toBe(false)
    expect(wrapper.find('.pr-hero__description').exists()).toBe(false)
  })
})
