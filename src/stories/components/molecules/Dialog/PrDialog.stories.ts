import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { PrButton } from '../../../../components/atoms/Button'
import { PrInput } from '../../../../components/atoms/Input'
import { PrDialog } from '../../../../components/molecules/Dialog'
import '../../../stories.css'

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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Ouvrir' }))

    const dialog = await screen.findByRole('dialog')
    await expect(within(dialog).getByText('Modifier le dossier')).toBeInTheDocument()

    await userEvent.click(within(dialog).getByRole('button', { name: 'Fermer' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  },
}

export const LongScrollableContent: Story = {
  render: () => ({
    components: { PrButton, PrDialog },
    setup() {
      const paragraphs = Array.from({ length: 20 }, (_, i) => i + 1)
      return { paragraphs }
    },
    template: `
      <PrDialog title="Conditions d'utilisation" description="Merci de lire l'integralite du document avant d'accepter.">
        <template #trigger>
          <PrButton>Ouvrir un contenu long</PrButton>
        </template>
        <div class="story-column">
          <p v-for="n in paragraphs" :key="n" class="story-muted">
            Paragraphe {{ n }} — le contenu de la modale depasse la hauteur visible de l'ecran, le corps doit rester scrollable independamment de l'entete et du pied de page.
          </p>
        </div>
        <template #footer>
          <PrButton variant="secondary">Refuser</PrButton>
          <PrButton>Accepter</PrButton>
        </template>
      </PrDialog>
    `,
  }),
}
