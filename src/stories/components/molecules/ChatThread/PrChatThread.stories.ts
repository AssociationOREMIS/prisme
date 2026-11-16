import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { ref } from 'vue'
import { PrButton } from '../../../../components/atoms/Button'
import { PrChatMessage } from '../../../../components/molecules/ChatMessage'
import { PrChatThread } from '../../../../components/molecules/ChatThread'
import '../../../stories.css'

const meta = {
  title: 'Chat/Thread',
  component: PrChatThread,
  tags: ['autodocs'],
} satisfies Meta<typeof PrChatThread>

export default meta
type Story = StoryObj<typeof meta>

/** The thread follows new messages, unless the reader scrolled up to read an older one. */
export const Default: Story = {
  render: () => ({
    components: { PrButton, PrChatMessage, PrChatThread },
    setup() {
      const messages = ref(Array.from({ length: 8 }, (_, index) => ({
        id: index,
        author: (index % 2 ? 'self' : 'other') as 'self' | 'other',
        text: index % 2 ? `Message de Camille MARTIN n°${index + 1}` : `Réponse d'Alex DURAND n°${index + 1}`,
      })))
      function add() {
        const id = messages.value.length
        messages.value.push({ id, author: 'other', text: `Nouveau message n°${id + 1}` })
      }
      return { messages, add }
    },
    template: `
      <div class="story-column">
        <div style="display: flex; flex-direction: column; height: 18rem; border: 1px solid var(--pr-color-border); border-radius: var(--pr-radius-lg); overflow: hidden;">
          <PrChatThread :count="messages.length">
            <PrChatMessage v-for="message in messages" :key="message.id" :author="message.author" :sender="message.author === 'other' ? 'Alex DURAND' : undefined">{{ message.text }}</PrChatMessage>
          </PrChatThread>
        </div>
        <PrButton variant="secondary" @click="add">Recevoir un message</PrButton>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const thread = canvas.getByRole('list', { name: 'Conversation' })
    const atBottom = () => thread.scrollHeight - thread.scrollTop - thread.clientHeight <= 2

    await waitFor(() => expect(atBottom()).toBe(true))
    await userEvent.click(canvas.getByRole('button', { name: 'Recevoir un message' }))
    await waitFor(() => expect(atBottom()).toBe(true))

    // Scrolled up: a new message does not pull the reader down.
    thread.scrollTop = 0
    thread.dispatchEvent(new Event('scroll'))
    await userEvent.click(canvas.getByRole('button', { name: 'Recevoir un message' }))
    await new Promise(resolve => setTimeout(resolve, 50))
    await expect(thread.scrollTop).toBe(0)
  },
}
