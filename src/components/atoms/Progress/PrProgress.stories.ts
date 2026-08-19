import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrProgress } from './'
import '../../stories.css'

const meta = {
  title: 'Feedback/Progress',
  component: PrProgress,
  tags: ['autodocs'],
  args: {
    modelValue: 62,
    label: 'Import',
    showValue: true,
    max: 100,
  },
} satisfies Meta<typeof PrProgress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const States: Story = {
  render: () => ({
    components: { PrProgress },
    template: `
      <div class="story-column">
        <PrProgress label="Demarrage" :model-value="12" show-value />
        <PrProgress label="Traitement" :model-value="58" show-value />
        <PrProgress label="Termine" :model-value="100" show-value />
      </div>
    `,
  }),
}
