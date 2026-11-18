// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { PrEmbed } from '.'

const src = 'https://www.helloasso.com/associations/oremis/adhesions/2026/widget'

describe('PrEmbed', () => {
  it('shows a named frame of the asked height', () => {
    const frame = mount(PrEmbed, { props: { src, title: "Formulaire d'adhésion", height: '48rem' } }).find('iframe')
    expect(frame.attributes()).toMatchObject({ src, title: "Formulaire d'adhésion", loading: 'lazy' })
    expect(frame.attributes('style')).toContain('height: 48rem')
  })

  it('asks before loading the service, then loads it', async () => {
    const wrapper = mount(PrEmbed, { props: { src, title: 'Formulaire', provider: 'HelloAsso', consent: true, externalLink: true } })
    expect(wrapper.find('iframe').exists()).toBe(false)
    expect(wrapper.text()).toContain('Contenu proposé par HelloAsso')
    expect(wrapper.find('a.pr-embed__external').attributes('href')).toBe(src)
    await wrapper.find('.pr-embed__consent button').trigger('click')
    expect(wrapper.find('iframe').attributes('src')).toBe(src)
  })

  it('names the service after the address when no provider is given', () => {
    expect(mount(PrEmbed, { props: { src, title: 'F', consent: true } }).text()).toContain('www.helloasso.com')
  })
})
