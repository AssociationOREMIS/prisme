// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { PrPanel } from '.'

describe('PrPanel', () => {
  it('renders only the main content without an aside', () => {
    const wrapper = mount(PrPanel, { slots: { default: 'Articles' } })
    expect(wrapper.text()).toBe('Articles')
    expect(wrapper.find('aside').exists()).toBe(false)
  })

  it('renders the aside as a named complementary column', () => {
    const wrapper = mount(PrPanel, { props: { asideLabel: 'Agenda' }, slots: { default: 'Articles', aside: 'Rendez-vous' } })
    expect(wrapper.find('.pr-panel__main').text()).toBe('Articles')
    const aside = wrapper.find('aside')
    expect(aside.attributes('aria-label')).toBe('Agenda')
    expect(aside.text()).toBe('Rendez-vous')
  })

  it('takes another element for the aside', () => {
    const wrapper = mount(PrPanel, { props: { asideTag: 'div' }, slots: { aside: 'Rendez-vous' } })
    expect(wrapper.find('aside').exists()).toBe(false)
    expect(wrapper.find('div.pr-panel__aside').exists()).toBe(true)
  })
})
