import { createApp, type App, type Component } from 'vue'
import type { PrResolvedTheme } from './usePrTheme'

/**
 * - `'light'`/`'dark'`: fixed theme, whatever the host page does.
 * - `'document'`: mirrors `<html data-pr-theme>` (what `usePrTheme()` and
 *   `getPrThemeInitScript()` set) and follows its changes, so the isolated
 *   component switches theme along with a Prisme host page. Without that
 *   attribute on `<html>`, it follows the OS/browser preference.
 */
export type PrIsolatedTheme = PrResolvedTheme | 'document'

export interface PrIsolatedMountOptions {
  /** Props passed to the mounted component. */
  props?: Record<string, unknown>
  /**
   * CSS text injected into the shadow root, e.g. from
   * `import styles from '@oremis/prisme/styles.css?inline'` (Vite). Omit it
   * only if the component genuinely needs no Prisme styling.
   *
   * Only this CSS reaches the shadow root. In a library/embed build, the
   * `<style>` blocks of your own SFCs are emitted as a separate stylesheet
   * that is never injected there: pass their CSS here too, e.g.
   * `` `${prismeStyles}\n${myStyles}` `` with `myStyles` from
   * `import myStyles from './my-component.css?inline'`.
   */
  styles?: string
  /**
   * Theme of the mounted component. `<html data-pr-theme>` is invisible from
   * inside a shadow root, so the theme is set as `data-pr-theme` on `target`
   * (the shadow host) instead. Omitted, `target`'s attribute is left as is:
   * set it yourself, or leave it out to follow the OS/browser preference.
   */
  theme?: PrIsolatedTheme
}

export interface PrIsolatedMountResult {
  app: App
  shadowRoot: ShadowRoot
  unmount: () => void
}

/**
 * Mounts a Vue component inside a shadow root attached to `target`, instead
 * of directly into the host document.
 *
 * `@oremis/prisme/styles.css` ships an unprefixed Tailwind reset: mounted
 * the normal way (a plain `createApp(...).mount(target)`) inside a page
 * built on another CSS framework (Bootstrap, etc.), that reset applies to
 * the whole page, not just the mounted component, and can silently break
 * unrelated elements elsewhere on the same page. Mounting inside a shadow
 * root confines Prisme's styles (passed via `options.styles`) to the
 * component itself, and also stops the host page's own CSS from leaking in.
 *
 * A component that accepts a `name` prop to render its own hidden `<input>`
 * for native form submission (`PrRichTextEditor`, `PrCombobox`, `PrTagInput`)
 * should not be given that prop here: an input inside a shadow tree isn't
 * included in the ancestor `<form>`'s native submission. Keep a real hidden
 * input in the light DOM instead, and sync it yourself (`v-model`/a
 * callback) rather than relying on the component's own hidden input.
 */
export function mountPrismeIsolated(
  component: Component,
  target: Element,
  options: PrIsolatedMountOptions = {}
): PrIsolatedMountResult {
  const shadowRoot = target.attachShadow({ mode: 'open' })
  const stopThemeSync = applyHostTheme(target, options.theme)

  if (options.styles) {
    const style = document.createElement('style')
    style.textContent = options.styles
    shadowRoot.appendChild(style)
  }

  const mountPoint = document.createElement('div')
  shadowRoot.appendChild(mountPoint)

  const app = createApp(component, options.props)
  app.mount(mountPoint)

  return {
    app,
    shadowRoot,
    unmount: () => {
      stopThemeSync()
      app.unmount()
    },
  }
}

const THEME_ATTRIBUTE = 'data-pr-theme'

/** Returns a function that stops following `<html>` (a no-op for a fixed theme). */
function applyHostTheme(target: Element, theme: PrIsolatedTheme | undefined): () => void {
  if (theme === undefined) {
    return () => {}
  }

  if (theme !== 'document') {
    target.setAttribute(THEME_ATTRIBUTE, theme)
    return () => {}
  }

  const root = document.documentElement
  const mirror = () => {
    const value = root.getAttribute(THEME_ATTRIBUTE)
    if (value === null) {
      target.removeAttribute(THEME_ATTRIBUTE)
    } else {
      target.setAttribute(THEME_ATTRIBUTE, value)
    }
  }

  mirror()
  const observer = new MutationObserver(mirror)
  observer.observe(root, { attributes: true, attributeFilter: [THEME_ATTRIBUTE] })

  return () => observer.disconnect()
}
