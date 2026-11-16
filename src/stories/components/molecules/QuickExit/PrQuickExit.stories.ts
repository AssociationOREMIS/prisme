import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import { PrQuickExit } from '../../../../components/molecules/QuickExit'
import '../../../stories.css'

const meta = {
  title: 'Actions/QuickExit',
  component: PrQuickExit,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Bouton « Quitter vite » pour une personne victime qui craint d\'être vue : il remplace la page par une page neutre (la météo), sans retour possible avec Précédent. Appuyer deux fois sur Échap en moins d\'une seconde fait de même, n\'importe où dans la page. Attention : dans cette documentation, le bouton et le raccourci quittent vraiment la page.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: {
    size: 'sm',
    shortcut: true,
    newTab: false,
  },
} satisfies Meta<typeof PrQuickExit>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Quitter vite' })
    await expect(button).toHaveAccessibleDescription('Quitte ce site tout de suite et ouvre une page neutre. Raccourci : appuyez deux fois sur Échap.')
  },
}

/** In a site header: always visible, at the same place on every page. */
export const InHeader: Story = {
  render: (args) => ({
    components: { PrQuickExit },
    setup() {
      return { args }
    },
    template: `
      <div style="display: flex; align-items: center; justify-content: space-between; gap: var(--pr-space-4); padding: var(--pr-space-3) var(--pr-space-4); border: 1px solid var(--pr-color-border); border-radius: var(--pr-radius-lg); background: var(--pr-color-surface);">
        <strong style="font-family: var(--pr-font-heading); color: var(--pr-color-heading);">OREMIS</strong>
        <PrQuickExit v-bind="args" />
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { PrQuickExit },
    template: `
      <div class="story-stack">
        <PrQuickExit size="sm" :shortcut="false" />
        <PrQuickExit size="md" :shortcut="false" />
        <PrQuickExit size="lg" :shortcut="false" />
      </div>
    `,
  }),
}
