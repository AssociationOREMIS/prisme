import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { PrButton } from '../../../../components/atoms/Button'
import { PrToast, PrToastProvider } from '../../../../components/molecules/Toast'
import '../../../stories.css'

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
    components: { PrButton, PrToast, PrToastProvider },
    setup() {
      const toasts = ref<Array<{ id: number, open: boolean, title: string, description: string }>>([])
      let id = 0

      const addToast = () => {
        id += 1
        const title = args.title ?? 'Dossier mis a jour'
        const description = args.description ?? 'Les changements ont ete sauvegardes.'
        toasts.value.push({
          id,
          open: true,
          title,
          description: id === 1 ? description : `${description} #${id}`,
        })
      }

      const onOpenChange = (toast: { id: number, open: boolean }, open: boolean) => {
        toast.open = open
        if (!open) {
          window.setTimeout(() => {
            toasts.value = toasts.value.filter((item) => item.id !== toast.id)
          }, 180)
        }
      }

      return { addToast, args, onOpenChange, toasts }
    },
    template: `
      <div class="story-toast-demo">
        <PrToastProvider>
          <PrButton @click="addToast">Afficher</PrButton>
          <PrToast
            v-for="toast in toasts"
            :key="toast.id"
            :open="toast.open"
            :title="toast.title"
            :description="toast.description"
            :duration="args.duration"
            @update:open="onOpenChange(toast, $event)"
          />
        </PrToastProvider>
      </div>
    `,
  }),
}

export const WithAction: Story = {
  render: () => ({
    components: { PrButton, PrToast, PrToastProvider },
    setup() {
      const toasts = ref<Array<{ id: number, open: boolean }>>([{ id: 1, open: true }])
      let id = 1

      const addToast = () => {
        id += 1
        toasts.value.push({ id, open: true })
      }

      const onOpenChange = (toast: { id: number, open: boolean }, open: boolean) => {
        toast.open = open
        if (!open) {
          window.setTimeout(() => {
            toasts.value = toasts.value.filter((item) => item.id !== toast.id)
          }, 180)
        }
      }

      return { addToast, onOpenChange, toasts }
    },
    template: `
      <div class="story-toast-demo">
        <PrToastProvider>
          <PrButton @click="addToast">Afficher</PrButton>
          <PrToast
            v-for="toast in toasts"
            :key="toast.id"
            :open="toast.open"
            title="Controle requis"
            description="Une verification manuelle est necessaire."
            action-label="Voir"
            @update:open="onOpenChange(toast, $event)"
          />
        </PrToastProvider>
      </div>
    `,
  }),
}
