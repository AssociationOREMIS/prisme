// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { MessageCircle, X } from '@lucide/vue'
import { h } from 'vue'
import { PrFab } from '.'

describe('PrFab', () => {
  it('is a named button that emits click, without aria-expanded by default', async () => {
    const wrapper = mount(PrFab, { props: { icon: MessageCircle, label: 'Discuter' } })
    const button = wrapper.find('button')

    expect(button.attributes('aria-label')).toBe('Discuter')
    expect(button.attributes('type')).toBe('button')
    expect(button.attributes('aria-expanded')).toBeUndefined()
    await button.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('says whether its panel is open and swaps its icon', async () => {
    const wrapper = mount(PrFab, { props: { icon: MessageCircle, iconExpanded: X, label: 'Discuter', expanded: false } })

    expect(wrapper.find('button').attributes('aria-expanded')).toBe('false')
    expect(wrapper.findComponent(MessageCircle).exists()).toBe(true)

    await wrapper.setProps({ expanded: true })
    expect(wrapper.find('button').attributes('aria-expanded')).toBe('true')
    expect(wrapper.findComponent(X).exists()).toBe(true)
  })

  it('renders the panel above the button, on its side, and sends the attributes to the button', () => {
    const wrapper = mount(PrFab, {
      props: { icon: MessageCircle, label: 'Discuter', position: 'bottom-left', offset: '2rem' },
      attrs: { 'aria-controls': 'chat' },
      slots: { default: () => h('section', { id: 'chat' }, 'Fenêtre') },
    })

    expect(wrapper.element.firstElementChild?.classList.contains('pr-fab__panel')).toBe(true)
    expect(wrapper.find('#chat').exists()).toBe(true)
    expect(wrapper.classes()).toContain('pr:items-start')
    expect((wrapper.element as HTMLElement).style.getPropertyValue('--pr-fab-offset')).toBe('2rem')
    expect(wrapper.find('button').attributes('aria-controls')).toBe('chat')
  })

  it('has no panel without a slot', () => {
    const wrapper = mount(PrFab, { props: { icon: MessageCircle, label: 'Discuter' } })

    expect(wrapper.find('.pr-fab__panel').exists()).toBe(false)
    expect(wrapper.classes()).toContain('pr:items-end')
  })
})
