import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrErrorSummary } from '../../../../components/atoms/ErrorSummary'
import '../../../stories.css'

// Above a form, lists what to fix after a refused submit. Takes usePrForm's `errorList`
// (each message with its field label) or plain messages (`$errors->all()` in Blade).
const meta = {
  title: 'Feedback/ErrorSummary',
  component: PrErrorSummary,
  tags: ['autodocs'],
  args: {
    errors: [
      { field: 'email', label: 'Email', message: 'Adresse email invalide' },
      { field: 'role', label: 'Rôle', message: 'Ce champ est requis' },
    ],
  },
} satisfies Meta<typeof PrErrorSummary>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FromBlade: Story = {
  render: () => ({
    components: { PrErrorSummary },
    template: `<PrErrorSummary :errors="['Le champ nom est obligatoire.']" />`,
  }),
}
