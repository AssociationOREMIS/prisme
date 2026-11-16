import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrStatusDot } from '../../../../components/atoms/StatusDot'
import '../../../stories.css'

const meta = {
  title: 'Data Display/StatusDot',
  component: PrStatusDot,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['success', 'neutral', 'warning', 'danger', 'info'] },
  },
  args: {
    variant: 'success',
    label: 'Un bénévole vous répond',
    pulse: false,
  },
} satisfies Meta<typeof PrStatusDot>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Pulse: Story = {
  args: { pulse: true },
}

/** The label carries the status: the colour alone says nothing to a colour-blind person or a screen reader. */
export const Variants: Story = {
  render: () => ({
    components: { PrStatusDot },
    template: `
      <div class="story-column">
        <PrStatusDot variant="success" label="En ligne" />
        <PrStatusDot variant="neutral" label="Hors ligne" />
        <PrStatusDot variant="warning" label="Absent" />
        <PrStatusDot variant="danger" label="Indisponible" />
        <PrStatusDot variant="info" label="En réunion" />
      </div>
    `,
  }),
}
