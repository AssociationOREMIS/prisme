import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { PrSwitch } from '../../../../components/atoms/Switch'
import '../../../stories.css'

const meta = {
  title: 'Forms/Switch',
  component: PrSwitch,
  tags: ['autodocs'],
  args: {
    label: 'Mode automatique',
    description: 'Active les regles configurees pour ce dossier.',
    checked: false,
    disabled: false,
  },
} satisfies Meta<typeof PrSwitch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrSwitch },
    setup() {
      const checked = ref(false)
      return { args, checked }
    },
    template: '<PrSwitch v-model:checked="checked" v-bind="args" />',
  }),
}

export const States: Story = {
  render: () => ({
    components: { PrSwitch },
    template: `
      <div class="story-column">
        <PrSwitch label="Inactif" />
        <PrSwitch checked label="Actif" />
        <PrSwitch disabled label="Desactive" />
      </div>
    `,
  }),
}
