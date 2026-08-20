import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Bell } from '@lucide/vue'
import { PrBadge } from '../../../../components/atoms/Badge'
import { PrButton } from '../../../../components/atoms/Button'
import { PrPopover } from '../../../../components/molecules/Popover'
import '../../../stories.css'

const meta = {
  title: 'Overlays/Popover',
  component: PrPopover,
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
    },
  },
  args: {
    side: 'bottom',
    align: 'start',
    title: 'Notifications',
    closeLabel: 'Fermer',
  },
} satisfies Meta<typeof PrPopover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { Bell, PrBadge, PrButton, PrPopover },
    setup() {
      return { args }
    },
    template: `
      <div class="story-panel">
        <PrPopover v-bind="args">
          <template #trigger>
            <PrButton variant="secondary">
              <Bell :size="16" aria-hidden="true" />
              Notifications
            </PrButton>
          </template>
          <div class="story-stack">
            <PrBadge variant="info">Nouveau</PrBadge>
            <p class="story-muted">3 dossiers attendent une action.</p>
          </div>
        </PrPopover>
      </div>
    `,
  }),
}
