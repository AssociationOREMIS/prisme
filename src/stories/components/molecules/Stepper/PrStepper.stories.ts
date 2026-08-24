import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { PrStepper } from '../../../../components/molecules/Stepper'
import '../../../stories.css'

const steps = [
  { label: 'Informations', description: 'Identité et coordonnées' },
  { label: 'Documents', description: 'Pièces justificatives' },
  { label: 'Validation', description: 'Vérification finale' },
  { label: 'Confirmation', description: 'Récapitulatif' },
]

const meta = {
  title: 'Navigation/Stepper',
  component: PrStepper,
  tags: ['autodocs'],
  args: {
    steps,
    orientation: 'horizontal',
    linear: false,
  },
} satisfies Meta<typeof PrStepper>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrStepper },
    setup() {
      const step = ref(2)
      return { args, step }
    },
    template: '<PrStepper v-model="step" v-bind="args" />',
  }),
}

export const States: Story = {
  render: () => ({
    components: { PrStepper },
    setup() {
      return { steps }
    },
    template: `
      <div class="story-column">
        <div>
          <p style="margin: 0 0 0.75rem; font-size: var(--pr-font-size-sm); color: var(--pr-color-text-muted)">Étape 1 — début</p>
          <PrStepper :model-value="1" :steps="steps" />
        </div>
        <div>
          <p style="margin: 0 0 0.75rem; font-size: var(--pr-font-size-sm); color: var(--pr-color-text-muted)">Étape 3 — en cours</p>
          <PrStepper :model-value="3" :steps="steps" />
        </div>
        <div>
          <p style="margin: 0 0 0.75rem; font-size: var(--pr-font-size-sm); color: var(--pr-color-text-muted)">Terminé</p>
          <PrStepper :model-value="5" :steps="steps" />
        </div>
      </div>
    `,
  }),
}

export const Vertical: Story = {
  render: () => ({
    components: { PrStepper },
    setup() {
      const step = ref(2)
      return { step, steps }
    },
    template: '<PrStepper v-model="step" :steps="steps" orientation="vertical" />',
  }),
}

export const Playground: Story = {
  render: (args) => ({
    components: { PrStepper },
    setup() {
      const step = ref(2)
      return { args, step }
    },
    template: '<PrStepper v-model="step" v-bind="args" />',
  }),
}
