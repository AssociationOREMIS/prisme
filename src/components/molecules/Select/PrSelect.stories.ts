import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { PrSelect } from './'
import '../../stories.css'

const options = [
  { label: 'Brouillon', value: 'draft' },
  { label: 'En revue', value: 'review' },
  { label: 'Publie', value: 'published' },
  { label: 'Archive', value: 'archived', disabled: true },
]

const meta = {
  title: 'Forms/Select',
  component: PrSelect,
  tags: ['autodocs'],
  args: {
    label: 'Statut',
    placeholder: 'Choisir un statut',
    hint: '',
    error: '',
    options,
    disabled: false,
    required: false,
  },
} satisfies Meta<typeof PrSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrSelect },
    setup() {
      const value = ref('review')
      return { args, value }
    },
    template: '<PrSelect v-model="value" v-bind="args" />',
  }),
}

export const States: Story = {
  render: () => ({
    components: { PrSelect },
    setup() {
      return { options }
    },
    template: `
      <div class="story-column">
        <PrSelect label="Statut" placeholder="Choisir" :options="options" />
        <PrSelect label="Avec erreur" model-value="draft" error="Ce statut n'est plus disponible." :options="options" />
        <PrSelect label="Desactive" model-value="review" disabled :options="options" />
      </div>
    `,
  }),
}

export const Playground: Story = {
  render: (args) => ({
    components: { PrSelect },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: '<PrSelect v-model="value" v-bind="args" />',
  }),
}
