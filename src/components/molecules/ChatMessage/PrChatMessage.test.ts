// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { PrChatMessage } from '.'

describe('PrChatMessage', () => {
  it('starts a message of the visitor with a hidden « Vous : » and shows its status', () => {
    const wrapper = mount(PrChatMessage, { props: { author: 'self', time: '14:32', status: 'Lu' }, slots: { default: () => 'Bonjour' } })

    expect(wrapper.element.tagName).toBe('LI')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['pr-chat-message--self', 'pr:items-end']))
    expect(wrapper.find('.pr-chat-message__bubble .pr-visually-hidden').text()).toBe('Vous :')
    expect(wrapper.find('.pr-chat-message__bubble').text()).toContain('Bonjour')
    expect(wrapper.find('.pr-chat-message__meta').text()).toBe('14:32 · Lu')
    expect(wrapper.find('.pr-chat-message__sender').exists()).toBe(false)
  })

  it('shows the sender above an other message, without a hidden prefix in the bubble', () => {
    const wrapper = mount(PrChatMessage, { props: { author: 'other', sender: 'OREMIS', status: 'Lu' }, slots: { default: () => 'Bonjour, je vous écoute.' } })

    expect(wrapper.find('.pr-chat-message__sender').text()).toBe('OREMIS :')
    expect(wrapper.find('.pr-chat-message__bubble .pr-visually-hidden').exists()).toBe(false)
    // The status only belongs to the visitor's own messages.
    expect(wrapper.find('.pr-chat-message__meta').exists()).toBe(false)
    expect(wrapper.classes()).toContain('pr:items-start')
  })

  it('reads « Message automatique : » before a system message, centered', () => {
    const wrapper = mount(PrChatMessage, { props: { author: 'system', sender: 'Ignoré' }, slots: { default: () => 'Un bénévole va vous répondre.' } })

    expect(wrapper.find('.pr-visually-hidden').text()).toBe('Message automatique :')
    expect(wrapper.find('.pr-chat-message__sender').exists()).toBe(false)
    expect(wrapper.classes()).toContain('pr:items-center')
  })
})
