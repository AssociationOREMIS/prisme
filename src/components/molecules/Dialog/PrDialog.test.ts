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

describe('size', () => {
  it.each([
    ['sm', '24rem'],
    ['md', '34rem'],
    ['lg', '48rem'],
    ['xl', '64rem'],
  ] as const)('PrDialog %s is %s wide, within the screen', async (size, width) => {
    mount(PrDialog, { props: { defaultOpen: true, title: 'Importer une formation', size }, attachTo: document.body })
    await nextTick()
    expect(document.querySelector('[role="dialog"]')?.className).toContain(`pr:w-[min(${width},calc(100vw-var(--pr-space-6)))]`)
  })

  it('PrDialog stays 34rem wide without a size', async () => {
    mount(PrDialog, { props: { defaultOpen: true, title: 'Modifier' }, attachTo: document.body })
    await nextTick()
    expect(document.querySelector('[role="dialog"]')?.className).toContain('pr:w-[min(34rem,')
  })

  it.each([
    ['sm', '20rem'],
    ['md', '26rem'],
    ['lg', '36rem'],
    ['xl', '48rem'],
  ] as const)('a side PrSheet %s is %s wide', async (size, width) => {
    mount(PrSheet, { props: { defaultOpen: true, title: 'Modifier la leçon', size }, attachTo: document.body })
    await nextTick()
    expect(document.querySelector('[role="dialog"]')?.className).toContain(`pr:w-[min(${width},100vw)]`)
  })

  it('a bottom PrSheet sets its height instead, 28rem by default', async () => {
    mount(PrSheet, { props: { defaultOpen: true, title: 'Filtres', side: 'bottom' }, attachTo: document.body })
    await nextTick()
    const className = document.querySelector('[role="dialog"]')?.className
    expect(className).toContain('pr:max-h-[min(28rem,100vh)]')
    expect(className).not.toContain('pr:w-[')
  })
})
