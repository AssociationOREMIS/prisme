// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PrSidebar, PrSidebarSection } from '.'

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

describe('PrSidebarSection', () => {
  function mountSections() {
    const Page = defineComponent({
      components: { PrSidebar, PrSidebarSection },
      template: `
        <PrSidebar>
          <PrSidebarSection label="Chat"><a href="/conversations">Conversations</a></PrSidebarSection>
          <PrSidebarSection label="Administration"><a href="/journal">Journal</a></PrSidebarSection>
        </PrSidebar>
      `,
    })
    return mount(Page, { attachTo: document.body })
  }

  it('names the group of entries with its label', () => {
    const wrapper = mountSections()
    const group = wrapper.findAll('[role="group"]')[1]

    const label = document.getElementById(group.attributes('aria-labelledby')!)

    expect(label?.textContent?.trim()).toBe('Administration')
  })

  it('shows a line instead of the label in the phone rail, and the label once opened', async () => {
    const wrapper = mountSections()
    expect(wrapper.find('.pr-sidebar-section__divider').exists()).toBe(true)
    expect(wrapper.find('.pr-sidebar-section__label').classes()).toContain('pr:sr-only')

    await wrapper.find('.pr-sidebar__collapse').trigger('click')

    expect(wrapper.find('.pr-sidebar-section__divider').exists()).toBe(false)
    expect(wrapper.find('.pr-sidebar-section__label').classes()).not.toContain('pr:sr-only')
  })
})
