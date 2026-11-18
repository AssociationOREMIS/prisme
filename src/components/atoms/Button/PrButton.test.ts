// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { PrButton } from '.'

const FakeRouterLink = defineComponent({
  props: { to: { type: [String, Object], required: true }, custom: Boolean },
  setup(props, { slots }) {
    return () => slots.default?.({ href: `/#${String(props.to)}`, navigate: () => {}, isActive: false, isExactActive: false })
  },
})

describe('PrButton', () => {
  it('is a router link with `to`, a plain link without a router', () => {
    const routed = mount(PrButton, { props: { to: '/adherer' }, slots: { default: 'Adhérer' }, global: { components: { RouterLink: FakeRouterLink } } })
    expect(routed.find('a').attributes('href')).toBe('/#/adherer')
    expect(routed.find('a').classes()).toContain('pr-button')
    expect(mount(PrButton, { props: { to: '/adherer' }, slots: { default: 'Adhérer' } }).find('a').attributes('href')).toBe('/adherer')
  })

  it('drops the address of a disabled link', () => {
    const link = mount(PrButton, { props: { href: '/adherer', disabled: true }, slots: { default: 'Adhérer' } }).find('a')
    expect(link.attributes('href')).toBeUndefined()
    expect(link.attributes('aria-disabled')).toBe('true')
    expect(link.attributes('role')).toBe('link')
  })

  it('draws the call to action, with a halo on demand', () => {
    const cta = mount(PrButton, { props: { variant: 'cta', size: 'lg', pulse: true, href: '/adherer' }, slots: { default: 'Adhérer à OREMIS' } }).find('a')
    expect(cta.classes()).toEqual(expect.arrayContaining(['pr-button--cta', 'pr-button--pulse', 'pr:uppercase']))
    expect(mount(PrButton, { props: { variant: 'cta' }, slots: { default: 'A' } }).classes()).not.toContain('pr-button--pulse')
  })
})
