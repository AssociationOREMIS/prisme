import { inject, provide, type InjectionKey } from 'vue'
import type { PrNavigationMenuProps } from './PrNavigationMenu.vue'

type Orientation = NonNullable<PrNavigationMenuProps['orientation']>

// Scoped to a part of the page, not global: a mobile menu (PrNavbarMenu) asks the
// navigation menus inside it to lay their links out vertically.
const orientationKey: InjectionKey<Orientation> = Symbol('pr-navigation-menu-orientation')

export function providePrNavigationOrientation(orientation: Orientation) {
  provide(orientationKey, orientation)
}

export function usePrNavigationOrientation(): Orientation | undefined {
  return inject(orientationKey, undefined)
}
