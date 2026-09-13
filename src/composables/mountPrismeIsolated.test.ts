// @vitest-environment jsdom
//
// Needs a real DOM (attachShadow, document.body) that the rest of Prisme's
// unit tests (plain `environment: 'node'`) don't require.
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { mountPrismeIsolated } from './mountPrismeIsolated'

describe('mountPrismeIsolated', () => {
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
})
