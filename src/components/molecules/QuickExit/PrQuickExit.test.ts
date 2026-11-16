// @vitest-environment jsdom
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PrQuickExit } from '.'

// Each test's button must remove its Escape listener before the next one.
enableAutoUnmount(afterEach)

const replace = vi.fn()
const open = vi.fn()
const originalLocation = window.location

beforeEach(() => {
  vi.useFakeTimers()
  Object.defineProperty(window, 'location', { configurable: true, value: { ...originalLocation, replace } })
  vi.spyOn(window, 'open').mockImplementation(open)
})

afterEach(() => {
  Object.defineProperty(window, 'location', { configurable: true, value: originalLocation })
  vi.restoreAllMocks()
  replace.mockReset()
  open.mockReset()
  vi.useRealTimers()
  document.body.innerHTML = ''
})

function escape() {
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
}

describe('PrQuickExit', () => {
  it('replaces the page with the neutral one on click, after emitting exit', async () => {
    const wrapper = mount(PrQuickExit, { attachTo: document.body })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('exit')).toHaveLength(1)
    expect(replace).toHaveBeenCalledWith('https://www.google.fr/search?q=m%C3%A9t%C3%A9o')
    expect(open).not.toHaveBeenCalled()
  })

  it('is a red button named « Quitter vite », described with the shortcut', () => {
    const wrapper = mount(PrQuickExit, { attachTo: document.body })
    const button = wrapper.find('button')
    const description = document.getElementById(button.attributes('aria-describedby')!)

    expect(button.text()).toBe('Quitter vite')
    expect(button.classes()).toContain('pr:bg-[var(--pr-color-danger-solid)]')
    expect(description?.textContent?.trim()).toBe('Quitte ce site tout de suite et ouvre une page neutre. Raccourci : appuyez deux fois sur Échap.')
  })

  it('leaves the shortcut out of the description when it is off', () => {
    const wrapper = mount(PrQuickExit, { props: { shortcut: false }, attachTo: document.body })
    const description = document.getElementById(wrapper.find('button').attributes('aria-describedby')!)

    expect(description?.textContent?.trim()).toBe('Quitte ce site tout de suite et ouvre une page neutre.')
  })

  it('leaves on two Escape within a second', () => {
    const wrapper = mount(PrQuickExit, { props: { href: 'https://example.org/' }, attachTo: document.body })

    escape()
    vi.advanceTimersByTime(800)
    escape()

    expect(replace).toHaveBeenCalledWith('https://example.org/')
    expect(wrapper.emitted('exit')).toHaveLength(1)
  })

  it('stays on a single Escape, or two Escape too far apart', () => {
    mount(PrQuickExit, { attachTo: document.body })

    escape()
    expect(replace).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1500)
    escape()
    expect(replace).not.toHaveBeenCalled()
  })

  it('ignores Escape when the shortcut is off', () => {
    mount(PrQuickExit, { props: { shortcut: false }, attachTo: document.body })

    escape()
    escape()
    expect(replace).not.toHaveBeenCalled()
  })

  it('removes its listener once unmounted', () => {
    const wrapper = mount(PrQuickExit, { attachTo: document.body })
    wrapper.unmount()

    escape()
    escape()
    expect(replace).not.toHaveBeenCalled()
  })

  it('also opens the neutral page in a new tab with newTab', async () => {
    const wrapper = mount(PrQuickExit, { props: { newTab: true, label: 'Partir' }, attachTo: document.body })

    expect(wrapper.find('button').text()).toBe('Partir')
    await wrapper.find('button').trigger('click')
    expect(open).toHaveBeenCalledWith('https://www.google.fr/search?q=m%C3%A9t%C3%A9o', '_blank', 'noopener')
    expect(replace).toHaveBeenCalled()
  })
})
