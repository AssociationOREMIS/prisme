import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { PrInput } from './'
import '../../stories.css'

const meta = {
  title: 'Prisme/Components/Input',
  component: PrInput,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
    },
  },
  args: {
    label: 'Adresse e-mail',
    hint: '',
    error: '',
    disabled: false,
    required: false,
    type: 'email',
    placeholder: 'nom@exemple.fr',
  },
} satisfies Meta<typeof PrInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrInput },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: '<PrInput v-model="value" v-bind="args" />',
  }),
}

export const States: Story = {
  render: () => ({
    components: { PrInput },
    setup() {
      const email = ref('')
      return { email }
    },
    template: `
      <div class="story-column">
        <PrInput v-model="email" label="Adresse e-mail" placeholder="nom@exemple.fr" hint="Utilisee pour les notifications." />
        <PrInput model-value="contact@oremis.fr" label="Champ requis" required />
        <PrInput model-value="erreur" label="Avec erreur" error="Le format attendu n'est pas valide." />
        <PrInput model-value="Lecture seule" label="Desactive" disabled />
      </div>
    `,
  }),
}

export const Playground: Story = {
  render: (args) => ({
    components: { PrInput },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: '<PrInput v-model="value" v-bind="args" />',
  }),
}
