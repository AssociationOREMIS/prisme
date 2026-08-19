import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrButton } from '../../atoms/Button'
import { PrTooltip } from './'
import '../../stories.css'

const meta = {
  title: 'Overlays/Tooltip',
  component: PrTooltip,
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
    content: 'Ajouter un element',
    side: 'top',
    align: 'center',
    delayDuration: 250,
    disabled: false,
  },
} satisfies Meta<typeof PrTooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrButton, PrTooltip },
    setup() {
      return { args }
    },
    template: `
      <div class="story-panel">
        <PrTooltip v-bind="args">
          <PrButton variant="secondary">Survoler</PrButton>
        </PrTooltip>
      </div>
    `,
  }),
}

export const CustomContent: Story = {
  render: () => ({
    components: { PrButton, PrTooltip },
    template: `
      <div class="story-panel">
        <PrTooltip side="right">
          <PrButton>Publier</PrButton>
          <template #content>
            Publication disponible apres validation.
          </template>
        </PrTooltip>
      </div>
    `,
  }),
}
