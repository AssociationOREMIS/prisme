import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { PrAccordion } from './'
import '../../stories.css'

const items = [
  { title: 'Informations', value: 'info', content: 'Resume des informations principales.' },
  { title: 'Activite', value: 'activity', content: 'Historique recent du dossier.' },
  { title: 'Documents', value: 'documents', content: 'Pieces jointes associees.' },
]

const meta = {
  title: 'Navigation/Accordion',
  component: PrAccordion,
  tags: ['autodocs'],
  args: {
    items,
    type: 'single',
    collapsible: true,
  },
} satisfies Meta<typeof PrAccordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrAccordion },
    setup() {
      const value = ref('info')
      return { args, value }
    },
    template: '<PrAccordion v-model="value" v-bind="args" />',
  }),
}
