import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrCollapsible } from './'
import '../../stories.css'

const meta = {
  title: 'Navigation/Collapsible',
  component: PrCollapsible,
  tags: ['autodocs'],
  args: {
    title: 'Filtres avances',
    defaultOpen: false,
  },
} satisfies Meta<typeof PrCollapsible>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrCollapsible },
    setup() {
      return { args }
    },
    template: '<PrCollapsible v-bind="args"><p class="story-muted">Les filtres avances apparaissent ici.</p></PrCollapsible>',
  }),
}
