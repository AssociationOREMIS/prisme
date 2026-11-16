import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { MessageCircleHeart, Plus, X } from '@lucide/vue'
import { ref } from 'vue'
import { PrFab } from '../../../../components/molecules/Fab'
import { ChatWindowDemo } from '../ChatThread/ChatWindowDemo'
import '../../../stories.css'

const meta = {
  title: 'Actions/Fab',
  component: PrFab,
  tags: ['autodocs'],
  parameters: { prLayout: 'fullscreen' },
  argTypes: {
    position: { control: 'select', options: ['bottom-right', 'bottom-left'] },
  },
  args: {
    icon: Plus,
    label: 'Ajouter une note',
    position: 'bottom-right',
    offset: '1.5rem',
  },
} satisfies Meta<typeof PrFab>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrFab },
    setup() {
      return { args }
    },
    template: `
      <div style="min-height: 16rem; padding: var(--pr-space-6);">
        <p style="margin: 0; color: var(--pr-color-text-muted);">Le bouton flottant reste en bas de l'écran, au-dessus du contenu.</p>
        <PrFab v-bind="args" />
      </div>
    `,
  }),
}

/** The button opens and closes a chat window attached above it. Escape closes it and gives the focus back to the button. */
export const WithChatWindow: Story = {
  render: () => ({
    components: { ChatWindowDemo, PrFab },
    setup() {
      const open = ref(false)
      const area = ref<HTMLElement | null>(null)
      const chat = ref<{ focusComposer: () => void } | null>(null)

      function toggle() {
        open.value = !open.value
        if (open.value) setTimeout(() => chat.value?.focusComposer())
      }

      function close() {
        open.value = false
        area.value?.querySelector<HTMLElement>('.pr-fab__button')?.focus()
      }

      return { open, toggle, close, area, chat, MessageCircleHeart, X }
    },
    template: `
      <div ref="area" style="min-height: 40rem; padding: var(--pr-space-6);">
        <p style="margin: 0; color: var(--pr-color-text-muted);">Ouvrez la discussion avec le bouton en bas à droite.</p>
        <PrFab
          :icon="MessageCircleHeart"
          :icon-expanded="X"
          label="Discuter avec un bénévole"
          :expanded="open"
          aria-controls="chat-demo"
          @click="toggle"
        >
          <div v-if="open" id="chat-demo" @keydown.esc="close">
            <ChatWindowDemo ref="chat" heading-id="chat-demo-fab-title" />
          </div>
        </PrFab>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const fab = canvas.getByRole('button', { name: 'Discuter avec un bénévole' })
    await expect(fab).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(fab)
    await expect(fab).toHaveAttribute('aria-expanded', 'true')
    const field = await canvas.findByRole('textbox', { name: 'Votre message' })
    await waitFor(() => expect(field).toHaveFocus())

    await userEvent.type(field, 'Bonjour{Enter}')
    const thread = canvas.getByRole('list', { name: 'Conversation' })
    await waitFor(() => expect(within(thread).getAllByRole('listitem').at(-1)).toHaveTextContent('Vous : Bonjour'))

    await userEvent.keyboard('{Escape}')
    await expect(fab).toHaveAttribute('aria-expanded', 'false')
    await expect(fab).toHaveFocus()
    await expect(canvas.queryByRole('region', { name: 'OREMIS' })).toBeNull()

    // Focus given back after a key press: the focus ring shows.
    await expect(getComputedStyle(fab).outlineStyle).toBe('solid')
  },
}

export const BottomLeft: Story = {
  args: { position: 'bottom-left' },
  render: Default.render,
}
