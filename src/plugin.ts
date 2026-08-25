import type { App, Plugin } from 'vue'
import { componentRegistry } from './components/registry'

/**
 * Prisme's Vue plugin.
 *
 * `app.use(Prisme)` globally registers every public component from
 * [[componentRegistry]] under its `PrXxx` name, usable afterwards in
 * kebab-case (`<pr-xxx>`) in Vue templates as well as in plain HTML/Blade.
 */
export const Prisme: Plugin = {
  install(app: App) {
    for (const [name, component] of Object.entries(componentRegistry)) {
      app.component(name, component)
    }
  },
}

export default Prisme
