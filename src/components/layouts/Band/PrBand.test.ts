// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { PrBand } from '.'

describe('PrBand', () => {
  it('is a section named by its label, with the primary tone', () => {
    const wrapper = mount(PrBand, { props: { label: 'Nous rejoindre' }, slots: { default: 'Texte' } })
    expect(wrapper.element.tagName).toBe('SECTION')
    expect(wrapper.attributes('aria-label')).toBe('Nous rejoindre')
    expect(wrapper.classes()).toContain('pr:bg-[var(--pr-color-primary-soft)]')
    expect(wrapper.find('.pr-band__layout').exists()).toBe(false)
  })

  it('drops the label on another element and lays out the aside', () => {
    const wrapper = mount(PrBand, {
      props: { as: 'div', label: 'Ignoré', tone: 'surface' },
      slots: { default: 'Texte', aside: 'À côté' },
    })
    expect(wrapper.attributes('aria-label')).toBeUndefined()
    expect(wrapper.classes()).toContain('pr:bg-[var(--pr-color-surface)]')
    expect(wrapper.find('.pr-band__main').text()).toBe('Texte')
    expect(wrapper.find('.pr-band__aside').text()).toBe('À côté')
  })
})
