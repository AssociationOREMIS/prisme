// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { PrStatusDot } from '.'

describe('PrStatusDot', () => {
  it('hides the dot from screen readers and shows the label', () => {
    const wrapper = mount(PrStatusDot, { props: { variant: 'success', label: 'Un bénévole vous répond' } })

    expect(wrapper.find('.pr-status-dot__dot').attributes('aria-hidden')).toBe('true')
    expect(wrapper.find('.pr-status-dot__dot').classes()).toContain('pr:bg-[var(--pr-color-success)]')
    expect(wrapper.find('.pr-status-dot__label').text()).toBe('Un bénévole vous répond')
    expect(wrapper.attributes('data-variant')).toBe('success')
  })

  it('is neutral by default, without a label nor a halo', () => {
    const wrapper = mount(PrStatusDot)

    expect(wrapper.find('.pr-status-dot__dot').classes()).toContain('pr:bg-[var(--pr-color-text-subtle)]')
    expect(wrapper.find('.pr-status-dot__label').exists()).toBe(false)
    expect(wrapper.find('.pr-status-dot__halo').exists()).toBe(false)
  })

  it('pulses on demand, never with reduced motion', () => {
    const wrapper = mount(PrStatusDot, { props: { pulse: true } })
    const halo = wrapper.find('.pr-status-dot__halo')

    expect(halo.classes()).toEqual(expect.arrayContaining(['pr:animate-ping', 'pr:motion-reduce:hidden']))
  })

  it('takes the label from its slot', () => {
    const wrapper = mount(PrStatusDot, { slots: { default: () => 'Hors ligne' } })

    expect(wrapper.find('.pr-status-dot__label').text()).toBe('Hors ligne')
  })
})
