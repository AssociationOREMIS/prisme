import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrAlert } from './'
import '../../stories.css'

const meta = {
  title: 'Feedback/Alert',
  component: PrAlert,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'danger'],
    },
  },
  args: {
    variant: 'info',
    title: 'Information',
  },
} satisfies Meta<typeof PrAlert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrAlert },
    setup() {
      return { args }
    },
    template: '<PrAlert v-bind="args">Les donnees ont ete synchronisees avec succes.</PrAlert>',
  }),
}

export const Variants: Story = {
  render: () => ({
    components: { PrAlert },
    template: `
      <div class="story-column">
        <PrAlert title="Information">Une nouvelle version est disponible.</PrAlert>
        <PrAlert variant="success" title="Succes">La configuration a ete enregistree.</PrAlert>
        <PrAlert variant="warning" title="Attention">Certains champs demandent une verification.</PrAlert>
        <PrAlert variant="danger" title="Erreur">Impossible de finaliser cette action.</PrAlert>
      </div>
    `,
  }),
}
