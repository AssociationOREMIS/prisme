import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import { PrChatComposer } from '../../../../components/molecules/ChatComposer'
import '../../../stories.css'

const meta = {
  title: 'Chat/Composer',
  component: PrChatComposer,
  tags: ['autodocs'],
  args: {
    multiline: false,
    disabled: false,
    onSend: fn(),
  },
} satisfies Meta<typeof PrChatComposer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrChatComposer },
    setup() {
      const draft = ref('')
      return { args, draft }
    },
    template: '<div style="max-width: 24rem;"><PrChatComposer v-bind="args" v-model="draft" /></div>',
  }),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const field = canvas.getByRole('textbox', { name: 'Votre message' })

    await userEvent.click(canvas.getByRole('button', { name: 'Envoyer' }))
    await expect(args.onSend).not.toHaveBeenCalled()

    await userEvent.type(field, '  Bonjour  {Enter}')
    await expect(args.onSend).toHaveBeenCalledWith('Bonjour')
    await expect(field).toHaveValue('')
  },
}

export const Multiline: Story = {
  args: { multiline: true },
  render: Default.render,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const field = canvas.getByRole('textbox', { name: 'Votre message' })

    await userEvent.type(field, 'Ligne 1{Shift>}{Enter}{/Shift}Ligne 2')
    await expect(args.onSend).not.toHaveBeenCalled()
    await userEvent.keyboard('{Enter}')
    await expect(args.onSend).toHaveBeenCalledWith('Ligne 1\nLigne 2')
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  render: Default.render,
}
