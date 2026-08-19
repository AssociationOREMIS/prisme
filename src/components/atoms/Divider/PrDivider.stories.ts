import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrDivider } from './'
import '../../stories.css'

const meta = {
  title: 'Layout/Divider',
  component: PrDivider,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
  args: {
    orientation: 'horizontal',
  },
} satisfies Meta<typeof PrDivider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrDivider },
    setup() {
      return { args }
    },
    template: '<PrDivider v-bind="args" />',
  }),
}

export const Variants: Story = {
  render: () => ({
    components: { PrDivider },
    template: `
      <div class="story-column">
        <span>Horizontal</span>
        <PrDivider />
        <div class="story-divider-shell">
          <span>Avant</span>
          <PrDivider orientation="vertical" />
          <span>Apres</span>
        </div>
      </div>
    `,
  }),
}

export const Playground: Story = {
  render: (args) => ({
    components: { PrDivider },
    setup() {
      return { args }
    },
    template: '<PrDivider v-bind="args" />',
  }),
}
