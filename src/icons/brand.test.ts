// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import * as brand from './brand'

const icons = Object.entries(brand)

describe('brand icons', () => {
  it('exports the seven networks', () => {
    expect(icons.map(([name]) => name).sort()).toEqual([
      'PrIconDiscord', 'PrIconFacebook', 'PrIconInstagram', 'PrIconLinkedin', 'PrIconTiktok', 'PrIconX', 'PrIconYoutube',
    ])
  })

  it.each(icons)('%s renders a decorative 24px svg in currentColor', (_name, icon) => {
    const svg = mount(icon).find('svg')
    expect(svg.attributes()).toMatchObject({ width: '24', height: '24', viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': 'true' })
    expect(svg.find('path').attributes('d')).toMatch(/^M/)
  })

  it.each(icons)('%s takes a size and the attributes of its parent', (_name, icon) => {
    const svg = mount(icon, { props: { size: 18 }, attrs: { class: 'pr-button__icon' } }).find('svg')
    expect(svg.attributes('width')).toBe('18')
    expect(svg.attributes('height')).toBe('18')
    expect(svg.classes()).toContain('pr-button__icon')
  })
})
