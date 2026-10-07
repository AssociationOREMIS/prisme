import { defineAsyncComponent, type App, type Component } from 'vue'
import { componentLoaders } from './components/loaders.generated'

export interface RegisterPrismeOptions {
  /**
   * Components imported statically by the app and registered as they are: the ones on every
   * page (navbar, sidebar, buttons...), so they render on first paint instead of popping in.
   */
  eager?: Record<string, Component>
  /** Placeholder shown while a lazy component loads (a skeleton), or undefined for none. */
  loading?: (name: string) => Component | undefined
  /** Milliseconds before the placeholder shows, so a fast load never flickers. Default 150. */
  delay?: number
}

/**
 * Registers every Prisme component on a Vue app mounted over Blade pages, where components
 * are written as tags (`<pr-button>`): the `eager` ones as given, every other one loaded on
 * demand. Replaces the per-app generated loader list and its hand-kept "eager" list.
 *
 * ```ts
 * import { PrButton, PrNavbar } from '@oremis/prisme'
 * import { registerPrisme } from '@oremis/prisme/blade'
 *
 * registerPrisme(app, { eager: { PrButton, PrNavbar }, loading: skeletonFor })
 * ```
 */
export function registerPrisme(app: App, options: RegisterPrismeOptions = {}): void {
  const eager = options.eager ?? {}

  for (const [name, component] of Object.entries(eager)) {
    app.component(name, component)
  }

  for (const [name, loader] of Object.entries(componentLoaders)) {
    if (name in eager) continue
    app.component(name, defineAsyncComponent({
      loader,
      loadingComponent: options.loading?.(name),
      delay: options.delay ?? 150,
    }))
  }
}

export { componentLoaders }
