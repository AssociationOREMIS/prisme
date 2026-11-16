import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrChatMessage } from '../../../../components/molecules/ChatMessage'
import { PrChatThread } from '../../../../components/molecules/ChatThread'
import '../../../stories.css'

const meta = {
  title: 'Chat/Message',
  component: PrChatMessage,
  tags: ['autodocs'],
  argTypes: {
    author: { control: 'select', options: ['self', 'other', 'system'] },
  },
  args: {
    author: 'other',
    sender: 'OREMIS',
    time: '14:30',
  },
} satisfies Meta<typeof PrChatMessage>

export default meta
type Story = StoryObj<typeof meta>

// A message is a list item: always inside a PrChatThread (or another <ol>/<ul>).
export const Default: Story = {
  render: (args) => ({
    components: { PrChatMessage, PrChatThread },
    setup() {
      return { args }
    },
    template: `
      <div style="max-width: 24rem;">
        <PrChatThread>
          <PrChatMessage v-bind="args">Bonjour, je suis Alex, bénévole. Je vous écoute.</PrChatMessage>
        </PrChatThread>
      </div>
    `,
  }),
}

export const Authors: Story = {
  render: () => ({
    components: { PrChatMessage, PrChatThread },
    template: `
      <div style="max-width: 24rem;">
        <PrChatThread>
          <PrChatMessage author="system">Vous êtes en contact avec OREMIS. Cette conversation est anonyme.</PrChatMessage>
          <PrChatMessage author="other" sender="OREMIS" time="14:30">Bonjour, comment puis-je vous aider ?</PrChatMessage>
          <PrChatMessage author="self" time="14:31" status="Lu">J'ai besoin de parler à quelqu'un, c'est difficile au collège en ce moment.</PrChatMessage>
          <PrChatMessage author="other" time="14:32">Merci de nous écrire. Vous pouvez aussi nous lire ce lien : <a href="#ressources">nos ressources</a>.</PrChatMessage>
          <PrChatMessage author="self" status="Envoyé">D'accord, merci. Voici <a href="#capture">ma capture</a>.</PrChatMessage>
        </PrChatThread>
      </div>
    `,
  }),
}
