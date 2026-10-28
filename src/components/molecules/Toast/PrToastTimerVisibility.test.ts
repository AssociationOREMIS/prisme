// @vitest-environment jsdom
// The toasts' close timers follow whether the page can be seen (PrToastTimerVisibility): they go
// on when another screen or application takes the focus, stop while the page is hidden.
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PrToastProvider, usePrToast } from '.'
import { toastQueue } from './queue'

let visibility: DocumentVisibilityState = 'visible'
const mounted: VueWrapper[] = []

beforeEach(() => {
  vi.useFakeTimers()
  visibility = 'visible'
  Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => visibility })
})

afterEach(() => {
  mounted.splice(0).forEach(wrapper => wrapper.unmount())
  toastQueue.value = []
  document.body.innerHTML = ''
  vi.useRealTimers()
})

function setVisibility(state: DocumentVisibilityState) {
  visibility = state
  document.dispatchEvent(new Event('visibilitychange'))
}

const isOpen = (title: string) => toastQueue.value.some(toast => toast.title === title && toast.open)

describe('PrToastTimerVisibility', () => {
  it('goes on counting when another screen or application takes the focus', async () => {
    mounted.push(mount(PrToastProvider, { attachTo: document.body }))
    usePrToast().toast({ title: 'Partenaire créé', duration: 2000 })
    await flushPromises()
    await vi.advanceTimersByTimeAsync(500)

    window.dispatchEvent(new Event('blur'))
    await flushPromises()
    await vi.advanceTimersByTimeAsync(1400)
    expect(isOpen('Partenaire créé')).toBe(true)
    await vi.advanceTimersByTimeAsync(200)
    expect(isOpen('Partenaire créé')).toBe(false)
  })


  it('waits for the page to show before counting, when the toast appears in a hidden page', async () => {
    visibility = 'hidden'
    mounted.push(mount(PrToastProvider, { attachTo: document.body }))
    usePrToast().toast({ title: 'Enregistré', duration: 1000 })
    await flushPromises()

    await vi.advanceTimersByTimeAsync(5000)
    expect(isOpen('Enregistré')).toBe(true)

    setVisibility('visible')
    await vi.advanceTimersByTimeAsync(900)
    expect(isOpen('Enregistré')).toBe(true)
    await vi.advanceTimersByTimeAsync(200)
    expect(isOpen('Enregistré')).toBe(false)
  })

  it('stops counting while the page is hidden, then resumes with the time left', async () => {
    mounted.push(mount(PrToastProvider, { attachTo: document.body }))
    usePrToast().toast({ title: 'Bénévole ajouté', duration: 2000 })
    await flushPromises()
    await vi.advanceTimersByTimeAsync(1000)

    setVisibility('hidden')
    await vi.advanceTimersByTimeAsync(10000)
    expect(isOpen('Bénévole ajouté')).toBe(true)

    setVisibility('visible')
    await vi.advanceTimersByTimeAsync(900)
    expect(isOpen('Bénévole ajouté')).toBe(true)
    await vi.advanceTimersByTimeAsync(200)
    expect(isOpen('Bénévole ajouté')).toBe(false)
  })
})
