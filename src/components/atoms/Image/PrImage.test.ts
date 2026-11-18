// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { PrImage } from '.'

describe('PrImage', () => {
  it('never grows wider than its column and keeps its room while loading', () => {
    const wrapper = mount(PrImage, { props: { src: '/a.svg', alt: '', width: 750, height: 750, maxWidth: '22rem', align: 'center' } })
    expect(wrapper.attributes()).toMatchObject({ alt: '', width: '750', height: '750', loading: 'lazy' })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['pr:max-w-full', 'pr:h-auto', 'pr:mx-auto']))
    expect(wrapper.attributes('style')).toContain('max-width: min(22rem, 100%)')
  })
})
