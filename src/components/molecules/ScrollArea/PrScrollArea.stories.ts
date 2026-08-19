import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrScrollArea } from './'
import '../../stories.css'

const meta = {
  title: 'Layout/ScrollArea',
  component: PrScrollArea,
  tags: ['autodocs'],
  args: {
    maxHeight: '10rem',
  },
} satisfies Meta<typeof PrScrollArea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrScrollArea },
    setup() {
      return { args }
    },
    template: `
      <PrScrollArea v-bind="args">
        <p v-for="item in 12" :key="item" class="story-muted">Ligne {{ item }}</p>
      </PrScrollArea>
    `,
  }),
}
