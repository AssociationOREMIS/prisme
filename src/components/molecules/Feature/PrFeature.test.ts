// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'
import { PrFeature } from '.'

const Icon = defineComponent({ props: { size: { type: Number, default: 24 } }, setup: props => () => h('svg', { 'data-size': props.size }) })

describe('PrFeature', () => {
  it('renders the icon, a paragraph title and the description', () => {
    const wrapper = mount(PrFeature, { props: { icon: Icon, title: 'Accompagner', description: 'Les élèves en situation de handicap.' } })
    expect(wrapper.find('.pr-feature__icon').attributes('aria-hidden')).toBe('true')
    expect(wrapper.find('svg').attributes('data-size')).toBe('22')
    expect(wrapper.find('p.pr-feature__title').text()).toBe('Accompagner')
    expect(wrapper.find('.pr-feature__description').text()).toBe('Les élèves en situation de handicap.')
    expect(wrapper.classes()).toContain('pr-feature--surface')
  })

  it('makes the title a heading and drops the icon badge without icon', () => {
    const wrapper = mount(PrFeature, { props: { title: 'Prévenir', headingLevel: 3, tone: 'plain', as: 'li' } })
    expect(wrapper.element.tagName).toBe('LI')
    expect(wrapper.find('h3').text()).toBe('Prévenir')
    expect(wrapper.find('.pr-feature__icon').exists()).toBe(false)
    expect(wrapper.classes()).not.toContain('pr:border')
  })
})
