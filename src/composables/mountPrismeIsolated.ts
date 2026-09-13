import { createApp, type App, type Component } from 'vue'

export interface PrIsolatedMountOptions {
  /** Props passed to the mounted component. */
  props?: Record<string, unknown>
  /**
   * CSS text injected into the shadow root, e.g. from
   * `import styles from '@oremis/prisme/styles.css?inline'` (Vite). Omit it
   * only if the component genuinely needs no Prisme styling.
   */
  styles?: string
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
    unmount: () => app.unmount(),
  }
}
