import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrBadge } from '../../../../components/atoms/Badge'
import { PrButton } from '../../../../components/atoms/Button'
import { PrListItem } from '../../../../components/molecules/ListItem'
import '../../../stories.css'

const meta = {
  title: 'Data Display/ListItem',
  component: PrListItem,
  tags: ['autodocs'],
  args: {
    title: 'Dossier Alpha',
    description: 'Mis a jour aujourd hui',
    active: false,
  },
} satisfies Meta<typeof PrListItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrBadge, PrButton, PrListItem },
    setup() {
      return { args }
    },
    template: `
      <PrListItem v-bind="args">
        <template #media><PrBadge variant="success">Actif</PrBadge></template>
        <template #actions><PrButton size="sm" variant="secondary">Ouvrir</PrButton></template>
      </PrListItem>
    `,
  }),
}
