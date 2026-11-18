// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { PrReveal } from '.'

let callback: IntersectionObserverCallback | undefined
class FakeObserver {
  constructor(cb: IntersectionObserverCallback) {
    callback = cb
  }

  observe() {}
  disconnect() {}
}

function stubMotion(reduced: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: reduced, media: query, addEventListener() {}, removeEventListener() {} }))
}

function enter(isIntersecting: boolean, top = 0) {
  callback?.([{ isIntersecting, boundingClientRect: { top } } as IntersectionObserverEntry], {} as IntersectionObserver)
}

afterEach(() => {
  vi.unstubAllGlobals()
  callback = undefined
})

describe('PrReveal', () => {
  it('shows the content without IntersectionObserver (no script, old browser)', () => {
    stubMotion(false)
    vi.stubGlobal('IntersectionObserver', undefined)
    const wrapper = mount(PrReveal, { slots: { default: 'Carte' } })
    expect(wrapper.attributes('data-state')).toBe('idle')
    expect(wrapper.find('.pr-reveal__inner').classes()).not.toContain('pr:opacity-0')
  })

  it('never hides the content when the user asks for less motion', async () => {
    stubMotion(true)
    vi.stubGlobal('IntersectionObserver', FakeObserver)
    const wrapper = mount(PrReveal)
    await nextTick()
    expect(wrapper.attributes('data-state')).toBe('idle')
  })

  it('hides, then reveals once in view, and replays with `repeat`', async () => {
    stubMotion(false)
    vi.stubGlobal('IntersectionObserver', FakeObserver)
    const wrapper = mount(PrReveal, { props: { effect: 'fade-left', repeat: true } })
    await nextTick()
    expect(wrapper.attributes('data-state')).toBe('hidden')
    expect(wrapper.classes()).toContain('pr:overflow-x-clip')
    enter(true)
    await nextTick()
    expect(wrapper.attributes('data-state')).toBe('shown')
    enter(false, 900)
    await nextTick()
    expect(wrapper.attributes('data-state')).toBe('hidden')
  })
})
