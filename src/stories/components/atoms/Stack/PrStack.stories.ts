import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrButton } from '../../../../components/atoms/Button'
import { PrStack } from '../../../../components/atoms/Stack'
import '../../../stories.css'

const meta = {
  title: 'Layout/Stack',
  component: PrStack,
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'select', options: ['vertical', 'horizontal'] },
    gap: { control: 'select', options: [1, 2, 3, 4, 5, 6, 8, 10, 12] },
    align: { control: 'select', options: [undefined, 'start', 'center', 'end', 'stretch', 'baseline'] },
    justify: { control: 'select', options: [undefined, 'start', 'center', 'end', 'between'] },
  },
  args: {
    direction: 'vertical',
    gap: 4,
    wrap: false,
  },
} satisfies Meta<typeof PrStack>

export default meta
type Story = StoryObj<typeof meta>

const box = 'padding: var(--pr-space-3) var(--pr-space-4); border: 1px solid var(--pr-color-border); border-radius: var(--pr-radius-md); background: var(--pr-color-surface);'

export const Vertical: Story = {
  render: (args) => ({
    components: { PrStack },
    setup: () => ({ args }),
    template: `
      <PrStack v-bind="args">
        <div style="${box}">Accueillir</div>
        <div style="${box}">Écouter</div>
        <div style="${box}">Accompagner</div>
      </PrStack>
    `,
  }),
}

// A row of buttons that goes to the next line when there is no room.
export const Horizontal: Story = {
  args: {
    direction: 'horizontal',
    gap: 3,
    align: 'center',
    wrap: true,
  },
  render: (args) => ({
    components: { PrButton, PrStack },
    setup: () => ({ args }),
    template: `
      <PrStack v-bind="args">
        <PrButton href="#adherer">Adhérer</PrButton>
        <PrButton variant="secondary" href="#benevolat">Devenir bénévole</PrButton>
        <PrButton variant="ghost" href="#contact">Nous contacter</PrButton>
      </PrStack>
    `,
  }),
}
