import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrButton } from '../../atoms/Button'
import { PrInput } from '../../atoms/Input'
import { PrDialog } from './'
import '../../stories.css'

const meta = {
  title: 'Overlays/Dialog',
  component: PrDialog,
  tags: ['autodocs'],
  args: {
    title: 'Modifier le dossier',
    description: 'Mettez a jour les informations principales.',
  },
} satisfies Meta<typeof PrDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrButton, PrDialog, PrInput },
    setup() {
      return { args }
    },
    template: `
      <PrDialog v-bind="args">
        <template #trigger>
          <PrButton>Ouvrir</PrButton>
        </template>
        <div class="story-column">
          <PrInput label="Nom" model-value="Dossier operationnel" />
          <PrInput label="Responsable" model-value="OREMIS" />
        </div>
        <template #footer>
          <PrButton variant="secondary">Annuler</PrButton>
          <PrButton>Enregistrer</PrButton>
        </template>
      </PrDialog>
    `,
  }),
}
