// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { PrAvatar } from '.'
import { PrNavbarUserMenu } from '../../layouts/Navbar'

describe('PrAvatar', () => {
  it('shows the picture, decorative by default, at the requested size', () => {
    const wrapper = mount(PrAvatar, { props: { src: '/avatar.jpg', size: 40 } })
    const img = wrapper.find('img')

    expect(img.attributes('src')).toBe('/avatar.jpg')
    expect(img.attributes('alt')).toBe('')
    expect(wrapper.attributes('style')).toContain('width: 40px')
  })

  it('falls back to the person icon without a picture or when it fails to load', async () => {
    expect(mount(PrAvatar, { props: { src: null } }).find('img').exists()).toBe(false)

    const wrapper = mount(PrAvatar, { props: { src: '/broken.jpg' } })
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('svg').exists()).toBe(true)

    await wrapper.setProps({ src: '/other.jpg' })
    expect(wrapper.find('img').attributes('src')).toBe('/other.jpg')
  })

  it('is used by the navbar user menu for the avatar url', () => {
    const wrapper = mount(PrNavbarUserMenu, { props: { name: 'Camille MARTIN', avatarUrl: '/camille.png' } })

    expect(wrapper.find('img').attributes('src')).toBe('/camille.png')
  })
})
