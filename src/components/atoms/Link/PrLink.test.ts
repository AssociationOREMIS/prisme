// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { PrLink } from '.'

// A stand-in for vue-router's RouterLink in `custom` mode: it hands its slot the href, navigate
// and the active states, as the real one does.
const navigate = vi.fn((event: Event) => event.preventDefault())
const FakeRouterLink = defineComponent({
  props: { to: { type: [String, Object], required: true }, custom: Boolean },
  setup(props, { slots }) {
    return () => slots.default?.({
      href: `/#${typeof props.to === 'string' ? props.to : 'named'}`,
      navigate,
      isActive: props.to === '/adherer',
      isExactActive: false,
    })
  },
})

afterEach(() => {
  window.history.replaceState(null, '', '/')
  navigate.mockClear()
})

describe('PrLink', () => {
  it('is a plain link with an href, attributes on the <a>', () => {
    const wrapper = mount(PrLink, { props: { href: '/adherer' }, attrs: { class: 'x', target: '_blank' }, slots: { default: 'Adhérer' } })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes()).toMatchObject({ href: '/adherer', class: 'x', target: '_blank' })
    expect(wrapper.attributes('aria-current')).toBeUndefined()
  })

  it('works out the current page from the address, trailing slash or not, never / for every page', () => {
    window.history.replaceState(null, '', '/adherer/')
    const current = mount(PrLink, { props: { href: '/adherer', currentDetection: true } })
    expect(current.attributes('aria-current')).toBe('page')
    expect(current.attributes('data-current')).toBe('true')
    expect(mount(PrLink, { props: { href: '/', currentDetection: true } }).attributes('aria-current')).toBeUndefined()

    window.history.replaceState(null, '', '/adherer/paiement')
    expect(mount(PrLink, { props: { href: '/adherer', currentDetection: true } }).attributes('aria-current')).toBe('page')
    expect(mount(PrLink, { props: { href: '/adherer', currentDetection: true, exact: true } }).attributes('aria-current')).toBeUndefined()
  })

  it('takes `current` as given', () => {
    expect(mount(PrLink, { props: { href: '/a', current: true } }).attributes('aria-current')).toBe('page')
  })

  it('goes through the app\'s RouterLink with `to`, with its active state', async () => {
    const wrapper = mount(PrLink, {
      props: { to: '/adherer', currentDetection: true },
      global: { components: { RouterLink: FakeRouterLink } },
      slots: { default: 'Adhérer' },
    })
    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/#/adherer')
    expect(link.attributes('aria-current')).toBe('page')
    await link.trigger('click')
    expect(navigate).toHaveBeenCalledOnce()
  })

  it('falls back to an href when the app has no router', () => {
    const wrapper = mount(PrLink, { props: { to: '/adherer' } })
    expect(wrapper.find('a').attributes('href')).toBe('/adherer')
  })
})
