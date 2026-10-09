import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
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

// Opens on click, closes with Escape, and gives the focus back to its trigger.
export const Keyboard: Story = {
  render: () => ({
    components: { PrButton, PrPopover },
    template: `
      <PrPopover>
        <template #trigger><PrButton variant="secondary">Notifications</PrButton></template>
        <p>3 dossiers attendent une action.</p>
      </PrPopover>
    `,
  }),
  play: async ({ canvasElement }) => {
    const body = within(document.body)
    const trigger = within(canvasElement).getByRole('button', { name: 'Notifications' })

    await userEvent.click(trigger)
    const content = await body.findByText('3 dossiers attendent une action.')
    // It fades in: visible once the animation has started.
    await waitFor(() => expect(content).toBeVisible())
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByText('3 dossiers attendent une action.')).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}
