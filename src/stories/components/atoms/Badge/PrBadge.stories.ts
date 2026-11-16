import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrBadge } from '../../../../components/atoms/Badge'
import '../../../stories.css'

const meta = {
  title: 'Data Display/Badge',
  component: PrBadge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'primary', 'success', 'warning', 'danger', 'info'],
    },
    shape: {
      control: 'select',
      options: ['pill', 'tag'],
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

// Compact labels with small corners and no border: the tags of an article or of a feed entry.
export const Tags: Story = {
  render: () => ({
    components: { PrBadge },
    template: `
      <div class="story-stack">
        <PrBadge shape="tag">Infra</PrBadge>
        <PrBadge shape="tag" variant="primary">Article</PrBadge>
        <PrBadge shape="tag" variant="success">Web</PrBadge>
        <PrBadge shape="tag" variant="warning">API</PrBadge>
        <PrBadge shape="tag" variant="danger">Changement important</PrBadge>
        <PrBadge shape="tag" variant="info">Accessibilité</PrBadge>
      </div>
    `,
  }),
}
