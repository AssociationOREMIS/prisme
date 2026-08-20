import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Bold, Italic } from '@lucide/vue'
import { ref } from 'vue'
import { PrToggle } from '../../../../components/atoms/Toggle'
import '../../../stories.css'

const meta = {
  title: 'Actions/Toggle',
  component: PrToggle,
  tags: ['autodocs'],
  args: {
    size: 'md',
    variant: 'default',
    disabled: false,
    ariaLabel: 'Activer',
  },
} satisfies Meta<typeof PrToggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { Bold, PrToggle },
    setup() {
      const pressed = ref(false)
      return { args, pressed }
    },
    template: '<PrToggle v-model:pressed="pressed" v-bind="args"><Bold :size="16" /></PrToggle>',
  }),
}

export const States: Story = {
  render: () => ({
    components: { Bold, Italic, PrToggle },
    template: `
      <div class="story-stack">
        <PrToggle aria-label="Gras"><Bold :size="16" /></PrToggle>
        <PrToggle pressed aria-label="Italique"><Italic :size="16" /></PrToggle>
        <PrToggle disabled aria-label="Desactive"><Bold :size="16" /></PrToggle>
      </div>
    `,
  }),
}
