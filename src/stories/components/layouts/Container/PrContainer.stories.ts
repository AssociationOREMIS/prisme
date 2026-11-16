import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrContainer } from '../../../../components/layouts/Container'
import '../../../stories.css'

const meta = {
  title: 'Layout/Container',
  component: PrContainer,
  tags: ['autodocs'],
  parameters: {
    prLayout: 'fullscreen',
  },
  argTypes: {
    width: { control: 'select', options: ['full', 'wide', 'narrow'] },
  },
  args: {
    width: 'full',
    as: 'div',
  },
} satisfies Meta<typeof PrContainer>

export default meta
type Story = StoryObj<typeof meta>

const box = 'padding: var(--pr-space-4); border: 1px dashed var(--pr-color-border-strong); border-radius: var(--pr-radius-md);'

// Side gutters of 2.5rem (1rem below 780px); `wide` and `narrow` also stop and center the content.
export const Widths: Story = {
  render: () => ({
    components: { PrContainer },
    template: `
      <div style="display: grid; gap: var(--pr-space-4); padding-block: var(--pr-space-6);">
        <PrContainer><div style="${box}">full : toute la largeur, avec les marges latérales.</div></PrContainer>
        <PrContainer width="wide"><div style="${box}">wide : 80rem au plus, centré.</div></PrContainer>
        <PrContainer width="narrow"><div style="${box}">narrow : 48rem au plus, pour un texte à lire.</div></PrContainer>
      </div>
    `,
  }),
}

export const Playground: Story = {
  render: (args) => ({
    components: { PrContainer },
    setup: () => ({ args }),
    template: `<PrContainer v-bind="args"><div style="${box}">Contenu de la page</div></PrContainer>`,
  }),
}
