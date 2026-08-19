import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrBadge } from '../Badge'
import { PrButton } from '../Button'
import { PrCard } from './'
import '../../stories.css'

const meta = {
  title: 'Prisme/Components/Card',
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
