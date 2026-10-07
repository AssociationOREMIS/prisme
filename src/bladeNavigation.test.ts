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

// Forms: sent with fetch the browser's way, the page Laravel redirects to swapped in like a link.

interface Answer { html?: string, type?: string, status?: number, redirectTo?: string, headers?: Record<string, string> }

/** A server that answers by method and path, following redirects like fetch does. */
function stubFormServer(routes: Record<string, Answer>) {
  const fetchMock = vi.fn(async (url: string, init: RequestInit = {}) => {
    const method = init.method ?? 'GET'
    let path = new URL(url, location.href).pathname
    let answer = routes[`${method} ${path}`]
    let redirected = false
    while (answer?.redirectTo) {
      path = answer.redirectTo
      answer = routes[`GET ${path}`]
      redirected = true
    }
    const response = new Response(answer?.html ?? 'not found', {
      status: answer?.status ?? (answer ? 200 : 404),
      headers: { 'content-type': answer?.type ?? 'text/html', ...answer?.headers },
    })
    const finalUrl = redirected ? new URL(path, location.href).href : new URL(url, location.href).href
    Object.defineProperty(response, 'url', { value: finalUrl })
    Object.defineProperty(response, 'redirected', { value: redirected })
    return response
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

function submit(selector: string) {
  const button = document.querySelector<HTMLButtonElement>(selector)!
  button.form!.requestSubmit(button)
}

const regionForm = `<h1>Nouvelle region</h1>
  <form method="POST" action="/regions">
    <input type="hidden" name="_token" value="csrf-1">
    <input name="name" value="Bretagne">
    <button id="save" name="intent" value="save">Enregistrer</button>
  </form>`

describe("registerPrisme navigation: 'swap', forms", () => {
  it('sends the form and shows the page it redirects to, keeping the shell', async () => {
    const fetchMock = stubFormServer({
      'POST /regions': { redirectTo: '/regions/1' },
      'GET /regions/1': { html: pageHtml('Bretagne', '<h1>Bretagne</h1><p class="toast">Region creee</p>') },
    })
    mountFirstPage(regionForm)
    document.querySelector<HTMLButtonElement>('.shell')!.click()
    history.replaceState(history.state, '', '/regions/create')

    submit('#save')
    await settle()

    const [, init] = fetchMock.mock.calls[0]
    expect(init.method).toBe('POST')
    const body = init.body as FormData
    expect(Object.fromEntries(body)).toEqual({ _token: 'csrf-1', name: 'Bretagne', intent: 'save' })
    expect(document.querySelector('main h1')?.textContent).toBe('Bretagne')
    expect(document.querySelector('.toast')?.textContent).toBe('Region creee')
    expect(location.pathname).toBe('/regions/1')
    expect(document.title).toBe('Bretagne')
    expect(mountedShells).toBe(1)
    expect(document.querySelector('.shell')?.textContent).toBe('1')
  })

  it('shows the errors of a failed validation on the same page, without a new history entry', async () => {
    stubFormServer({
      'POST /regions': { redirectTo: '/regions/create' },
      'GET /regions/create': { html: pageHtml('Nouvelle region', '<h1>Nouvelle region</h1><input id="name" aria-invalid="true" value=""><p>Le nom est obligatoire.</p>') },
    })
    history.replaceState(null, '', '/regions/create')
    mountFirstPage(regionForm)
    const entries = history.length

    submit('#save')
    await settle()

    expect(document.querySelector('main p')?.textContent).toBe('Le nom est obligatoire.')
    expect(location.pathname).toBe('/regions/create')
    expect(history.length).toBe(entries)
    expect(document.activeElement?.id).toBe('name')
  })

  it('sends a GET form as a link to its address with the fields in the query', async () => {
    const fetchMock = stubFormServer({ 'GET /users': { html: pageHtml('Utilisateurs', '<h1>Resultats</h1>') } })
    mountFirstPage('<form action="/users?page=3"><input name="q" value="camille martin"><input name="role" value="admin"><button id="search">Chercher</button></form>')

    submit('#search')
    await settle()

    expect(fetchMock.mock.calls[0][0]).toBe(`${location.origin}/users?q=camille+martin&role=admin`)
    expect(document.querySelector('main h1')?.textContent).toBe('Resultats')
    expect(location.search).toBe('?q=camille+martin&role=admin')
  })

  it('sends a form only once on a double click', async () => {
    const fetchMock = stubFormServer({
      'POST /regions': { redirectTo: '/regions/1' },
      'GET /regions/1': { html: pageHtml('Bretagne', '<h1>Bretagne</h1>') },
    })
    mountFirstPage(regionForm)

    submit('#save')
    submit('#save')
    await settle()

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('leaves to the browser the forms prevented, opted out, opened elsewhere or sent to another site', () => {
    const fetchMock = stubFormServer({})
    mountFirstPage(`
      <form id="refused" method="POST" action="/regions/1" onsubmit="return false"><button>Supprimer</button></form>
      <form id="opted-out" method="POST" action="/regions" data-prisme-reload><button>Envoyer</button></form>
      <form id="blank" method="POST" action="/export" target="_blank"><button>Exporter</button></form>
      <form id="external" method="POST" action="https://sso.example.org/login"><button>SSO</button></form>
      <form id="logout" method="POST" action="/logout"><button>Se deconnecter</button></form>`)

    for (const id of ['opted-out', 'blank', 'external', 'logout']) {
      const event = new SubmitEvent('submit', { bubbles: true, cancelable: true })
      document.getElementById(id)!.dispatchEvent(event)
      expect(event.defaultPrevented, id).toBe(false)
    }
    // Its own handler refused it: Prisme does not send it either.
    document.querySelector<HTMLButtonElement>('#refused button')!.click()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('saves a file the form answers with, without leaving the page', async () => {
    stubFormServer({
      'POST /export': { html: 'nom\nBretagne', type: 'text/csv', headers: { 'content-disposition': 'attachment; filename="regions.csv"' } },
    })
    const createObjectURL = vi.fn(() => 'blob:regions')
    vi.stubGlobal('URL', Object.assign(URL, { createObjectURL, revokeObjectURL: vi.fn() }))
    const saved: string[] = []
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) { saved.push(this.download) })
    mountFirstPage('<h1>Regions</h1><form method="POST" action="/export"><button id="export">Exporter</button></form>')

    submit('#export')
    await settle()

    expect(saved).toEqual(['regions.csv'])
    expect(document.querySelector('main h1')?.textContent).toBe('Regions')
    expect(location.pathname).toBe('/')
  })

  it('shows as it came an error page answering the form, without sending it again', async () => {
    const fetchMock = stubFormServer({
      'POST /regions': { status: 419, html: '<!doctype html><html><head><title>Page expiree</title></head><body><h1>419</h1></body></html>' },
    })
    mountFirstPage(regionForm)

    submit('#save')
    await settle()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(document.title).toBe('Page expiree')
    expect(document.querySelector('h1')?.textContent).toBe('419')
  })
})
