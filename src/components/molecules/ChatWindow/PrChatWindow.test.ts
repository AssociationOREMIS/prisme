// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PrChatWindow from './PrChatWindow.vue'

describe('PrChatWindow', () => {
  it('is a region named by its title, with the status and the slots', () => {
    const wrapper = mount(PrChatWindow, {
      props: { title: 'OREMIS', status: 'Un bénévole vous répond' },
      slots: { default: '<ol class="thread"></ol>', footer: '<form class="composer"></form>', actions: '<button>Terminer</button>' },
    })
    const region = wrapper.get('section')
    const title = wrapper.get('h2')
    expect(region.attributes('aria-labelledby')).toBe(title.attributes('id'))
    expect(title.text()).toBe('OREMIS')
    expect(wrapper.text()).toContain('Un bénévole vous répond')
    expect(wrapper.find('.thread').exists()).toBe(true)
    expect(wrapper.find('.composer').exists()).toBe(true)
    expect(wrapper.get('.pr-chat-window__actions button').text()).toBe('Terminer')
  })

  it('takes the heading level and hides the decorative avatar', () => {
    const wrapper = mount(PrChatWindow, { props: { headingLevel: 3 } })
    expect(wrapper.find('h3').exists()).toBe(true)
    expect(wrapper.get('.pr-chat-window__avatar').attributes('aria-hidden')).toBe('true')
    expect(wrapper.text()).not.toContain('bénévole')
  })
})
