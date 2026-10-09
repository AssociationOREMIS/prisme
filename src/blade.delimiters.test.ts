// @vitest-environment jsdom
import { createApp } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { registerPrisme } from './blade'

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

// A Blade page as the browser gets it: Blade escaped the comment typed by someone, but `{{ }}`
// is plain text for Blade and still reaches Vue's compiler.
function mountPage(delimiters?: [string, string]) {
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  document.body.innerHTML = '<div id="app"><p id="typed">{{ 6 * 7 }}</p><p id="own">[[% 6 * 7 %]]</p></div>'
  const app = createApp({})
  registerPrisme(app, { delimiters, prefetch: false, preload: false, transitions: false, measure: false, navigation: false })
  app.mount('#app')
  return { typed: document.getElementById('typed')!.textContent, own: document.getElementById('own')!.textContent }
}

describe('registerPrisme delimiters', () => {
  it('runs {{ }} typed by someone by default', () => {
    expect(mountPage().typed).toBe('42')
  })

  it('leaves it as text with other delimiters, which the page uses instead', () => {
    const page = mountPage(['[[%', '%]]'])

    expect(page.typed).toBe('{{ 6 * 7 }}')
    expect(page.own).toBe('42')
  })
})
