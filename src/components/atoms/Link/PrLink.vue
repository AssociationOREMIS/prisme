<script setup lang="ts">
import { computed, getCurrentInstance, type Component } from 'vue'

/** A route for Vue Router: a path (`/adherer`) or a route location (`{ name: 'membership' }`). */
export type PrLinkTo = string | Record<string, unknown>

export interface PrLinkProps {
  /** Address of the link: a page of the site, another site, `mailto:`... */
  href?: string
  /**
   * Route of the app's Vue Router: the link then navigates without reloading the page. Uses the
   * `RouterLink` that vue-router registers on the app; without it, a string `to` is a plain `href`.
   */
  to?: PrLinkTo
  /**
   * Marks the link as the current page (`aria-current="page"`, `data-current`). Left empty, it is
   * worked out when `current-detection` is on: from the router with `to`, from the address otherwise.
   */
  current?: boolean
  /** Works out by itself whether the link is the current page: for the links of a navigation. */
  currentDetection?: boolean
  /** With `current-detection`, the current page only when the address is the same, not a sub-page. */
  exact?: boolean
}

// The attributes (class, target, @click...) go to the <a>, not to the RouterLink around it.
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<PrLinkProps>(), {
  href: undefined,
  to: undefined,
  current: undefined,
  currentDetection: false,
  exact: false,
})

// vue-router registers RouterLink on the app itself: Prisme needs no setting and no dependency.
const routerLink = getCurrentInstance()?.appContext.components.RouterLink as Component | undefined
const useRouter = computed(() => props.to !== undefined && routerLink !== undefined)

if (props.to !== undefined && !routerLink && typeof props.to !== 'string') {
  console.warn('[prisme] PrLink: `to` needs Vue Router (app.use(router)); give an `href` otherwise.')
}

const plainHref = computed(() => props.href ?? (typeof props.to === 'string' ? props.to : undefined))

/** The path without its trailing slash, so `/adherer` and `/adherer/` are the same page. */
function normalize(path: string) {
  return path.length > 1 ? path.replace(/\/+$/, '') : path
}

function isCurrentAddress(href: string | undefined) {
  if (!href || typeof window === 'undefined') return false
  let url: URL
  try {
    url = new URL(href, window.location.href)
  } catch {
    return false
  }
  if (url.origin !== window.location.origin) return false
  const path = normalize(url.pathname)
  const here = normalize(window.location.pathname)
  // The home page is only current on itself, never on every page under it.
  return here === path || (!props.exact && path !== '/' && here.startsWith(`${path}/`))
}

function isCurrent(routerActive = false, routerExactActive = false) {
  if (props.current !== undefined) return props.current
  if (!props.currentDetection) return false
  if (useRouter.value) return props.exact ? routerExactActive : routerActive
  return isCurrentAddress(plainHref.value)
}
</script>

<template>
  <component
    :is="routerLink"
    v-if="useRouter"
    v-slot="{ href: routeHref, navigate, isActive, isExactActive }"
    :to="to"
    custom
  >
    <a
      v-bind="$attrs"
      :href="routeHref"
      :aria-current="isCurrent(isActive, isExactActive) ? 'page' : undefined"
      :data-current="isCurrent(isActive, isExactActive) ? 'true' : undefined"
      @click="navigate"
    >
      <slot :current="isCurrent(isActive, isExactActive)" />
    </a>
  </component>
  <a
    v-else
    v-bind="$attrs"
    :href="plainHref"
    :aria-current="isCurrent() ? 'page' : undefined"
    :data-current="isCurrent() ? 'true' : undefined"
  >
    <slot :current="isCurrent()" />
  </a>
</template>
