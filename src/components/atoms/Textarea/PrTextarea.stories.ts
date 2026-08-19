import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { PrTextarea } from './'
import '../../stories.css'

const meta = {
  title: 'Forms/Textarea',
  component: PrTextarea,
  tags: ['autodocs'],
  argTypes: {
    resize: {
      control: 'select',
      options: ['none', 'vertical', 'horizontal', 'both'],
    },
  },
  args: {
    label: 'Commentaire',
    hint: 'Ajoutez les informations utiles au traitement.',
    error: '',
    disabled: false,
    required: false,
    placeholder: 'Votre commentaire',
    rows: 4,
    resize: 'vertical',
  },
} satisfies Meta<typeof PrTextarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrTextarea },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: '<PrTextarea v-model="value" v-bind="args" />',
  }),
}

export const States: Story = {
  render: () => ({
    components: { PrTextarea },
    template: `
      <div class="story-column">
        <PrTextarea label="Commentaire" hint="Visible par l'equipe." />
        <PrTextarea label="Erreur" model-value="Texte trop court" error="Le commentaire doit contenir au moins 20 caracteres." />
        <PrTextarea label="Desactive" model-value="Lecture seule" disabled />
      </div>
    `,
  }),
}

export const Playground: Story = {
  render: (args) => ({
    components: { PrTextarea },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: '<PrTextarea v-model="value" v-bind="args" />',
  }),
}
