import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrCard } from '../../../../components/atoms/Card'
import { PrGrid } from '../../../../components/atoms/Grid'
import '../../../stories.css'

const meta = {
  title: 'Layout/Grid',
  component: PrGrid,
  tags: ['autodocs'],
  argTypes: {
    gap: { control: 'select', options: [1, 2, 3, 4, 5, 6, 8, 10, 12] },
  },
  args: {
    min: '18rem',
    gap: 4,
    as: 'div',
  },
} satisfies Meta<typeof PrGrid>

export default meta
type Story = StoryObj<typeof meta>

// As many columns as fit, each at least `min` wide; a single one on a phone.
export const Cards: Story = {
  render: (args) => ({
    components: { PrCard, PrGrid },
    setup: () => ({ args }),
    template: `
      <PrGrid v-bind="args" style="width: 100%;">
        <PrCard title="Prévenir" description="Des ateliers dans les classes, de l'école au lycée." />
        <PrCard title="Écouter" description="Une ligne d'écoute pour les élèves et leurs familles." />
        <PrCard title="Accompagner" description="Un suivi des élèves en situation de handicap." />
        <PrCard title="Former" description="Des formations pour les équipes éducatives." />
      </PrGrid>
    `,
  }),
}
