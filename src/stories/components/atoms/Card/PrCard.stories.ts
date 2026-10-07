import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import { PrBadge } from '../../../../components/atoms/Badge'
import { PrButton } from '../../../../components/atoms/Button'
import { PrCard } from '../../../../components/atoms/Card'
import '../../../stories.css'

const meta = {
  title: 'Data Display/Card',
  component: PrCard,
  tags: ['autodocs'],
  argTypes: {
    elevation: {
      control: 'select',
      options: ['flat', 'raised'],
    },
  },
  args: {
    padded: true,
    elevation: 'flat',
  },
} satisfies Meta<typeof PrCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrBadge, PrCard },
    setup() {
      return { args }
    },
    template: `
      <PrCard v-bind="args" style="max-width: 28rem">
        <div class="story-card-content">
          <PrBadge variant="primary">Dossier</PrBadge>
          <h3>Demande en cours</h3>
          <p>Surface simple pour regrouper les informations et actions liees.</p>
        </div>
      </PrCard>
    `,
  }),
}

export const Variants: Story = {
  render: () => ({
    components: { PrCard },
    template: `
      <div class="story-row">
        <PrCard style="width: 18rem">
          <div class="story-card-content">
            <h3>Flat</h3>
            <p>Bordure discrete, sans elevation marquee.</p>
          </div>
        </PrCard>
        <PrCard elevation="raised" style="width: 18rem">
          <div class="story-card-content">
            <h3>Raised</h3>
            <p>Ombre faible pour differencier une surface active.</p>
          </div>
        </PrCard>
      </div>
    `,
  }),
}

export const Playground: Story = {
  render: (args) => ({
    components: { PrButton, PrCard },
    setup() {
      return { args }
    },
    template: `
      <PrCard v-bind="args" style="max-width: 28rem">
        <div class="story-card-content">
          <h3>Carte configurable</h3>
          <p>Controlez le padding et l'elevation depuis le panneau Storybook.</p>
          <PrButton size="sm">Action</PrButton>
        </div>
      </PrCard>
    `,
  }),
}

// Header: title and description on the left, actions on the right, below them when the card is narrow.
// noinspection JSUnusedGlobalSymbols
export const WithHeader: Story = {
  render: () => ({
    components: { PrButton, PrCard },
    template: `
      <div style="display: grid; gap: 1.5rem;">
        <PrCard data-testid="wide" title="Sanctions en cours" description="Suspensions et avertissements actifs de ce bénévole.">
          <template #actions>
            <PrButton action="add" variant="secondary" size="sm">Ajouter</PrButton>
          </template>
          <p style="margin: 0;">Aucune sanction en cours.</p>
        </PrCard>
        <div style="width: 300px;">
          <PrCard data-testid="narrow" title="Notes" description="Notes internes de l'équipe.">
            <template #actions>
              <PrButton action="add" variant="secondary" size="sm">Ajouter une note</PrButton>
            </template>
          </PrCard>
        </div>
        <PrCard :padded="false" title="Bénévoles" :heading-level="3">
          <p style="margin: 0; padding: 1.25rem;">Un tableau remplit la carte.</p>
        </PrCard>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { level: 2, name: 'Sanctions en cours' })).toBeTruthy()
    await expect(canvas.getByRole('heading', { level: 3, name: 'Bénévoles' })).toBeTruthy()

    const position = (card: string) => {
      const root = canvas.getByTestId(card)
      const title = root.querySelector('.pr-card__title')!.getBoundingClientRect()
      const actions = root.querySelector('.pr-card__actions')!.getBoundingClientRect()
      return { title, actions, root: root.getBoundingClientRect() }
    }
    const wide = position('wide')
    await expect(wide.actions.top).toBeLessThan(wide.title.bottom)
    await expect(wide.root.right - wide.actions.right).toBeLessThan(30)
    const narrow = position('narrow')
    await expect(narrow.actions.top).toBeGreaterThanOrEqual(narrow.title.bottom)
  },
}
