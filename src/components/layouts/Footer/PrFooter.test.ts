// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PrFooter } from '.'
import { PrIconDiscord } from '../../../icons/brand'
import { setPrTheme } from '../../../composables/usePrTheme'

beforeEach(() => {
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} }))
})

afterEach(() => {
  setPrTheme('light')
  vi.unstubAllGlobals()
})

const columns = [
  { title: 'Association', links: [{ label: 'Nos missions', href: '/missions' }] },
  { title: 'Ressources', links: [{ label: 'Guides', href: '/guides' }, { label: 'FAQ', href: '/faq' }] },
]

describe('PrFooter', () => {
  it('is a contentinfo footer with one named navigation per column', () => {
    const wrapper = mount(PrFooter, { props: { siteName: 'OREMIS DevOps', homeHref: '/', columns } })
    expect(wrapper.element.tagName).toBe('FOOTER')
    expect(wrapper.find('.pr-footer__grid').attributes('style')).toContain('--pr-footer-columns: 2')

    const navs = wrapper.findAll('nav.pr-footer__column')
    expect(navs).toHaveLength(2)
    for (const [index, nav] of navs.entries()) {
      const title = wrapper.find(`[id="${nav.attributes('aria-labelledby')}"]`)
      expect(title.text()).toBe(columns[index].title)
    }
    expect(navs[1].findAll('a').map(a => a.attributes('href'))).toEqual(['/guides', '/faq'])

    const home = wrapper.find('a.pr-footer__home')
    expect(home.attributes('href')).toBe('/')
    expect(home.find('img').attributes('alt')).toBe('OREMIS')
    expect(home.text()).toContain('OREMIS DevOps')
  })

  it('keeps four columns at most', () => {
    const many = Array.from({ length: 6 }, (_, index) => ({ title: `Colonne ${index}`, links: [] }))
    expect(mount(PrFooter, { props: { columns: many } }).findAll('nav.pr-footer__column')).toHaveLength(4)
  })

  it('renders the socials, the legal navigation and the copyright', () => {
    const wrapper = mount(PrFooter, {
      props: {
        socials: [{ label: 'Discord', href: 'https://discord.example', icon: PrIconDiscord }],
        legalLinks: [{ label: 'Mentions légales', href: '/mentions-legales' }],
      },
    })
    expect(wrapper.find('ul.pr-footer__socials').attributes('aria-label')).toBe('Réseaux sociaux')
    const social = wrapper.find('.pr-footer__socials a')
    expect(social.attributes('href')).toBe('https://discord.example')
    expect(social.attributes('aria-label')).toBe('Discord')
    expect(social.find('svg').exists()).toBe(true)

    const legal = wrapper.find('nav.pr-footer__legal')
    expect(legal.attributes('aria-label')).toBe('Informations légales')
    expect(legal.find('a').text()).toBe('Mentions légales')
    expect(wrapper.find('.pr-footer__copyright').text()).toBe(`© ${new Date().getFullYear()} Association OREMIS`)
    expect(wrapper.find('a.pr-footer__home').exists()).toBe(false)
  })

  it('switches to the white logo in the dark theme', async () => {
    const wrapper = mount(PrFooter)
    expect(wrapper.find('img').attributes('src')).toBe('https://static.oremis.fr/img/logos/oremis-logo.svg')
    setPrTheme('dark')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('img').attributes('src')).toBe('https://static.oremis.fr/img/logos/oremis-logo-white.svg')
  })
})
