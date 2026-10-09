// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PrSidebar } from '.'

beforeEach(() => {
  // A phone: the sidebar is a rail that opens as a flyout over the page.
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: true, media: query, addEventListener() {}, removeEventListener() {} }))
})

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

function mountPage() {
  const Page = defineComponent({
    components: { PrSidebar },
    template: '<div><PrSidebar><a href="/benevoles">Bénévoles</a></PrSidebar><button id="outside">Contenu</button></div>',
  })
  const wrapper = mount(Page, { attachTo: document.body })
  const aside = () => wrapper.find('aside').attributes('data-mobile-expanded')
  return { wrapper, aside }
}

describe('PrSidebar mobile flyout', () => {
  it('closes when the focus leaves it', async () => {
    const { wrapper, aside } = mountPage()
    await wrapper.find('.pr-sidebar__collapse').trigger('click')
    expect(aside()).toBe('true')

    await wrapper.find('aside').trigger('focusout', { relatedTarget: wrapper.find('#outside').element })

    expect(aside()).toBe('false')
  })

  it('stays open while the focus moves inside it', async () => {
    const { wrapper, aside } = mountPage()
    await wrapper.find('.pr-sidebar__collapse').trigger('click')

    await wrapper.find('aside').trigger('focusout', { relatedTarget: wrapper.find('a').element })

    expect(aside()).toBe('true')
  })

  it('closes with Escape', async () => {
    const { wrapper, aside } = mountPage()
    await wrapper.find('.pr-sidebar__collapse').trigger('click')

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wrapper.vm.$nextTick()

    expect(aside()).toBe('false')
  })
})
