import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { PrRadioGroup } from '../../../../components/molecules/RadioGroup'
import '../../../stories.css'

const options = [
  { label: 'Faible', value: 'low', description: 'Traitement standard.' },
  { label: 'Normale', value: 'normal', description: 'Priorite par defaut.' },
  { label: 'Haute', value: 'high', description: 'A traiter rapidement.' },
]

const meta = {
  title: 'Forms/RadioGroup',
  component: PrRadioGroup,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
  },
  args: {
    label: 'Priorite',
    options,
    orientation: 'vertical',
    disabled: false,
    required: false,
  },
} satisfies Meta<typeof PrRadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrRadioGroup },
    setup() {
      const value = ref('normal')
      return { args, value }
    },
    template: '<PrRadioGroup v-model="value" v-bind="args" />',
  }),
}

export const States: Story = {
  render: () => ({
    components: { PrRadioGroup },
    setup() {
      return { options }
    },
    template: `
      <div class="story-column">
        <PrRadioGroup model-value="normal" label="Vertical" :options="options" />
        <PrRadioGroup model-value="high" label="Horizontal" :options="options" orientation="horizontal" />
        <PrRadioGroup model-value="low" label="Desactive" :options="options" disabled />
      </div>
    `,
  }),
}
