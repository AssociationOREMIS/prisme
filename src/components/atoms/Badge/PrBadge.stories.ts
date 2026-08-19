import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrBadge } from './'
import '../../stories.css'

const meta = {
  title: 'Prisme/Components/Badge',
  component: PrBadge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'primary', 'success', 'warning', 'danger', 'info'],
    },
  },
  args: {
    variant: 'neutral',
  },
} satisfies Meta<typeof PrBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrBadge },
    setup() {
      return { args }
    },
    template: '<PrBadge v-bind="args">Statut</PrBadge>',
  }),
}

export const Variants: Story = {
  render: () => ({
    components: { PrBadge },
    template: `
      <div class="story-stack">
        <PrBadge>Neutral</PrBadge>
        <PrBadge variant="primary">Primary</PrBadge>
        <PrBadge variant="success">Success</PrBadge>
        <PrBadge variant="warning">Warning</PrBadge>
        <PrBadge variant="danger">Danger</PrBadge>
        <PrBadge variant="info">Info</PrBadge>
      </div>
    `,
  }),
}

export const Playground: Story = {
  render: (args) => ({
    components: { PrBadge },
    setup() {
      return { args }
    },
    template: '<PrBadge v-bind="args">Badge</PrBadge>',
  }),
}
