import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { ChatWindowDemo } from './ChatWindowDemo'
import '../../../stories.css'

const meta = {
  title: 'Chat/Conversation',
  component: ChatWindowDemo,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Une fenêtre de discussion entre un visiteur anonyme et les bénévoles, assemblée avec `PrChatThread`, `PrChatMessage`, `PrTypingIndicator`, `PrChatComposer` et `PrStatusDot`. L\'en-tête (avatar, nom, statut) appartient à l\'application.',
      },
    },
  },
} satisfies Meta<typeof ChatWindowDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Conversation: Story = {
  render: () => ({
    components: { ChatWindowDemo },
    template: '<ChatWindowDemo />',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const thread = canvas.getByRole('list', { name: 'Conversation' })
    await expect(thread).toHaveAttribute('aria-live', 'polite')
    await expect(within(thread).getByText('OREMIS écrit')).toBeInTheDocument()

    const field = canvas.getByRole('textbox', { name: 'Votre message' })
    await userEvent.type(field, 'Je ne sais pas à qui en parler.{Enter}')

    await waitFor(() => expect(within(thread).getAllByRole('listitem').at(-1)).toHaveTextContent('Vous : Je ne sais pas à qui en parler.'))
    await expect(field).toHaveValue('')
    // Blank text sends nothing.
    const count = within(thread).getAllByRole('listitem').length
    await userEvent.type(field, '   ')
    await userEvent.click(canvas.getByRole('button', { name: 'Envoyer' }))
    await expect(within(thread).getAllByRole('listitem')).toHaveLength(count)
  },
}

export const Multiline: Story = {
  render: () => ({
    components: { ChatWindowDemo },
    template: '<ChatWindowDemo multiline />',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const field = canvas.getByRole('textbox', { name: 'Votre message' })

    await userEvent.type(field, 'Première ligne{Shift>}{Enter}{/Shift}Deuxième ligne')
    await expect(field).toHaveValue('Première ligne\nDeuxième ligne')
    await userEvent.keyboard('{Enter}')

    const thread = canvas.getByRole('list', { name: 'Conversation' })
    await waitFor(() => expect(within(thread).getAllByRole('listitem').at(-1)).toHaveTextContent('Première ligne Deuxième ligne'))
    await expect(field).toHaveValue('')
  },
}
