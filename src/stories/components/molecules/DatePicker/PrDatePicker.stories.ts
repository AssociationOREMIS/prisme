import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { PrDatePicker } from '../../../../components/molecules/DatePicker'
import '../../../stories.css'

const meta = {
  title: 'Forms/DatePicker',
  component: PrDatePicker,
  tags: ['autodocs'],
  args: {
    label: 'Date echeance',
  },
} satisfies Meta<typeof PrDatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrDatePicker },
    setup() {
      const value = ref('2026-08-19')
      return { args, value }
    },
    template: '<PrDatePicker v-model="value" v-bind="args" />',
  }),
}

export const States: Story = {
  render: () => ({
    components: { PrDatePicker },
    setup() {
      const value = ref('2026-08-19')
      const emptyValue = ref('')
      const rangedValue = ref('2026-08-19')
      return { value, emptyValue, rangedValue }
    },
    template: `
      <div class="story-column">
        <PrDatePicker v-model="emptyValue" label="Avec erreur" error="La date d'echeance est requise." />
        <PrDatePicker v-model="value" label="Desactive" disabled />
        <PrDatePicker v-model="rangedValue" label="Bornee (aout 2026)" min="2026-08-01" max="2026-08-31" hint="Du 1er au 31 aout 2026" />
      </div>
    `,
  }),
}
