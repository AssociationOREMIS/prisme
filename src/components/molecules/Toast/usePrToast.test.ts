// @vitest-environment jsdom
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PrToastProvider, usePrToast } from '.'
import { toastQueue } from './queue'

const mounted: VueWrapper[] = []

afterEach(() => {
  mounted.splice(0).forEach(wrapper => wrapper.unmount())
  toastQueue.value = []
  document.body.innerHTML = ''
  vi.useRealTimers()
})

const toastTitles = () => [...document.querySelectorAll('.pr-toast')].map(toast => toast.textContent ?? '')

describe('usePrToast', () => {
  it('shows a toast in the page provider, from code', async () => {
    mounted.push(mount(PrToastProvider, { attachTo: document.body }))
    usePrToast().toast({ title: 'Bénévole ajouté', variant: 'success' })
    await flushPromises()

    expect(toastTitles().some(text => text.includes('Bénévole ajouté'))).toBe(true)
  })

  it('keeps four toasts on screen at most, the oldest leave first', async () => {
    vi.useFakeTimers()
    const { toast } = usePrToast()
    for (let index = 1; index <= 5; index++) toast({ title: `Message ${index}` })

    expect(toastQueue.value.filter(item => item.open).map(item => item.title)).toEqual(['Message 2', 'Message 3', 'Message 4', 'Message 5'])
    vi.advanceTimersByTime(250)
    expect(toastQueue.value).toHaveLength(4)
  })

  it('shows the queue in one provider only', async () => {
    const Page = defineComponent({
      components: { PrToastProvider },
      template: '<PrToastProvider /><PrToastProvider />',
    })
    mounted.push(mount(Page, { attachTo: document.body }))
    usePrToast().toast({ title: 'Une seule fois' })
    await flushPromises()

    expect(toastTitles().filter(text => text.includes('Une seule fois'))).toHaveLength(1)
  })
})
