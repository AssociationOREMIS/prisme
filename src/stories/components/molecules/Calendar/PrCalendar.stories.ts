import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { PrCalendar } from '../../../../components/molecules/Calendar'
import '../../../stories.css'

const meta = {
  title: 'Data Display/Calendar',
  component: PrCalendar,
  tags: ['autodocs'],
} satisfies Meta<typeof PrCalendar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { PrCalendar },
    setup() {
      const value = ref('')
      return { value }
    },
    template: '<PrCalendar v-model="value" />',
  }),
}
