// @vitest-environment jsdom
//
// Needs a real DOM (attachShadow, document.body) that the rest of Prisme's
// unit tests (plain `environment: 'node'`) don't require.
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { mountPrismeIsolated } from './mountPrismeIsolated'

describe('mountPrismeIsolated', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-pr-theme')
    document.body.innerHTML = ''
  })

  it('mounts the component inside a shadow root attached to the target', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const Hello = defineComponent({
      props: { name: { type: String, required: true } },
      setup: (props) => () => h('p', `Hello ${props.name}`),
    })

    const { shadowRoot } = mountPrismeIsolated(Hello, target, {
      props: { name: 'Prisme' },
    })

    expect(target.shadowRoot).toBe(shadowRoot)
    expect(shadowRoot.textContent).toContain('Hello Prisme')
  })

  it('injects the given styles into the shadow root, not the document', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const Empty = defineComponent({ setup: () => () => h('div') })

    const { shadowRoot } = mountPrismeIsolated(Empty, target, {
      styles: '.pr-marker { color: red; }',
    })

    const styleTag = shadowRoot.querySelector('style')
    expect(styleTag?.textContent).toContain('.pr-marker')
    expect(document.head.innerHTML).not.toContain('.pr-marker')
  })

  it('does not inject a style tag when no styles are given', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const Empty = defineComponent({ setup: () => () => h('div') })

    const { shadowRoot } = mountPrismeIsolated(Empty, target)

    expect(shadowRoot.querySelector('style')).toBeNull()
  })

  it('unmount() tears down the mounted app', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const Hello = defineComponent({ setup: () => () => h('p', 'Hi') })

    const { shadowRoot, unmount } = mountPrismeIsolated(Hello, target)
    expect(shadowRoot.textContent).toContain('Hi')

    unmount()
    expect(shadowRoot.textContent).not.toContain('Hi')
  })

  describe('theme option', () => {
    const Empty = defineComponent({ setup: () => () => h('div') })

    // MutationObserver callbacks run as a microtask.
    const flushObservers = () => new Promise(resolve => setTimeout(resolve))

    it('leaves the host attribute untouched when omitted', () => {
      const target = document.createElement('div')
      target.dataset.prTheme = 'light'
      document.documentElement.dataset.prTheme = 'dark'

      mountPrismeIsolated(Empty, target)

      expect(target.dataset.prTheme).toBe('light')
    })

    it('sets a fixed theme on the host, ignoring <html>', async () => {
      const target = document.createElement('div')
      document.documentElement.dataset.prTheme = 'light'

      mountPrismeIsolated(Empty, target, { theme: 'dark' })
      expect(target.dataset.prTheme).toBe('dark')

      document.documentElement.dataset.prTheme = 'light'
      await flushObservers()
      expect(target.dataset.prTheme).toBe('dark')
    })

    it("'document' mirrors <html data-pr-theme> and follows its changes", async () => {
      const target = document.createElement('div')
      document.documentElement.dataset.prTheme = 'dark'

      mountPrismeIsolated(Empty, target, { theme: 'document' })
      expect(target.dataset.prTheme).toBe('dark')

      document.documentElement.dataset.prTheme = 'light'
      await flushObservers()
      expect(target.dataset.prTheme).toBe('light')

      document.documentElement.removeAttribute('data-pr-theme')
      await flushObservers()
      expect(target.hasAttribute('data-pr-theme')).toBe(false)
    })

    it("'document' stops following <html> after unmount()", async () => {
      const target = document.createElement('div')
      document.documentElement.dataset.prTheme = 'light'

      const { unmount } = mountPrismeIsolated(Empty, target, { theme: 'document' })
      unmount()

      document.documentElement.dataset.prTheme = 'dark'
      await flushObservers()
      expect(target.dataset.prTheme).toBe('light')
    })
  })
})
