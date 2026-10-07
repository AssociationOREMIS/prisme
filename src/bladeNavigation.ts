import { compile, nextTick, shallowRef, type App, type RenderFunction, type VNode } from 'vue'

/**
 * Navigation without page reloads for Vue apps mounted over Blade pages (`navigation: 'swap'` of
 * `registerPrisme`). The server still answers every link with a full HTML page: a click fetches it,
 * and the app's root template is replaced by the new page's `#app`. Vue patches the difference, so
 * the navbar and sidebar keep their DOM and state (only their props change, the active item for
 * instance) while the content (`.pr-shell-grid__content`), keyed per page, is rebuilt from scratch.
 * A layout without that element is rebuilt whole: nothing kept, but nothing carried over either.
 *
 * Anything a swap could not reproduce falls back to a normal page load: another layout or other
 * scripts and stylesheets (a page with its own `@push('scripts')`), a non-HTML answer (a download),
 * a network error, a redirect to another site (an expired session sent to the SSO).
 */

/** The part of the layout that changes from one page to the next. */
const CONTENT = '.pr-shell-grid__content'

/** Marker on the elements Prisme adds, shared with blade.ts. */
export const MARKER = 'data-prisme'

/** Links never handled: opened elsewhere, downloads, logouts, opted out with `data-prisme-reload`. */
const EXCLUDED_LINKS = '[download], [target]:not([target="_self"]), [data-prisme-reload] a, a[data-prisme-reload]'

/** A hovered link is fetched after this delay, and the answer kept this long for the click. */
const HOVER_DELAY = 80
const PREFETCH_TTL = 15_000

interface FetchedPage {
  url: string
  title: string
  template: string
  assets: string[]
  csrfToken: string | null
}

type HistoryState = { prisme: true, scrollY?: number }

/**
 * Scripts a proxy adds to every response, never the same twice: Cloudflare's bot detection writes the
 * request's id inline, and Rocket Loader its own loader. They live under Cloudflare's reserved `/cdn-cgi/`.
 */
const isInjectedByProxy = (element: Element): boolean =>
  (element.getAttribute('src') ?? element.textContent ?? '').includes('/cdn-cgi/')

/**
 * The scripts and stylesheets of a document, outside the app. A page that brings one the current
 * document lacks (its own `@push('scripts')`) cannot be swapped. The current document may have more,
 * added while it ran (Vite's dev styles, a script the app loaded): those do not prevent a swap.
 */
function assetsOf(doc: Document, app: Element | null): string[] {
  const assets: string[] = []

  for (const element of doc.querySelectorAll(`script, link[rel="stylesheet"], link[rel="modulepreload"], style`)) {
    if (element.hasAttribute(MARKER) || (app && app.contains(element))) continue
    if (element.matches('script[type="speculationrules"]') || isInjectedByProxy(element)) continue
    assets.push(element.getAttribute('src') ?? element.getAttribute('href') ?? element.textContent ?? '')
  }

  return assets
}

function isNavigableLink(link: HTMLAnchorElement): boolean {
  if (link.matches(EXCLUDED_LINKS)) return false

  const url = new URL(link.href, location.href)
  if (url.origin !== location.origin || /logout/i.test(url.pathname)) return false

  // A link to an anchor of the current page is left to the browser.
  return !(url.hash && url.pathname === location.pathname && url.search === location.search)
}

const withoutHash = (url: string): string => url.split('#')[0]

/** Vue's patch flag that turns its compiler optimisations off for a node (`PatchFlags.BAIL`). */
const BAIL = -2
/** Slot flag of slots that may change from one render to the next (`SlotFlags.DYNAMIC`). */
const DYNAMIC_SLOTS = 2

/**
 * Vue patches a compiled template against its previous render using the block tree the compiler
 * recorded, which assumes both renders come from the same template. Two pages are two templates:
 * every node the root template renders, slot content included, is marked to be compared in full.
 */
function bailOut(node: unknown): void {
  if (Array.isArray(node)) {
    node.forEach(bailOut)
    return
  }
  if (!node || typeof node !== 'object' || !('__v_isVNode' in node)) return

  const vnode = node as unknown as VNode & { dynamicChildren: VNode[] | null }
  vnode.patchFlag = BAIL
  vnode.dynamicChildren = null

  const children = vnode.children as unknown
  if (Array.isArray(children)) {
    children.forEach(bailOut)
  } else if (children && typeof children === 'object') {
    const slots = children as Record<string, unknown>
    for (const [name, slot] of Object.entries(slots)) {
      if (typeof slot !== 'function') continue
      slots[name] = (...args: unknown[]) => {
        const rendered = (slot as (...slotArgs: unknown[]) => unknown)(...args)
        bailOut(rendered)
        return rendered
      }
    }
    slots._ = DYNAMIC_SLOTS
  }
}

/**
 * Takes over link clicks for the app mounted on `container`, from the template it was mounted with.
 * Returns the template to mount the app with: its main content carries a key, so each page gets
 * fresh components while the shell around it is only patched.
 */
export function enableSwapNavigation(app: App, container: Element, options: { prefetch: boolean }): void {
  const root = app._component as { render?: RenderFunction, template?: string }
  if (root.render || root.template || !container.id) return

  let pageKey = 0
  const keyMain = (appElement: Element): void => {
    const content = appElement.querySelector(CONTENT) ?? appElement.firstElementChild
    content?.setAttribute('key', `prisme-page-${pageKey++}`)
  }

  // Without hoisting: static content compiled to a single HTML string is never patched in production.
  const compileTemplate = (template: string): RenderFunction => compile(template, {
    isCustomElement: app.config.isCustomElement,
    ...app.config.compilerOptions,
    hoistStatic: false,
  })

  keyMain(container)
  const current = shallowRef(compileTemplate(container.innerHTML))
  let cacheOwner = current.value

  // Delegates to the compiled template of the page shown. `_rc` makes Vue give it the proxy
  // runtime-compiled templates expect (`with (_ctx)`); the render cache holds the previous
  // template's handlers by index, so it is emptied when the template changes. The root only
  // renders again on a new page, so comparing in full costs nothing the rest of the time.
  const render = function (this: unknown, ...args: unknown[]) {
    if (current.value !== cacheOwner) {
      (args[1] as unknown[]).length = 0
      cacheOwner = current.value
    }
    const tree = (current.value as (...renderArgs: unknown[]) => unknown).apply(this, args)
    bailOut(tree)
    return tree
  } as RenderFunction & { _rc?: boolean }
  render._rc = true
  root.render = render

  let currentUrl = withoutHash(location.href)
  let controller: AbortController | null = null
  const prefetched = new Map<string, { page: Promise<FetchedPage | null>, at: number }>()

  history.scrollRestoration = 'manual'
  history.replaceState({ ...history.state, prisme: true } satisfies HistoryState, '')

  const fetchPage = async (url: string, signal?: AbortSignal): Promise<FetchedPage | null> => {
    const response = await fetch(url, {
      credentials: 'same-origin',
      headers: { Accept: 'text/html', 'X-Prisme-Navigation': '1' },
      signal,
    })
    const finalUrl = new URL(response.url || url)
    if (finalUrl.origin !== location.origin || !response.headers.get('content-type')?.includes('text/html')) return null

    const doc = new DOMParser().parseFromString(await response.text(), 'text/html')
    const appElement = doc.getElementById(container.id)
    if (!appElement) return null

    keyMain(appElement)

    return {
      url: finalUrl.href + (finalUrl.hash ? '' : new URL(url, location.href).hash),
      title: doc.title,
      template: appElement.innerHTML,
      assets: assetsOf(doc, appElement),
      csrfToken: doc.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? null,
    }
  }

  const takePrefetched = (url: string): Promise<FetchedPage | null> | null => {
    const entry = prefetched.get(withoutHash(url))
    prefetched.delete(withoutHash(url))
    return entry && Date.now() - entry.at < PREFETCH_TTL ? entry.page : null
  }

  const progress = progressBar()

  const navigate = async (url: string, mode: 'push' | 'pop', scrollY = 0): Promise<void> => {
    controller?.abort()
    controller = new AbortController()
    const signal = controller.signal
    const startedAt = performance.now()
    const stopProgress = progress.startAfter(150)

    let page: FetchedPage | null
    try {
      page = await (takePrefetched(url) ?? fetchPage(url, signal))
    } catch (error) {
      stopProgress()
      if (signal.aborted) return
      page = null
    }
    if (signal.aborted) return
    stopProgress()

    const currentAssets = new Set(assetsOf(document, container))
    if (!page || page.assets.some(asset => !currentAssets.has(asset))) {
      if (mode === 'pop') {
        location.replace(page?.url ?? url)
      } else {
        location.assign(page?.url ?? url)
      }
      return
    }

    if (mode === 'push') {
      history.replaceState({ ...history.state, prisme: true, scrollY: window.scrollY } satisfies HistoryState, '')
      history.pushState({ prisme: true } satisfies HistoryState, '', page.url)
    }
    currentUrl = withoutHash(page.url)

    await showPage(page, () => restoreScroll(mode === 'pop' ? scrollY : 0, new URL(page.url).hash))

    performance.measure?.('prisme:navigation', { start: startedAt, detail: { url: page.url } })
    console.debug(`[prisme] page affichee sans rechargement en ${Math.round(performance.now() - startedAt)} ms`)
  }

  const showPage = async (page: FetchedPage, afterRender: () => void): Promise<void> => {
    const swap = async (): Promise<void> => {
      current.value = compileTemplate(page.template)
      document.title = page.title
      if (page.csrfToken) document.querySelector('meta[name="csrf-token"]')?.setAttribute('content', page.csrfToken)
      await nextTick()
      afterRender()
    }

    const startViewTransition = (document as Document & { startViewTransition?: (update: () => Promise<void>) => { updateCallbackDone: Promise<void> } }).startViewTransition
    if (startViewTransition && document.head.querySelector(`style[${MARKER}="transitions"]`) && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      await startViewTransition.call(document, swap).updateCallbackDone
    } else {
      await swap()
    }

    announce(container, page.title)
  }

  const listeners = new AbortController()
  const listen = { signal: listeners.signal }
  app.onUnmount(() => listeners.abort())

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

    const link = (event.target as Element | null)?.closest?.('a[href]')
    if (!(link instanceof HTMLAnchorElement) || !isNavigableLink(link)) return

    event.preventDefault()
    void navigate(link.href, 'push')
  }, listen)

  window.addEventListener('popstate', (event) => {
    const state = event.state as HistoryState | null
    if (!state?.prisme || withoutHash(location.href) === currentUrl) return
    void navigate(location.href, 'pop', state.scrollY ?? 0)
  }, listen)

  if (!options.prefetch) return

  // Hover prefetch that works in every browser (Speculation Rules would load pages a swap never uses).
  let hoverTimer: ReturnType<typeof setTimeout> | undefined
  document.addEventListener('pointerover', (event) => {
    const link = (event.target as Element | null)?.closest?.('a[href]')
    if (!(link instanceof HTMLAnchorElement) || link.matches('[data-no-prefetch], [data-no-prefetch] a') || !isNavigableLink(link)) return

    clearTimeout(hoverTimer)
    hoverTimer = setTimeout(() => {
      const url = withoutHash(link.href)
      const entry = prefetched.get(url)
      if (url === currentUrl || (entry && Date.now() - entry.at < PREFETCH_TTL)) return
      prefetched.set(url, { page: fetchPage(link.href).catch(() => null), at: Date.now() })
    }, HOVER_DELAY)
  }, listen)
  document.addEventListener('pointerout', () => clearTimeout(hoverTimer), listen)
}

function restoreScroll(scrollY: number, hash: string): void {
  const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
  if (target) {
    target.scrollIntoView()
  } else {
    window.scrollTo(0, scrollY)
  }
}

/** Screen readers hear the new page's title, and keyboard focus restarts at the content. */
function announce(container: Element, title: string): void {
  const main = container.querySelector<HTMLElement>(CONTENT)
  if (main) {
    if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1')
    main.focus({ preventScroll: true })
  }

  let region = document.querySelector<HTMLElement>(`[${MARKER}="announcer"]`)
  if (!region) {
    region = document.createElement('div')
    region.setAttribute(MARKER, 'announcer')
    region.setAttribute('aria-live', 'polite')
    region.setAttribute('role', 'status')
    region.style.cssText = 'position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap'
    document.body.append(region)
  }
  region.textContent = title
}

/** A thin bar at the top of the window when a page takes a while to come. */
function progressBar(): { startAfter: (delay: number) => () => void } {
  return {
    startAfter(delay) {
      let bar: HTMLElement | null = null
      const timer = setTimeout(() => {
        bar = document.createElement('div')
        bar.setAttribute(MARKER, 'progress')
        bar.setAttribute('aria-hidden', 'true')
        bar.style.cssText = 'position:fixed;inset:0 auto auto 0;z-index:1000;height:3px;width:30%;background:var(--pr-color-primary, #1d4ed8);transition:width 8s cubic-bezier(.1,.7,.1,1)'
        document.body.append(bar)
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
        requestAnimationFrame(() => requestAnimationFrame(() => { if (bar) bar.style.width = '90%' }))
      }, delay)

      return () => {
        clearTimeout(timer)
        bar?.remove()
      }
    },
  }
}
