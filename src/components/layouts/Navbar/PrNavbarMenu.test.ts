// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { PrNavbar, PrNavbarMenu } from '.'
import { PrNavigationMenu } from '../../molecules/NavigationMenu'

const items = [{ label: 'Accueil', href: '/' }, { label: 'Adhérer', href: '/adherer' }]

beforeEach(() => {
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} }))
})

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

describe('PrNavbarMenu', () => {
  it('opens a panel named like its button, with a named close button', async () => {
    const wrapper = mount(PrNavbarMenu, { attachTo: document.body, slots: { default: '<p>Contenu</p>' } })
    const button = wrapper.find('button')
    expect(button.attributes('aria-label')).toBe('Menu')
    expect(button.attributes('aria-haspopup')).toBe('dialog')
    await button.trigger('click')
    await nextTick()
    const dialog = document.querySelector('[role="dialog"]')
    expect(dialog?.textContent).toContain('Menu')
    expect(dialog?.querySelector('[aria-label="Fermer le menu"]')).not.toBeNull()
    wrapper.unmount()
  })

  it('lays a PrNavigationMenu out vertically and closes when a link is followed', async () => {
    const wrapper = mount({
      components: { PrNavbarMenu, PrNavigationMenu },
      data: () => ({ items, open: true }),
      template: '<PrNavbarMenu v-model:open="open"><PrNavigationMenu :items="items" /></PrNavbarMenu>',
    }, { attachTo: document.body })
    await nextTick()
    const nav = document.querySelector('[role="dialog"] nav')
    expect(nav?.classList.contains('pr-navigation-menu--vertical')).toBe(true)
    nav?.querySelector<HTMLAnchorElement>('a[href="/adherer"]')?.addEventListener('click', event => event.preventDefault())
    nav?.querySelector<HTMLAnchorElement>('a[href="/adherer"]')?.click()
    await nextTick()
    expect((wrapper.vm as unknown as { open: boolean }).open).toBe(false)
    wrapper.unmount()
  })
})

describe('PrNavbar floating', () => {
  it('adds the mobile menu when it has a navigation, not with mobile-menu off or on the app bar', () => {
    const slots = { nav: '<nav>liens</nav>', user: '<button>Thème</button>' }
    expect(mount(PrNavbar, { props: { variant: 'floating' }, slots }).find('.pr-navbar__menu').exists()).toBe(true)
    expect(mount(PrNavbar, { props: { variant: 'floating', mobileMenu: false }, slots }).find('.pr-navbar__menu').exists()).toBe(false)
    expect(mount(PrNavbar, { slots }).find('.pr-navbar__menu').exists()).toBe(false)
  })

  it('centers on the width of a container and flags the scroll', async () => {
    const wrapper = mount(PrNavbar, { props: { variant: 'floating', width: 'wide' }, attachTo: document.body })
    const inner = wrapper.find('.pr-navbar__inner')
    expect(inner.classes()).toContain('pr:max-w-[80rem]')
    expect(inner.attributes('data-scrolled')).toBe('false')
    Object.defineProperty(window, 'scrollY', { value: 200, configurable: true })
    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(inner.attributes('data-scrolled')).toBe('true')
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
    wrapper.unmount()
  })
})
