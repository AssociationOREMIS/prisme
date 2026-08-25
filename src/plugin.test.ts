import { createApp } from 'vue'
import { describe, expect, it } from 'vitest'
import Prisme, { Prisme as NamedPrisme, PrBadge, PrButton, PrDataTable } from './index'
import { componentRegistry } from './components/registry'

describe('Prisme plugin', () => {
  it('exposes the same plugin as default and named export', () => {
    expect(Prisme).toBe(NamedPrisme)
  })

  it('is installable via app.use', () => {
    const app = createApp({})

    expect(() => app.use(Prisme)).not.toThrow()
  })

  it('registers every public component globally under its PrXxx name', () => {
    const app = createApp({})
    app.use(Prisme)

    for (const [name, component] of Object.entries(componentRegistry)) {
      expect(app.component(name)).toBe(component)
    }
  })

  it('does not register components before install is called', () => {
    const app = createApp({})

    expect(app.component('PrButton')).toBeUndefined()
  })

  it('keeps named imports working independently of app.use', () => {
    expect(PrButton).toBe(componentRegistry.PrButton)
    expect(PrBadge).toBe(componentRegistry.PrBadge)
    expect(PrDataTable).toBe(componentRegistry.PrDataTable)
  })
})
