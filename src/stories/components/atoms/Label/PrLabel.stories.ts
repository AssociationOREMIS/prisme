import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrInput } from '../../../../components/atoms/Input'
import { PrLabel } from '../../../../components/atoms/Label'
import '../../../stories.css'

const meta = {
  title: 'Forms/Label',
  component: PrLabel,
  tags: ['autodocs'],
  args: {
    required: false,
    disabled: false,
  },
} satisfies Meta<typeof PrLabel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrInput, PrLabel },
    setup() {
      return { args }
    },
    template: `
      <div class="story-column">
        <PrLabel for="story-label-email" v-bind="args">Adresse e-mail</PrLabel>
        <PrInput id="story-label-email" placeholder="nom@exemple.fr" />
      </div>
    `,
  }),
}

export const States: Story = {
  render: () => ({
    components: { PrLabel },
    template: `
      <div class="story-column">
        <PrLabel>Label standard</PrLabel>
        <PrLabel required>Label requis</PrLabel>
        <PrLabel disabled>Label desactive</PrLabel>
      </div>
    `,
  }),
}
