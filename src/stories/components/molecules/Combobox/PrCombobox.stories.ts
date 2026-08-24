import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { PrCombobox } from '../../../../components/molecules/Combobox'
import '../../../stories.css'

const options = [
  { label: 'France', value: 'fr' },
  { label: 'Belgique', value: 'be' },
  { label: 'Suisse', value: 'ch' },
  { label: 'Canada', value: 'ca' },
  { label: 'Luxembourg', value: 'lu' },
  { label: 'Maroc', value: 'ma' },
  { label: 'Tunisie', value: 'tn', disabled: true },
]

const meta = {
  title: 'Forms/Combobox',
  component: PrCombobox,
  tags: ['autodocs'],
  args: {
    label: 'Pays',
    placeholder: 'Sélectionner un pays',
    hint: '',
    error: '',
    options,
    disabled: false,
    required: false,
    multiple: false,
  },
} satisfies Meta<typeof PrCombobox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrCombobox },
    setup() {
      const value = ref('fr')
      return { args, value }
    },
    template: '<div class="story-column"><PrCombobox v-model="value" v-bind="args" /></div>',
  }),
}

export const Multiple: Story = {
  render: () => ({
    components: { PrCombobox },
    setup() {
      const value = ref(['fr', 'be'])
      return { value, options }
    },
    template: `
      <div class="story-column">
        <PrCombobox v-model="value" :options="options" label="Pays (multi)" multiple placeholder="Sélectionner des pays" />
      </div>
    `,
  }),
}

export const States: Story = {
  render: () => ({
    components: { PrCombobox },
    setup() {
      return { options }
    },
    template: `
      <div class="story-column">
        <PrCombobox label="Par défaut" :options="options" placeholder="Sélectionner" />
        <PrCombobox label="Avec erreur" model-value="fr" error="Ce pays n'est pas éligible." :options="options" />
        <PrCombobox label="Désactivé" model-value="be" disabled :options="options" />
      </div>
    `,
  }),
}

export const Playground: Story = {
  render: (args) => ({
    components: { PrCombobox },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: '<div class="story-column"><PrCombobox v-model="value" v-bind="args" /></div>',
  }),
}
