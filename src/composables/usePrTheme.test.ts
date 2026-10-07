// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// usePrTheme keeps module-level state: each test loads a fresh copy of the module, with an
// in-memory localStorage (Node 25's global one is unusable) and a controllable system theme.

let stored: Record<string, string>
let systemDark: boolean
let systemListeners: Array<() => void>

function stubBrowser() {
  stored = {}
  systemDark = false
  systemListeners = []
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => stored[key] ?? null,
    setItem: (key: string, value: string) => { stored[key] = value },
    removeItem: (key: string) => { delete stored[key] },
  })
  vi.stubGlobal('matchMedia', (query: string) => ({
    get matches() { return query.includes('dark') && systemDark },
    addEventListener: (_event: string, listener: () => void) => systemListeners.push(listener),
  }))
}

async function loadTheme() {
  vi.resetModules()
  return import('./usePrTheme')
}

const htmlTheme = () => document.documentElement.dataset.prTheme

beforeEach(() => {
  stubBrowser()
  delete document.documentElement.dataset.prTheme
  document.documentElement.style.colorScheme = ''
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('usePrTheme', () => {
  it('applies the stored theme', async () => {
    stored['oremis-prisme-theme'] = 'dark'
    const { usePrTheme } = await loadTheme()

    const { theme, resolvedTheme } = usePrTheme()

    expect(theme.value).toBe('dark')
    expect(resolvedTheme.value).toBe('dark')
    expect(htmlTheme()).toBe('dark')
    expect(document.documentElement.style.colorScheme).toBe('dark')
  })

  it('follows the system theme when nothing valid is stored, and its later changes', async () => {
    stored['oremis-prisme-theme'] = 'purple'
    systemDark = true
    const { usePrTheme } = await loadTheme()

    expect(usePrTheme().theme.value).toBe('system')
    expect(htmlTheme()).toBe('dark')

    systemDark = false
    systemListeners.forEach((listener) => listener())
    expect(htmlTheme()).toBe('light')
  })

  it('setPrTheme stores and applies the choice, togglePrTheme flips it', async () => {
    const { setPrTheme, togglePrTheme } = await loadTheme()

    setPrTheme('dark')
    expect(stored['oremis-prisme-theme']).toBe('dark')
    expect(htmlTheme()).toBe('dark')

    togglePrTheme()
    expect(stored['oremis-prisme-theme']).toBe('light')
    expect(htmlTheme()).toBe('light')
  })

  it('ignores system changes once a theme is chosen', async () => {
    const { setPrTheme } = await loadTheme()
    setPrTheme('light')

    systemDark = true
    systemListeners.forEach((listener) => listener())

    expect(htmlTheme()).toBe('light')
  })
})

describe('getPrThemeInitScript', () => {
  // The inline script runs before Vue: it must reach the same theme as usePrTheme, or the page
  // flashes from one theme to the other when the app starts.
  it.each([
    ['dark', false, 'dark'],
    ['light', true, 'light'],
    ['system', true, 'dark'],
    [null, false, 'light'],
    ['purple', true, 'dark'],
  ] as const)('stored %s, system dark %s: applies %s like usePrTheme', async (storedTheme, dark, expected) => {
    if (storedTheme) stored['oremis-prisme-theme'] = storedTheme
    systemDark = dark
    const { getPrThemeInitScript, usePrTheme } = await loadTheme()

    new Function(getPrThemeInitScript())()
    expect(htmlTheme()).toBe(expected)
    expect(document.documentElement.style.colorScheme).toBe(expected)

    delete document.documentElement.dataset.prTheme
    usePrTheme()
    expect(htmlTheme()).toBe(expected)
  })
})
