import { createApp, defineComponent } from 'vue'
import { describe, expect, it } from 'vitest'
import { registerPrisme } from './blade'
import { componentLoaders } from './components/loaders.generated'
import { componentRegistry } from './components/registry'

describe('registerPrisme', () => {
  it('has a lazy loader for every registered component', () => {
    expect(Object.keys(componentLoaders).sort()).toEqual(Object.keys(componentRegistry).sort())
  })

  it('registers the eager components as given and every other one on demand', () => {
    const app = createApp({})
    const eagerButton = defineComponent({ name: 'EagerButton', render: () => null })

    registerPrisme(app, { eager: { PrButton: eagerButton } })

    expect(app.component('PrButton')).toBe(eagerButton)
    for (const name of Object.keys(componentRegistry)) {
      expect(app.component(name), name).toBeDefined()
    }
    expect((app.component('PrToast') as { __asyncLoader?: unknown }).__asyncLoader).toBeTypeOf('function')
  })

  it('loads a lazy component as the real one', async () => {
    const component = await componentLoaders.PrBadge()
    expect(component).toBe(componentRegistry.PrBadge)
  })
})
