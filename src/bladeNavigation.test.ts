// @vitest-environment jsdom
import { createApp, defineComponent, h, nextTick, ref, type App } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { registerPrisme } from './blade'

// navigation: 'swap' (the default) replaces the page's #app without reloading: the shell keeps its components
// (and their state), the main content is rebuilt, and anything unusual falls back to a page load.

let mountedShells = 0
let mountedApp: App | null = null

/** Stands for the sidebar: counts its mounts and keeps a local state. */
const ShellCounter = defineComponent({
  props: { active: { type: String, default: '' } },
  setup(props) {
    mountedShells++
    const clicks = ref(0)
    return () => h('button', { class: 'shell', 'data-active': props.active, onClick: () => clicks.value++ }, String(clicks.value))
  },
})

function pageHtml(title: string, content: string, extra = ''): string {
  return `<!doctype html><html><head><title>${title}</title></head><body>
    <div id="app" v-cloak><div class="pr-shell-grid">
      <shell-counter active="${title}"></shell-counter>
      <main class="pr-shell-grid__content">${content}</main>
    </div></div>${extra}</body></html>`
}

function stubServer(pages: Record<string, { html: string, type?: string }>) {
  const fetchMock = vi.fn(async (url: string) => {
    const page = pages[new URL(url, location.href).pathname]
    return new Response(page?.html ?? 'not found', { status: page ? 200 : 404, headers: { 'content-type': page?.type ?? 'text/html' } })
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

function mountFirstPage(content: string) {
  document.title = 'Accueil'
  document.body.innerHTML = new DOMParser().parseFromString(pageHtml('Accueil', content), 'text/html').body.innerHTML
  const app = createApp({})
  app.component('ShellCounter', ShellCounter)
  registerPrisme(app, { navigation: 'swap', prefetch: false, preload: false, transitions: false, measure: false })
  app.mount('#app')
  mountedApp = app
  return app
}

function click(selector: string, init: MouseEventInit = {}) {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, ...init })
  document.querySelector(selector)!.dispatchEvent(event)
  return event
}

async function settle() {
  for (let i = 0; i < 5; i++) {
    await new Promise(resolve => setTimeout(resolve, 0))
    await nextTick()
  }
}

beforeEach(() => {
  mountedShells = 0
  history.replaceState(null, '', '/')
  vi.spyOn(console, 'debug').mockImplementation(() => undefined)
  vi.stubGlobal('matchMedia', () => ({ matches: false }))
})

afterEach(() => {
  mountedApp?.unmount()
  mountedApp = null
  document.body.innerHTML = ''
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe("registerPrisme navigation: 'swap'", () => {
  it('shows the next page without reloading, keeping the shell and its state', async () => {
    stubServer({ '/users': { html: pageHtml('Benevoles', '<h1>Liste</h1>') } })
    mountFirstPage('<h1>Accueil</h1><a id="to-users" href="/users">Benevoles</a>')

    document.querySelector<HTMLButtonElement>('.shell')!.click()
    await nextTick()
    const event = click('#to-users')
    await settle()

    expect(event.defaultPrevented).toBe(true)
    expect(document.querySelector('main h1')?.textContent).toBe('Liste')
    expect(document.title).toBe('Benevoles')
    expect(location.pathname).toBe('/users')
    expect(mountedShells).toBe(1)
    expect(document.querySelector('.shell')?.textContent).toBe('1')
    expect(document.querySelector('.shell')?.getAttribute('data-active')).toBe('Benevoles')
  })

  it('rebuilds the main content, so a component there never keeps the previous page state', async () => {
    let mountedFields = 0
    stubServer({ '/next': { html: pageHtml('Suite', '<page-field></page-field>') } })
    document.body.innerHTML = new DOMParser().parseFromString(pageHtml('Accueil', '<page-field></page-field><a id="next" href="/next">Suite</a>'), 'text/html').body.innerHTML
    const app = createApp({})
    app.component('ShellCounter', ShellCounter)
    app.component('PageField', defineComponent({ setup: () => { mountedFields++; return () => h('input') } }))
    registerPrisme(app, { navigation: 'swap', prefetch: false, preload: false, transitions: false, measure: false })
    app.mount('#app')
    mountedApp = app

    click('#next')
    await settle()

    expect(mountedFields).toBe(2)
    expect(mountedShells).toBe(1)
  })

  it('goes back to the previous page with the back button', async () => {
    stubServer({
      '/': { html: pageHtml('Accueil', '<h1>Accueil</h1><a id="to-users" href="/users">Benevoles</a>') },
      '/users': { html: pageHtml('Benevoles', '<h1>Liste</h1>') },
    })
    mountFirstPage('<h1>Accueil</h1><a id="to-users" href="/users">Benevoles</a>')

    click('#to-users')
    await settle()
    history.back()
    await settle()

    expect(location.pathname).toBe('/')
    expect(document.querySelector('main h1')?.textContent).toBe('Accueil')
    expect(mountedShells).toBe(1)
  })

  it('leaves external, download, new tab, opted-out and modified clicks to the browser', () => {
    const fetchMock = stubServer({})
    mountFirstPage(`
      <a id="external" href="https://example.org/">Ailleurs</a>
      <a id="download" href="/export.csv" download>Export</a>
      <a id="blank" href="/users" target="_blank">Nouvel onglet</a>
      <a id="reload" href="/map" data-prisme-reload>Carte</a>
      <a id="logout" href="/logout">Quitter</a>
      <a id="plain" href="/users">Benevoles</a>`)

    for (const id of ['external', 'download', 'blank', 'reload', 'logout']) {
      const event = click(`#${id}`)
      expect(event.defaultPrevented, id).toBe(false)
      event.preventDefault()
    }
    const withCtrl = click('#plain', { ctrlKey: true })
    expect(withCtrl.defaultPrevented).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('loads the page normally when it brings other scripts, or is not HTML', async () => {
    stubServer({
      '/map': { html: pageHtml('Carte', '<h1>Carte</h1>', '<script src="/map.js"></script>') },
      '/export': { html: 'a,b', type: 'text/csv' },
    })
    mountFirstPage('<h1>Accueil</h1><a id="map" href="/map">Carte</a><a id="export" href="/export">Export</a>')

    click('#map')
    await settle()
    click('#export')
    await settle()

    // jsdom cannot navigate: the page simply stays as it was, without a pushed history entry.
    expect(document.querySelector('main h1')?.textContent).toBe('Accueil')
    expect(location.pathname).toBe('/')
  })

  it('ignores the scripts Cloudflare adds to every response, different each time', async () => {
    const cloudflare = (ray: string) =>
      `<script src="/cdn-cgi/scripts/7d0fa10a/cloudflare-static/rocket-loader.min.js" data-cf-settings="${ray}-|49" defer></script>`
      + `<script>(function(){var d="window.__CF$cv$params={r:'${ray}'};a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js'"})();</script>`
    stubServer({ '/regions': { html: pageHtml('Regions', '<h1>Regions</h1>', cloudflare('a46dfa28ce96e244')) } })
    mountFirstPage('<h1>Accueil</h1><a id="regions" href="/regions">Regions</a>')
    document.body.insertAdjacentHTML('beforeend', cloudflare('a46dfa27d93de15a'))

    click('#regions')
    await settle()

    expect(document.querySelector('main h1')?.textContent).toBe('Regions')
    expect(location.pathname).toBe('/regions')
  })

  it('is on by default, and can be turned off in one browser through localStorage', async () => {
    const mountWithoutOption = () => {
      document.body.innerHTML = new DOMParser().parseFromString(pageHtml('Accueil', '<a id="to-users" href="/users">Benevoles</a>'), 'text/html').body.innerHTML
      const app = createApp({})
      app.component('ShellCounter', ShellCounter)
      registerPrisme(app, { prefetch: false, preload: false, transitions: false, measure: false })
      app.mount('#app')
      mountedApp = app
    }
    stubServer({ '/users': { html: pageHtml('Benevoles', '<h1>Liste</h1>') } })

    mountWithoutOption()
    expect(click('#to-users').defaultPrevented).toBe(true)
    await settle()
    expect(document.querySelector('main h1')?.textContent).toBe('Liste')

    mountedApp?.unmount()
    vi.stubGlobal('localStorage', { getItem: (key: string) => (key === 'prisme:navigation' ? 'off' : null) })
    mountWithoutOption()
    const event = click('#to-users')
    expect(event.defaultPrevented).toBe(false)
    event.preventDefault()
  })

  it('rebuilds the content of a layout whose content is not a <main>', async () => {
    let mountedFields = 0
    const layout = (content: string) => `<!doctype html><html><head><title>Forge</title></head><body>
      <div id="app"><div class="pr-shell-grid"><shell-counter></shell-counter>
      <div class="pr-shell-grid__content">${content}</div></div></div></body></html>`
    stubServer({ '/next': { html: layout('<page-field></page-field>') } })
    document.body.innerHTML = new DOMParser().parseFromString(layout('<page-field></page-field><a id="next" href="/next">Suite</a>'), 'text/html').body.innerHTML
    const app = createApp({})
    app.component('ShellCounter', ShellCounter)
    app.component('PageField', defineComponent({ setup: () => { mountedFields++; return () => h('input') } }))
    registerPrisme(app, { navigation: 'swap', prefetch: false, preload: false, transitions: false, measure: false })
    app.mount('#app')
    mountedApp = app

    click('#next')
    await settle()

    expect(mountedFields).toBe(2)
    expect(mountedShells).toBe(1)
  })

  it('announces the new page and moves focus to its content', async () => {
    stubServer({ '/users': { html: pageHtml('Benevoles', '<h1>Liste</h1>') } })
    mountFirstPage('<a id="to-users" href="/users">Benevoles</a>')

    click('#to-users')
    await settle()

    expect(document.querySelector('[data-prisme="announcer"]')?.textContent).toBe('Benevoles')
    expect(document.activeElement).toBe(document.querySelector('main'))
  })
})
