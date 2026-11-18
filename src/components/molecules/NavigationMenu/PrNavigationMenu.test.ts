// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { PrNavigationMenu } from '.'
import { providePrNavigationOrientation } from './context'

const items = [
  { label: 'Accueil', href: '/' },
  { label: 'Adhérer', href: '/adherer/' },
]

afterEach(() => window.history.replaceState(null, '', '/'))

describe('PrNavigationMenu', () => {
  it('marks the current page only, the home link not on a sub-page', () => {
    window.history.replaceState(null, '', '/adherer')
    const links = mount(PrNavigationMenu, { props: { items } }).findAll('a')
    expect(links.map(link => link.attributes('aria-current'))).toEqual([undefined, 'page'])
  })

  it('keeps an explicit `active`', () => {
    const links = mount(PrNavigationMenu, { props: { items: [{ ...items[0], active: false }, { ...items[1], active: true }] } }).findAll('a')
    expect(links[1].attributes('aria-current')).toBe('page')
  })

  it('lays links out vertically when asked, or inside a mobile menu', () => {
    const vertical = mount(PrNavigationMenu, { props: { items, orientation: 'vertical' } })
    expect(vertical.classes()).toContain('pr-navigation-menu--vertical')

    const Host = defineComponent({
      setup() {
        providePrNavigationOrientation('vertical')
        return () => h(PrNavigationMenu, { items })
      },
    })
    expect(mount(Host).find('nav').classes()).toContain('pr-navigation-menu--vertical')
    expect(mount(PrNavigationMenu, { props: { items } }).classes()).toContain('pr-navigation-menu--horizontal')
  })
})
