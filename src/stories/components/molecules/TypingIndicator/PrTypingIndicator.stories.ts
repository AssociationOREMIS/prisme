import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import { PrChatMessage } from '../../../../components/molecules/ChatMessage'
import { PrChatThread } from '../../../../components/molecules/ChatThread'
import { PrTypingIndicator } from '../../../../components/molecules/TypingIndicator'
import '../../../stories.css'

const meta = {
  title: 'Chat/TypingIndicator',
  component: PrTypingIndicator,
  tags: ['autodocs'],
  args: {
    name: 'OREMIS',
  },
} satisfies Meta<typeof PrTypingIndicator>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrChatMessage, PrChatThread, PrTypingIndicator },
    setup() {
      return { args }
    },
    template: `
      <div style="max-width: 24rem;">
        <PrChatThread>
          <PrChatMessage author="self">Bonjour</PrChatMessage>
          <PrTypingIndicator v-bind="args" />
        </PrChatThread>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('OREMIS écrit')).toBeInTheDocument()
  },
}

/** Outside a list, as a `div`. */
export const Standalone: Story = {
  args: { as: 'div', name: 'Alex DURAND' },
}
