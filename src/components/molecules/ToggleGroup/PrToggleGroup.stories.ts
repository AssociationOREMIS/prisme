import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { PrToggleGroup } from './'
import '../../stories.css'

const items = [
  { label: 'Jour', value: 'day' },
  { label: 'Semaine', value: 'week' },
  { label: 'Mois', value: 'month' },
]

const meta = {
  title: 'Actions/ToggleGroup',
  component: PrToggleGroup,
  tags: ['autodocs'],
  args: {
    items,
    type: 'single',
    ariaLabel: 'Vue',
  },
} satisfies Meta<typeof PrToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrToggleGroup },
    setup() {
      const value = ref('week')
      return { args, value }
    },
    template: '<PrToggleGroup v-model="value" v-bind="args" />',
  }),
}
