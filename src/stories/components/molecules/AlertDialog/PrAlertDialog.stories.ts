import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrButton } from '../../../../components/atoms/Button'
import { PrAlertDialog } from '../../../../components/molecules/AlertDialog'
import '../../../stories.css'

const meta = {
  title: 'Feedback/AlertDialog',
  component: PrAlertDialog,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'danger'],
    },
  },
  args: {
    title: 'Archiver le dossier ?',
    description: 'Cette action retirera le dossier des vues actives.',
    confirmText: 'Archiver',
    cancelText: 'Annuler',
    variant: 'primary',
  },
} satisfies Meta<typeof PrAlertDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrAlertDialog, PrButton },
    setup() {
      return { args }
    },
    template: `
      <PrAlertDialog v-bind="args">
          <template #trigger>
            <PrButton>Ouvrir</PrButton>
          </template>
      </PrAlertDialog>
    `,
  }),
}

export const Danger: Story = {
  render: () => ({
    components: { PrAlertDialog, PrButton },
    template: `
      <PrAlertDialog
        title="Supprimer definitivement ?"
        description="Cette action ne peut pas etre annulee."
        confirm-text="Supprimer"
        variant="danger"
      >
        <template #trigger>
          <PrButton variant="danger">Supprimer</PrButton>
        </template>
      </PrAlertDialog>
    `,
  }),
}
