import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { PrButton } from '../../atoms/Button'
import { PrToast } from './'
import '../../stories.css'

const meta = {
  title: 'Feedback/Toast',
  component: PrToast,
  tags: ['autodocs'],
  args: {
    title: 'Dossier mis a jour',
    description: 'Les changements ont ete sauvegardes.',
    duration: 5000,
  },
} satisfies Meta<typeof PrToast>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrButton, PrToast },
    setup() {
      const open = ref(false)
      return { args, open }
    },
    template: `
      <div class="story-toast-demo">
        <PrButton @click="open = true">Afficher</PrButton>
        <PrToast v-model:open="open" v-bind="args" />
      </div>
    `,
  }),
}

export const WithAction: Story = {
  render: () => ({
    components: { PrButton, PrToast },
    setup() {
      const open = ref(true)
      return { open }
    },
    template: `
      <div class="story-toast-demo">
        <PrButton @click="open = true">Afficher</PrButton>
        <PrToast
          v-model:open="open"
          title="Controle requis"
          description="Une verification manuelle est necessaire."
          action-label="Voir"
        />
      </div>
    `,
  }),
}
