import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
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

// Keyboard use, and an async confirm: the dialog waits for the request before closing.
export const KeyboardAndAsyncConfirm: Story = {
  render: () => ({
    components: { PrAlertDialog, PrButton },
    setup() {
      const archive = () => new Promise(resolve => setTimeout(resolve, 300))
      return { archive }
    },
    template: `
      <PrAlertDialog title="Archiver le dossier ?" confirm-text="Archiver" @confirm="archive">
        <template #trigger><PrButton>Ouvrir</PrButton></template>
      </PrAlertDialog>
    `,
  }),
  play: async ({ canvasElement }) => {
    const body = within(document.body)
    const trigger = within(canvasElement).getByRole('button', { name: 'Ouvrir' })

    trigger.focus()
    await userEvent.keyboard('{Enter}')
    const dialog = await body.findByRole('alertdialog', { name: 'Archiver le dossier ?' })
    // The focus goes into the dialog, on the safe choice first.
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement))

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('alertdialog')).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())

    await userEvent.click(trigger)
    const confirm = await body.findByRole('button', { name: 'Archiver' })
    confirm.focus()
    await userEvent.keyboard('{Enter}')
    await expect(body.getByRole('alertdialog')).toBeTruthy()
    // Loading, the button is aria-disabled and keeps the focus (disabled dropped it on <body>).
    await waitFor(() => expect(confirm).toHaveAttribute('aria-busy', 'true'))
    await expect(confirm).toHaveAttribute('aria-disabled', 'true')
    await expect(confirm).toHaveFocus()
    await waitFor(() => expect(body.queryByRole('alertdialog')).toBeNull())
  },
}
