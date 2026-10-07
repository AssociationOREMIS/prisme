import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import { PrButton } from '../../components/atoms/Button'
import '../stories.css'

// Prisme's classes live in the `components` cascade layer: an app's Tailwind utilities (layer
// `utilities`) win over them, as in an app where `hidden md:flex` must show the element.
const APP_UTILITIES = `@layer utilities {
  .app-flex { display: flex; }
  .app-wide { width: 20rem; }
}`

const meta = {
  title: 'Foundations/Layers',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// noinspection JSUnusedGlobalSymbols
export const AppUtilitiesWin: Story = {
  render: () => ({
    components: { PrButton },
    setup() {
      return { css: APP_UTILITIES }
    },
    template: `
      <div>
        <component is="style">{{ css }}</component>
        <div data-testid="shown" class="hidden app-flex">Visible</div>
        <PrButton class="app-wide">Large</PrButton>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(getComputedStyle(canvas.getByTestId('shown')).display).toBe('flex')
    await expect(canvas.getByRole('button', { name: 'Large' }).getBoundingClientRect().width).toBeCloseTo(320, 0)
  },
}
