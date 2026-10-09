import type { App, Plugin } from 'vue'
import { componentRegistry } from './components/registry'
import { providePrMessages, type PrMessagesOverride } from './i18n/context'

export interface PrismeOptions {
  /** Texts Prisme writes itself, French by default: `prMessagesEn`, or a few replaced (see `PrMessagesOverride`). */
  messages?: PrMessagesOverride
}

/**
 * Prisme's Vue plugin.
 *
 * `app.use(Prisme)` globally registers every public component from
 * [[componentRegistry]] under its `PrXxx` name, usable afterwards in
 * kebab-case (`<pr-xxx>`) in Vue templates as well as in plain HTML/Blade.
 * `app.use(Prisme, { messages })` replaces the texts it writes itself.
 */
export const Prisme: Plugin<[PrismeOptions?]> = {
  install(app: App, options: PrismeOptions = {}) {
    providePrMessages(app, options.messages)

    for (const [name, component] of Object.entries(componentRegistry)) {
      app.component(name, component)
    }
  },
}

export default Prisme
