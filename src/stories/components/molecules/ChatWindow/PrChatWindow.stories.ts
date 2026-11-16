import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import { PrButton } from '../../../../components/atoms/Button'
import { PrChatComposer } from '../../../../components/molecules/ChatComposer'
import { PrChatMessage } from '../../../../components/molecules/ChatMessage'
import { PrChatThread } from '../../../../components/molecules/ChatThread'
import { PrChatWindow } from '../../../../components/molecules/ChatWindow'
import '../../../stories.css'

const meta = {
  title: 'Chat/Window',
  component: PrChatWindow,
  tags: ['autodocs'],
  args: {
    title: 'OREMIS',
    status: 'Un bénévole vous répond',
  },
} satisfies Meta<typeof PrChatWindow>

export default meta
type Story = StoryObj<typeof meta>

// The frame of a chat: header (avatar, name, availability, actions), the thread, the composer.
export const Default: Story = {
  render: (args) => ({
    components: { PrButton, PrChatComposer, PrChatMessage, PrChatThread, PrChatWindow },
    setup() {
      const draft = ref('')
      const messages = ref<Array<{ id: number, author: 'self' | 'other' | 'system', text: string }>>([
        { id: 1, author: 'system', text: 'Vous êtes en contact avec OREMIS. Cette conversation est anonyme.' },
        { id: 2, author: 'other', text: 'Bonjour, je suis bénévole chez OREMIS. Je vous écoute.' },
      ])
      const send = (text: string) => messages.value.push({ id: messages.value.length + 1, author: 'self', text })
      return { args, draft, messages, send }
    },
    template: `
      <PrChatWindow v-bind="args">
        <template #actions>
          <PrButton variant="ghost" size="sm">Terminer</PrButton>
        </template>
        <PrChatThread :count="messages.length">
          <PrChatMessage v-for="m in messages" :key="m.id" :author="m.author" :sender="m.author === 'other' ? 'OREMIS' : undefined">{{ m.text }}</PrChatMessage>
        </PrChatThread>
        <template #footer>
          <PrChatComposer v-model="draft" @send="send" />
        </template>
      </PrChatWindow>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('region', { name: 'OREMIS' })).toBeTruthy()
    await userEvent.type(canvas.getByRole('textbox', { name: 'Votre message' }), 'Bonjour{Enter}')
    await expect(canvas.getByText('Bonjour')).toBeTruthy()
  },
}
