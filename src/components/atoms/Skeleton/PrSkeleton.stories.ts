import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrSkeleton } from './'
import '../../stories.css'

const meta = {
  title: 'Feedback/Skeleton',
  component: PrSkeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'block', 'circle'],
    },
  },
  args: {
    variant: 'block',
  },
} satisfies Meta<typeof PrSkeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CardLoading: Story = {
  render: () => ({
    components: { PrSkeleton },
    template: `
      <div class="story-panel">
        <div class="story-stack">
          <PrSkeleton variant="circle" style="width: 2.5rem; height: 2.5rem;" />
          <PrSkeleton variant="text" style="width: 12rem;" />
          <PrSkeleton variant="text" style="width: 18rem;" />
          <PrSkeleton style="width: 100%; height: 8rem;" />
        </div>
      </div>
    `,
  }),
}
