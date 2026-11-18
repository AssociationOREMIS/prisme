import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrCard } from '../../../../components/atoms/Card'
import { PrGrid } from '../../../../components/atoms/Grid'
import { PrReveal } from '../../../../components/atoms/Reveal'
import '../../../stories.css'

const meta = {
  title: 'Atoms/Reveal',
  component: PrReveal,
  tags: ['autodocs'],
  argTypes: {
    effect: { control: 'select', options: ['fade', 'fade-up', 'fade-left', 'fade-right'] },
  },
  args: {
    effect: 'fade-up',
    duration: 800,
    delay: 0,
    offset: 120,
    repeat: false,
  },
} satisfies Meta<typeof PrReveal>

export default meta
type Story = StoryObj<typeof meta>

// Content that appears as it scrolls into view. Nothing moves when the user asks for less motion,
// and without JavaScript the content is simply there.
export const Default: Story = {
  render: args => ({
    components: { PrCard, PrReveal },
    setup: () => ({ args }),
    template: `
      <PrReveal v-bind="args">
        <PrCard title="Promouvoir une école inclusive" :heading-level="3">
          Chaque élève, quelles que soient ses particularités, doit trouver sa place à l'école.
        </PrCard>
      </PrReveal>
    `,
  }),
}

// Cards of a row, each one a little later than the one before.
export const Staggered: Story = {
  render: () => ({
    components: { PrCard, PrGrid, PrReveal },
    setup: () => ({ cards: ['Lutter contre le harcèlement', 'Une école inclusive', "L'assemblée générale"] }),
    template: `
      <PrGrid min="14rem" :gap="4">
        <PrReveal v-for="(card, index) in cards" :key="card" :delay="index * 150">
          <PrCard :title="card" :heading-level="3">Un engagement de l'association.</PrCard>
        </PrReveal>
      </PrGrid>
    `,
  }),
}
