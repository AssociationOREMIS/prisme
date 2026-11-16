import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrButton } from '../../../../components/atoms/Button'
import { PrContainer } from '../../../../components/layouts/Container'
import { PrHero } from '../../../../components/layouts/Hero'
import '../../../stories.css'

const meta = {
  title: 'Layout/Hero',
  component: PrHero,
  tags: ['autodocs'],
  parameters: {
    prLayout: 'fullscreen',
  },
  argTypes: {
    headingLevel: { control: 'select', options: [1, 2] },
  },
  args: {
    title: 'Ensemble contre le harcèlement scolaire',
    description: 'OREMIS accompagne les élèves, leurs familles et les équipes éducatives, partout en France.',
    headingLevel: 1,
    pattern: true,
  },
} satisfies Meta<typeof PrHero>

export default meta
type Story = StoryObj<typeof meta>

// The page's h1 and lead text, buttons under them; decorative squares on the right half (from 1024px).
export const Default: Story = {
  render: (args) => ({
    components: { PrButton, PrContainer, PrHero },
    setup: () => ({ args }),
    template: `
      <PrContainer>
        <PrHero v-bind="args">
          <template #actions>
            <PrButton size="lg" href="#aide">Demander de l'aide</PrButton>
            <PrButton size="lg" variant="secondary" href="#benevolat">Devenir bénévole</PrButton>
          </template>
        </PrHero>
      </PrContainer>
    `,
  }),
}

export const WithoutPattern: Story = {
  args: {
    pattern: false,
  },
  render: (args) => ({
    components: { PrContainer, PrHero },
    setup: () => ({ args }),
    template: '<PrContainer><PrHero v-bind="args" /></PrContainer>',
  }),
}
