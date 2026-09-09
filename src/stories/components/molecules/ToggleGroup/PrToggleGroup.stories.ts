import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { PrToggleGroup } from '../../../../components/molecules/ToggleGroup'
import '../../../stories.css'

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

export const Multiple: Story = {
  render: () => ({
    components: { PrToggleGroup },
    setup() {
      const value = ref(['day', 'week'])
      return { items, value }
    },
    template: '<PrToggleGroup v-model="value" type="multiple" :items="items" aria-label="Vues affichees" />',
  }),
}

export const States: Story = {
  render: () => ({
    components: { PrToggleGroup },
    setup() {
      const disabledValue = ref('week')
      const errorValue = ref('')
      return { items, disabledValue, errorValue }
    },
    template: `
      <div class="story-column">
        <PrToggleGroup v-model="disabledValue" :items="items" disabled aria-label="Vue (desactive)" />
        <PrToggleGroup v-model="errorValue" :items="items" error="Merci de choisir une vue." aria-label="Vue (erreur)" />
        <PrToggleGroup v-model="disabledValue" :items="items" hint="La vue par defaut est Semaine." aria-label="Vue (astuce)" />
      </div>
    `,
  }),
}
