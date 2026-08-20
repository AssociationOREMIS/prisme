import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrBadge } from '../../../../components/atoms/Badge'
import { PrButton } from '../../../../components/atoms/Button'
import { PrHoverCard } from '../../../../components/molecules/HoverCard'
import '../../../stories.css'

const meta = {
  title: 'Overlays/HoverCard',
  component: PrHoverCard,
  tags: ['autodocs'],
  args: {
    side: 'top',
    align: 'center',
  },
} satisfies Meta<typeof PrHoverCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrBadge, PrButton, PrHoverCard },
    setup() {
      return { args }
    },
    template: `
      <div class="story-panel">
        <PrHoverCard v-bind="args">
          <template #trigger>
            <PrButton variant="ghost">Survoler le dossier</PrButton>
          </template>
          <div class="story-stack">
            <PrBadge variant="success">Actif</PrBadge>
            <strong>Dossier operationnel</strong>
            <span class="story-muted">Derniere mise a jour il y a 12 minutes.</span>
          </div>
        </PrHoverCard>
      </div>
    `,
  }),
}
