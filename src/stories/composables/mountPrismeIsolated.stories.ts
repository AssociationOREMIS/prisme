import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, waitFor } from 'storybook/test'
import { defineComponent, h, onBeforeUnmount, onMounted, ref, type PropType } from 'vue'
import { PrButton } from '../../components/atoms/Button'
import { mountPrismeIsolated, type PrIsolatedTheme } from '../../composables/mountPrismeIsolated'
import prismeStyles from '../../styles/prisme.css?inline'

const IsolatedDemo = defineComponent({
  setup: () => () =>
    h('div', { style: 'display: flex; gap: var(--pr-space-3); padding: var(--pr-space-4); background: var(--pr-color-surface)' }, [
      h(PrButton, null, () => 'Devenir bénévole'),
      h(PrButton, { variant: 'secondary' }, () => 'Voir les missions'),
    ]),
})

/**
 * Mounts `IsolatedDemo` with mountPrismeIsolated() inside a blank iframe:
 * Storybook's own page loads Prisme's CSS globally, and custom properties
 * inherit through a shadow boundary, so a shadow root mounted directly in
 * this page would get the tokens from the page even if `styles` didn't
 * define them on `:host`. The iframe's document has no Prisme CSS at all.
 */
const IsolatedFrame = defineComponent({
  props: {
    theme: { type: String as PropType<PrIsolatedTheme>, required: true },
  },
  setup(props) {
    const iframe = ref<HTMLIFrameElement>()
    let unmount: (() => void) | undefined

    onMounted(() => {
      iframe.value!.addEventListener('load', () => {
        const frameDocument = iframe.value!.contentDocument!
        const host = frameDocument.createElement('div')
        host.dataset.testid = 'isolated-host'
        frameDocument.body.appendChild(host)
        unmount = mountPrismeIsolated(IsolatedDemo, host, { styles: prismeStyles, theme: props.theme }).unmount
      }, { once: true })
      iframe.value!.srcdoc = '<!doctype html><html><body style="margin: 0"></body></html>'
    })
    onBeforeUnmount(() => unmount?.())

    return () =>
      h('iframe', {
        ref: iframe,
        title: `Thème ${props.theme}`,
        style: 'width: 22rem; height: 5rem; border: 1px dashed var(--pr-color-border)',
      })
  },
})

const meta = {
  title: 'Composables/mountPrismeIsolated',
  component: IsolatedFrame,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Monte un composant Prisme dans un shadow DOM, isolé du CSS de la page hôte. Les tokens sont déclarés sur `:host` et l'option `theme` pose `data-pr-theme` sur l'élément hôte.",
      },
    },
  },
} satisfies Meta<typeof IsolatedFrame>

export default meta
type Story = StoryObj<typeof meta>

function findShadowButton(canvasElement: HTMLElement) {
  const frame = canvasElement.querySelector('iframe')
  const host = frame?.contentDocument?.querySelector<HTMLElement>('[data-testid="isolated-host"]')
  const button = host?.shadowRoot?.querySelector('button')
  if (!host || !button) throw new Error('Isolated component not mounted yet')
  return { host, button, view: frame!.contentWindow! }
}

export const Light: Story = {
  args: { theme: 'light' },
  play: async ({ canvasElement }) => {
    const { host, button, view } = await waitFor(() => findShadowButton(canvasElement))
    const hostStyle = view.getComputedStyle(host)

    await expect(host).toHaveAttribute('data-pr-theme', 'light')
    // Primitive tokens (tokens.css) and semantic ones (themes.css) both resolve on :host.
    await expect(hostStyle.getPropertyValue('--pr-space-4').trim()).not.toBe('')
    await expect(hostStyle.getPropertyValue('--pr-color-primary').trim()).toBe('#08619f')
    // ...and actually reach the components: the primary button is painted.
    await expect(view.getComputedStyle(button).backgroundColor).toBe('rgb(8, 97, 159)')
    // Tailwind's @property defaults work in the shadow root too: the secondary button keeps its
    // border (border-style came out empty, so no border, before they were copied to the document).
    const secondary = host.shadowRoot!.querySelectorAll('button')[1]
    await expect(view.getComputedStyle(secondary).borderTopStyle).toBe('solid')
    await expect(view.getComputedStyle(secondary).borderTopWidth).toBe('1px')
  },
}

export const Dark: Story = {
  args: { theme: 'dark' },
  play: async ({ canvasElement }) => {
    const { host, button, view } = await waitFor(() => findShadowButton(canvasElement))

    await expect(host).toHaveAttribute('data-pr-theme', 'dark')
    await expect(view.getComputedStyle(host).getPropertyValue('--pr-color-primary').trim()).toBe('#fafaff')
    await expect(view.getComputedStyle(button).backgroundColor).toBe('rgb(250, 250, 255)')
  },
}
