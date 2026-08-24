import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { PrNumberInput } from '../../../../components/atoms/NumberInput'
import '../../../stories.css'

const meta = {
  title: 'Forms/NumberInput',
  component: PrNumberInput,
  tags: ['autodocs'],
  args: {
    label: 'Quantité',
    hint: '',
    error: '',
    disabled: false,
    required: false,
    min: 0,
    max: 100,
    step: 1,
  },
} satisfies Meta<typeof PrNumberInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrNumberInput },
    setup() {
      const value = ref(5)
      return { args, value }
    },
    template: '<div class="story-column"><PrNumberInput v-model="value" v-bind="args" /></div>',
  }),
}

export const States: Story = {
  render: () => ({
    components: { PrNumberInput },
    setup() {
      const v1 = ref(3)
      const v2 = ref(0)
      const v3 = ref(10)
      return { v1, v2, v3 }
    },
    template: `
      <div class="story-column">
        <PrNumberInput v-model="v1" label="Par défaut" :min="0" :max="10" />
        <PrNumberInput v-model="v2" label="Avec erreur" error="La quantité doit être supérieure à 0." :min="0" :max="10" />
        <PrNumberInput v-model="v3" label="Désactivé" disabled :min="0" :max="10" />
      </div>
    `,
  }),
}

export const Playground: Story = {
  render: (args) => ({
    components: { PrNumberInput },
    setup() {
      const value = ref(0)
      return { args, value }
    },
    template: '<div class="story-column"><PrNumberInput v-model="value" v-bind="args" /></div>',
  }),
}
