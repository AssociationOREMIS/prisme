// @vitest-environment jsdom
import { createApp } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { registerPrisme, type RegisterPrismeOptions } from './blade'
import { componentLoaders } from './components/loaders.generated'

// What registerPrisme adds once the app is mounted, to speed up the next Blade page load.
// jsdom knows neither Speculation Rules nor requestIdleCallback: both are stubbed.

function mountApp(options: RegisterPrismeOptions = {}) {
  const root = document.createElement('div')
  document.body.append(root)
  const app = createApp({ template: '<p>page</p>' })
  registerPrisme(app, options)
  app.mount(root)
  return app
}

const speculationScript = () => document.head.querySelector<HTMLScriptElement>('script[type="speculationrules"]')
const transitionsStyle = () => document.head.querySelector('style[data-prisme="transitions"]')

beforeEach(() => {
  vi.spyOn(console, 'debug').mockImplementation(() => undefined)
  vi.stubGlobal('requestIdleCallback', (callback: () => void) => setTimeout(callback, 0))
  HTMLScriptElement.supports = (type: string) => type === 'speculationrules'
})

afterEach(() => {
  document.head.innerHTML = ''
  document.body.innerHTML = ''
  Object.defineProperty(document, 'prerendering', { value: undefined, configurable: true })
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('registerPrisme after mount', () => {
  it('prerenders same-origin links on hover, except logouts, downloads, other targets and opt-outs', () => {
    mountApp()

    const rules = JSON.parse(speculationScript()?.textContent ?? '{}')
    expect(Object.keys(rules)).toEqual(['prerender'])
    expect(rules.prerender[0].eagerness).toBe('moderate')
    expect(rules.prerender[0].where.and).toEqual([
      { href_matches: '/*' },
      { not: { href_matches: '/*logout*' } },
      { not: { selector_matches: '[data-no-prefetch], [download], [target]:not([target="_self"])' } },
    ])
  })

  it('only prefetches with prefetch: "prefetch", and adds nothing with false', () => {
    mountApp({ prefetch: 'prefetch' })
    expect(Object.keys(JSON.parse(speculationScript()?.textContent ?? '{}'))).toEqual(['prefetch'])

    document.head.innerHTML = ''
    mountApp({ prefetch: false })
    expect(speculationScript()).toBeNull()
  })

  it('adds no speculation rules where the browser does not support them', () => {
    HTMLScriptElement.supports = () => false
    mountApp()
    expect(speculationScript()).toBeNull()
  })

  it('opts into view transitions only once mounted, keeping the navbar and sidebar still', () => {
    const app = createApp({})
    registerPrisme(app)
    expect(transitionsStyle()).toBeNull()

    app.mount(document.body.appendChild(document.createElement('div')))

    const css = transitionsStyle()?.textContent ?? ''
    expect(css).toContain('@view-transition { navigation: auto; }')
    expect(css).toContain('.pr-navbar { view-transition-name: pr-navbar; }')
    expect(css).toContain('.pr-sidebar { view-transition-name: pr-sidebar; }')
    expect(css).toContain('prefers-reduced-motion: no-preference')
  })

  it('adds each element once when two apps are mounted', () => {
    mountApp()
    mountApp()
    expect(document.head.querySelectorAll('script[type="speculationrules"]')).toHaveLength(1)
    expect(document.head.querySelectorAll('style[data-prisme="transitions"]')).toHaveLength(1)
  })

  it('adds nothing when transitions and prefetch are off', () => {
    mountApp({ prefetch: false, transitions: false })
    expect(document.head.children).toHaveLength(0)
  })

  it('records the mount time in the Performance panel', () => {
    mountApp()
    const [entry] = performance.getEntriesByName('prisme:mount')
    expect(entry).toBeDefined()
    expect((entry as PerformanceMeasure).detail).toEqual({ prerendered: false })
    performance.clearMeasures('prisme:mount')
  })

  it('preloads the lazy components one by one once the page is idle, skipping the eager ones', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout'] })
    const PrButton = { render: () => null }
    const loaded: string[] = []
    for (const name of Object.keys(componentLoaders)) {
      vi.spyOn(componentLoaders, name).mockImplementation(async () => {
        loaded.push(name)
        return { render: () => null }
      })
    }

    mountApp({ eager: { PrButton } })
    expect(loaded).toEqual([])

    await vi.runAllTimersAsync()
    expect(loaded).toEqual(Object.keys(componentLoaders).filter(name => name !== 'PrButton'))
  })

  it('preloads nothing with preload: false or Save-Data', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout'] })
    const loader = vi.spyOn(componentLoaders, 'PrToast').mockResolvedValue({ render: () => null })

    mountApp({ preload: false })
    vi.stubGlobal('navigator', { connection: { saveData: true } })
    mountApp()

    await vi.runAllTimersAsync()
    expect(loader).not.toHaveBeenCalled()
  })

  it('waits until a prerendered page is opened before preloading', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout'] })
    Object.defineProperty(document, 'prerendering', { value: true, configurable: true })
    for (const name of Object.keys(componentLoaders)) {
      vi.spyOn(componentLoaders, name).mockResolvedValue({ render: () => null })
    }
    const loader = vi.mocked(componentLoaders.PrToast)

    mountApp()
    await vi.runAllTimersAsync()
    expect(loader).not.toHaveBeenCalled()
    expect((performance.getEntriesByName('prisme:mount').at(-1) as PerformanceMeasure).detail).toEqual({ prerendered: true })

    Object.defineProperty(document, 'prerendering', { value: false, configurable: true })
    document.dispatchEvent(new Event('prerenderingchange'))
    await vi.runAllTimersAsync()
    expect(loader).toHaveBeenCalledOnce()
    performance.clearMeasures('prisme:mount')
  })
})
