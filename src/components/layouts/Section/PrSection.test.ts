// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { PrSection } from '.'

describe('PrSection', () => {
  it('is a named region holding a container of the asked width', () => {
    const wrapper = mount(PrSection, { props: { label: 'Nos engagements', width: 'narrow' }, slots: { default: '<p>Texte</p>' } })
    expect(wrapper.element.tagName).toBe('SECTION')
    expect(wrapper.attributes('aria-label')).toBe('Nos engagements')
    expect(wrapper.find('.pr-container').classes()).toContain('pr:max-w-[48rem]')
    expect(wrapper.attributes('data-pr-theme')).toBeUndefined()
  })

  it('puts an image under a veil and its content in the dark theme, with the page\'s brand', async () => {
    const host = document.createElement('div')
    host.dataset.prBrand = 'charte'
    document.body.append(host)
    const wrapper = mount(PrSection, { props: { background: '/bg.svg', overlay: 60, parallax: true }, attachTo: host })
    await nextTick()
    expect(wrapper.attributes('data-pr-theme')).toBe('dark')
    expect(wrapper.attributes('data-pr-brand')).toBe('charte')
    expect(wrapper.attributes('style')).toContain('--pr-section-image: url("/bg.svg")')
    expect(wrapper.attributes('style')).toContain('--pr-section-overlay: 60%')
    expect(wrapper.classes()).toContain('pr-section--parallax')
    wrapper.unmount()
    host.remove()
  })

  it('starts under the floating navbar', () => {
    const wrapper = mount(PrSection, { props: { underNavbar: true } })
    expect(wrapper.classes()).toContain('pr-section--under-navbar')
  })
})
