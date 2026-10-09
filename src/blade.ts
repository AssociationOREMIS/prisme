import { defineAsyncComponent, type App, type Component } from 'vue'
import { componentLoaders } from './components/loaders.generated'
import { enableSwapNavigation, MARKER } from './bladeNavigation'
import { providePrMessages, type PrMessagesOverride } from './i18n/context'

export interface RegisterPrismeOptions {
  /**
   * Components imported statically by the app and registered as they are: the ones on every
   * page (navbar, sidebar, buttons...), so they render on first paint instead of popping in.
   */
  eager?: Record<string, Component>
  /** Placeholder shown while a lazy component loads (a skeleton), or undefined for none: `prSkeletonFor`. */
  loading?: (name: string) => Component | undefined
  /** Milliseconds before the placeholder shows, so a fast load never flickers. Default 150. */
  delay?: number
  /**
   * Loads the page behind a link while the pointer rests on it (Speculation Rules, Chromium only):
   * `'prerender'` (default) also runs its scripts, so Vue is already mounted on click; `'prefetch'`
   * only downloads the HTML; `false` turns it off. Links with `data-no-prefetch`, `download` or a
   * `target`, to another site or to a logout URL are left alone.
   */
  prefetch?: 'prerender' | 'prefetch' | false
  /**
   * Downloads every lazy component once the page is idle (default `'idle'`), so the next pages find
   * them in the browser cache and show no skeleton. `false` turns it off. Skipped with Save-Data.
   */
  preload?: 'idle' | false
  /**
   * Keeps the navbar and sidebar still and fades the content between two pages (cross-document View
   * Transitions), once Vue has mounted: a page still hidden by `v-cloak` shows up as usual. Default true.
   */
  transitions?: boolean
  /**
   * Records `prisme:mount`, the time from navigation start to the mount of Vue, in the Performance
   * panel of the devtools (and with `console.debug`). Default true.
   */
  measure?: boolean
  /**
   * `'swap'` shows the next page without reloading: links are fetched and only the page's `#app` is
   * patched, so the navbar and sidebar stay in place in every browser (see bladeNavigation.ts). Pages
   * with other scripts or stylesheets, downloads and `data-prisme-reload` links still load normally.
   * On by default; `false` turns it off for the app, and `localStorage['prisme:navigation'] = 'off'`
   * in one browser (to compare, or to rule it out when something looks wrong).
   */
  navigation?: 'swap' | false
  /** Texts Prisme writes itself, French by default: `prMessagesEn`, or a few replaced (see `PrMessagesOverride`). */
  messages?: PrMessagesOverride
  /**
   * Vue compiles the whole Blade page, so `{{ ... }}` in a text typed by someone (a name, a
   * comment) would run as Vue code. Other delimiters, rare in typed text, close that door for
   * text the app forgot to put in `v-pre`: `delimiters: ['[[%', '%]]']`. The page's own Vue
   * interpolations (`@{{ x }}` in Blade) then use them instead.
   */
  delimiters?: [string, string]
}

type PrerenderingDocument = Document & { prerendering?: boolean }

/**
 * Registers every Prisme component on a Vue app mounted over Blade pages, where components
 * are written as tags (`<pr-button>`): the `eager` ones as given, every other one loaded on
 * demand. Replaces the per-app generated loader list and its hand-kept "eager" list.
 *
 * Every Blade navigation is a full page load, so once the app is mounted it also prepares the
 * next one: see `prefetch`, `preload`, `transitions` and `measure`.
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
  const lazyLoaders: Array<() => Promise<unknown>> = []

  providePrMessages(app, options.messages)
  if (options.delimiters) app.config.compilerOptions.delimiters = options.delimiters

  for (const [name, component] of Object.entries(eager)) {
    app.component(name, component)
  }

  for (const [name, loader] of Object.entries(componentLoaders)) {
    if (name in eager) continue
    lazyLoaders.push(loader)
    app.component(name, defineAsyncComponent({
      loader,
      loadingComponent: options.loading?.(name),
      delay: options.delay ?? 150,
    }))
  }

  if (typeof document === 'undefined') return

  const prefetch = options.prefetch ?? 'prerender'
  const mount = app.mount

  app.mount = (...args: Parameters<App['mount']>) => {
    const swap = options.navigation === undefined ? navigationInThisBrowser() !== 'off' : options.navigation === 'swap'
    const container = typeof args[0] === 'string' ? document.querySelector(args[0]) : args[0]
    if (swap && container instanceof Element) enableSwapNavigation(app, container, { prefetch: Boolean(prefetch) })

    const instance = mount(...args)

    if (options.measure ?? true) measureMount()
    // A swap fetches pages itself: prerendered documents would never be used.
    if (prefetch && !swap) addSpeculationRules(prefetch)
    if (options.transitions ?? true) addViewTransitions({ betweenDocuments: !swap })
    if ((options.preload ?? 'idle') && !prefersSavingData()) whenShown(() => preloadWhenIdle(lazyLoaders))

    return instance
  }
}

/**
 * Same-origin links worth loading ahead: not opened elsewhere, not downloads, not logouts
 * (a GET logout would end the session on hover), not opted out with `data-no-prefetch`.
 */
function speculationRules(action: 'prerender' | 'prefetch'): object {
  return {
    [action]: [{
      where: {
        and: [
          { href_matches: '/*' },
          { not: { href_matches: '/*logout*' } },
          { not: { selector_matches: '[data-no-prefetch], [download], [target]:not([target="_self"])' } },
        ],
      },
      eagerness: 'moderate',
    }],
  }
}

/**
 * The navbar and sidebar keep their place, the content cross-fades: during a swap (a transition
 * inside the document), or between two documents without swap navigation.
 */
const VIEW_TRANSITION_RULES = `
  .pr-navbar { view-transition-name: pr-navbar; }
  .pr-sidebar { view-transition-name: pr-sidebar; }
  ::view-transition-group(pr-navbar), ::view-transition-group(pr-sidebar),
  ::view-transition-old(pr-navbar), ::view-transition-new(pr-navbar),
  ::view-transition-old(pr-sidebar), ::view-transition-new(pr-sidebar) { animation: none; }
  ::view-transition-old(root), ::view-transition-new(root) { animation-duration: 150ms; }`

function addSpeculationRules(action: 'prerender' | 'prefetch'): void {
  if (!HTMLScriptElement.supports?.('speculationrules')) return
  if (document.head.querySelector(`script[${MARKER}="speculation"]`)) return

  const script = document.createElement('script')
  script.type = 'speculationrules'
  script.setAttribute(MARKER, 'speculation')
  script.textContent = JSON.stringify(speculationRules(action))
  document.head.append(script)
}

/**
 * Between documents, the opt-in is added only once mounted: a page revealed while still under
 * `v-cloak` (not prerendered, slow network) has no opt-in yet, so it shows up as before instead of
 * fading into its skeleton. The browser then aborts the transition the previous page started and
 * logs it: after a form submission, whose answer is never prerendered, the transition is skipped
 * before it starts. A swap needs none of this, its transitions stay inside the document.
 */
/** Set once the page listens for submissions: two apps on a page share it. */
let skipsTransitionOnSubmit = false

function addViewTransitions({ betweenDocuments }: { betweenDocuments: boolean }): void {
  if (document.head.querySelector(`style[${MARKER}="transitions"]`)) return

  const style = document.createElement('style')
  style.setAttribute(MARKER, 'transitions')
  const optIn = betweenDocuments ? '\n  @view-transition { navigation: auto; }' : ''
  style.textContent = `@media (prefers-reduced-motion: no-preference) {${optIn}${VIEW_TRANSITION_RULES}\n}`
  document.head.append(style)

  if (!betweenDocuments || skipsTransitionOnSubmit) return
  skipsTransitionOnSubmit = true

  let submitting = false
  // On window, after the page's own handlers: a submission they cancel does not navigate.
  window.addEventListener('submit', (event) => { submitting = !event.defaultPrevented })
  window.addEventListener('pageswap', (event) => {
    if (submitting) (event as Event & { viewTransition?: { skipTransition: () => void } | null }).viewTransition?.skipTransition()
  })
}

/** A prerendered page was mounted before anyone opened it: the detail says so. */
function measureMount(): void {
  if (typeof performance?.measure !== 'function') return

  const prerendered = (document as PrerenderingDocument).prerendering === true
  const entry = performance.measure('prisme:mount', { start: 0, detail: { prerendered } })

  console.debug(`[prisme] Vue monte en ${Math.round(entry.duration)} ms${prerendered ? ' (page prechargee, avant son ouverture)' : ''}`)
}

/** The navigation chosen in this browser, if any (`'off'` to load every page in full). */
function navigationInThisBrowser(): string | null {
  try {
    return localStorage.getItem('prisme:navigation')
  } catch {
    return null
  }
}

function prefersSavingData(): boolean {
  return (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true
}

/** A prerendered page waits until it is opened, in case it never is. */
function whenShown(callback: () => void): void {
  if ((document as PrerenderingDocument).prerendering) {
    document.addEventListener('prerenderingchange', callback, { once: true })
  } else {
    callback()
  }
}

function whenIdle(callback: () => void): void {
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(callback, { timeout: 5000 })
  } else {
    setTimeout(callback, 1000)
  }
}

/** One component per idle period, after the page has loaded, so preloading never slows it down. */
function preloadWhenIdle(loaders: Array<() => Promise<unknown>>): void {
  const queue = [...loaders]

  const next = (): void => {
    const loader = queue.shift()
    if (loader) loader().catch(() => undefined).finally(() => whenIdle(next))
  }

  if (document.readyState === 'complete') {
    whenIdle(next)
  } else {
    window.addEventListener('load', () => whenIdle(next), { once: true })
  }
}

export { componentLoaders }

/** Placeholders for `registerPrisme(app, { loading: prSkeletonFor })`, styled by `getPrSkeletonStyles()`. */
export { prSkeletonFor } from './skeleton'
