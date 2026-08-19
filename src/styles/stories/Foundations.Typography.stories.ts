import type { Meta, StoryObj } from '@storybook/vue3-vite'
import './foundations.css'

const meta = {
  title: 'Foundations/Typography',
  tags: ['autodocs'],
  render: () => ({
    template: `
      <div class="foundation-page">
        <div>
          <h1>Typography</h1>
          <p>Une echelle volontairement compacte pour des interfaces métier denses et lisibles.</p>
        </div>
        <div class="foundation-type-sample">
          <span style="font-size: var(--pr-font-size-xs)">XS - Informations secondaires</span>
          <span style="font-size: var(--pr-font-size-sm)">SM - Labels et aides de formulaire</span>
          <span style="font-size: var(--pr-font-size-md)">MD - Texte par defaut des controles</span>
          <span style="font-size: var(--pr-font-size-lg); font-weight: 650">LG - Titres de panneaux</span>
          <span style="font-family: var(--pr-font-mono)">Mono - --pr-color-primary</span>
        </div>
      </div>
    `,
  }),
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Typography: Story = {}
