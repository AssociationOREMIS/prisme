// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PrSheet } from '../Sheet'
import { PrDialog } from '.'

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

/** The name a screen reader announces for the open dialog: the text of its aria-labelledby. */
async function dialogName(): Promise<string | undefined> {
  await nextTick()
  const dialog = document.querySelector('[role="dialog"]')
  const labelId = dialog?.getAttribute('aria-labelledby')
  return labelId ? document.getElementById(labelId)?.textContent ?? undefined : undefined
}

describe.each([['PrDialog', PrDialog], ['PrSheet', PrSheet]] as const)('%s accessible name', (name, component) => {
  it('is the visible title', async () => {
    mount(component, { props: { defaultOpen: true, title: 'Modifier le bénévole' }, attachTo: document.body })
    expect(await dialogName()).toBe('Modifier le bénévole')
  })

  it('is ariaLabel without a title, hidden from view', async () => {
    mount(component, { props: { defaultOpen: true, ariaLabel: 'Filtres' }, attachTo: document.body })
    expect(await dialogName()).toBe('Filtres')
    expect(document.querySelector('[role="dialog"] .pr\\:sr-only')?.textContent).toBe('Filtres')
  })

  it('warns when it has neither', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mount(component, { props: { defaultOpen: true }, attachTo: document.body })
    expect(warn).toHaveBeenCalledWith(expect.stringContaining(`${name}: without \`title\``))
  })
})
