import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrSpinner } from './'
import '../../stories.css'

const meta = {
  title: 'Prisme/Components/Spinner',
  component: PrSpinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    size: 'md',
    label: 'Chargement',
  },
} satisfies Meta<typeof PrSpinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrSpinner },
    setup() {
      return { args }
    },
    template: '<PrSpinner v-bind="args" />',
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { PrSpinner },
    template: `
      <div class="story-stack">
        <PrSpinner size="sm" />
        <PrSpinner size="md" />
        <PrSpinner size="lg" />
      </div>
    `,
  }),
}

export const Playground: Story = {
  render: (args) => ({
    components: { PrSpinner },
    setup() {
      return { args }
    },
    template: '<PrSpinner v-bind="args" />',
  }),
}
