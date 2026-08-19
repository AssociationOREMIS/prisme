import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { PrCheckbox } from './'
import '../../stories.css'

const meta = {
  title: 'Forms/Checkbox',
  component: PrCheckbox,
  tags: ['autodocs'],
  args: {
    label: 'Recevoir les notifications',
    description: 'Les alertes importantes restent toujours envoyees.',
    checked: false,
    disabled: false,
    required: false,
  },
} satisfies Meta<typeof PrCheckbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrCheckbox },
    setup() {
      const checked = ref(false)
      return { args, checked }
    },
    template: '<PrCheckbox v-model:checked="checked" v-bind="args" />',
  }),
}

export const States: Story = {
  render: () => ({
    components: { PrCheckbox },
    template: `
      <div class="story-column">
        <PrCheckbox label="Non coche" />
        <PrCheckbox checked label="Coche" />
        <PrCheckbox checked="indeterminate" label="Indetermine" />
        <PrCheckbox disabled label="Desactive" />
      </div>
    `,
  }),
}
