// @vitest-environment jsdom
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { PrAlertDialog } from '.'

afterEach(() => {
  document.body.innerHTML = ''
})

const confirmButton = () => [...document.querySelectorAll('[role="alertdialog"] button')].find(button => button.textContent?.includes('Supprimer')) as HTMLButtonElement

async function open(onConfirm: () => unknown) {
  const wrapper = mount(PrAlertDialog, { props: { defaultOpen: true, title: 'Supprimer Camille MARTIN ?', confirmText: 'Supprimer', onConfirm }, attachTo: document.body })
  await flushPromises()
  return wrapper
}

describe('PrAlertDialog confirm', () => {
  it('closes at once after a synchronous confirm', async () => {
    const wrapper = await open(() => {})
    confirmButton().click()
    await flushPromises()

    expect(wrapper.emitted('update:open')).toEqual([[false]])
  })

  it('stays open and loading until an async confirm resolves', async () => {
    let finish!: () => void
    const wrapper = await open(() => new Promise<void>((resolve) => { finish = resolve }))
    confirmButton().click()
    await flushPromises()

    expect(confirmButton().getAttribute('aria-busy')).toBe('true')
    expect(wrapper.emitted('update:open')).toBeUndefined()

    finish()
    await flushPromises()
    expect(wrapper.emitted('update:open')).toEqual([[false]])
  })

  it('stays open when the async confirm fails', async () => {
    const wrapper = await open(() => Promise.reject(new Error('Erreur serveur')))
    confirmButton().click()
    await flushPromises()

    expect(wrapper.emitted('update:open')).toBeUndefined()
    expect(confirmButton().getAttribute('aria-busy')).toBeNull()
  })
})
