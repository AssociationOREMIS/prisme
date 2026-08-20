import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrButton } from '../../../../components/atoms/Button'
import { PrSwitch } from '../../../../components/atoms/Switch'
import { PrSheet } from '../../../../components/molecules/Sheet'
import '../../../stories.css'

const meta = {
  title: 'Overlays/Sheet',
  component: PrSheet,
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
    },
  },
  args: {
    side: 'right',
    title: 'Parametres',
    description: 'Ajustez les preferences de ce module.',
  },
} satisfies Meta<typeof PrSheet>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrButton, PrSheet, PrSwitch },
    setup() {
      return { args }
    },
    template: `
      <PrSheet v-bind="args">
        <template #trigger>
          <PrButton variant="secondary">Ouvrir</PrButton>
        </template>
        <div class="story-column">
          <PrSwitch label="Notifications" checked />
          <PrSwitch label="Mode automatique" />
        </div>
        <template #footer>
          <PrButton>Appliquer</PrButton>
        </template>
      </PrSheet>
    `,
  }),
}
