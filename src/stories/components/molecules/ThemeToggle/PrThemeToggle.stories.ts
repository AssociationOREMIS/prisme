import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrThemeToggle } from '../../../../components/molecules/ThemeToggle'
import '../../../stories.css'

const meta = {
  title: 'Actions/ThemeToggle',
  component: PrThemeToggle,
  tags: ['autodocs'],
  args: {
    label: 'Theme',
  },
} satisfies Meta<typeof PrThemeToggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { PrThemeToggle },
    setup() {
      return { args }
    },
    template: '<PrThemeToggle v-bind="args" />',
  }),
}
