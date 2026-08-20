import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { PrDatePicker } from '../../../../components/molecules/DatePicker'
import '../../../stories.css'

const meta = {
  title: 'Forms/DatePicker',
  component: PrDatePicker,
  tags: ['autodocs'],
  args: {
    label: 'Date echeance',
  },
} satisfies Meta<typeof PrDatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrDatePicker },
    setup() {
      const value = ref('2026-08-19')
      return { args, value }
    },
    template: '<PrDatePicker v-model="value" v-bind="args" />',
  }),
}
