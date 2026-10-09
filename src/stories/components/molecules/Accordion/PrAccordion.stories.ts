import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import { PrAccordion } from '../../../../components/molecules/Accordion'
import '../../../stories.css'

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

export const Multiple: Story = {
  render: () => ({
    components: { PrAccordion },
    setup() {
      const value = ref(['info', 'activity'])
      return { items, value }
    },
    template: '<PrAccordion v-model="value" type="multiple" :items="items" />',
  }),
}

export const DisabledItem: Story = {
  render: () => ({
    components: { PrAccordion },
    setup() {
      const value = ref('info')
      const itemsWithDisabled = items.map(item => item.value === 'documents' ? { ...item, disabled: true } : item)
      return { value, itemsWithDisabled }
    },
    template: '<PrAccordion v-model="value" :items="itemsWithDisabled" />',
  }),
}

// Each header is a button that says whether its section is open.
export const Keyboard: Story = {
  render: () => ({
    components: { PrAccordion },
    setup: () => ({ items }),
    template: '<PrAccordion type="single" collapsible :items="items" />',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const documents = canvas.getByRole('button', { name: 'Documents' })
    await expect(documents).toHaveAttribute('aria-expanded', 'false')

    documents.focus()
    await userEvent.keyboard('{Enter}')
    await expect(documents).toHaveAttribute('aria-expanded', 'true')
    await expect(canvas.getByText('Pieces jointes associees.')).toBeVisible()

    await userEvent.keyboard('{Enter}')
    await expect(documents).toHaveAttribute('aria-expanded', 'false')
  },
}
