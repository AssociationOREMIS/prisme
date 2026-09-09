import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { PrButton } from '../../../../components/atoms/Button'
import { PrToast, PrToastProvider } from '../../../../components/molecules/Toast'
import '../../../stories.css'

const meta = {
  title: 'Feedback/Toast',
  component: PrToast,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'info', 'success', 'warning', 'danger'],
    },
  },
  args: {
    title: 'Dossier mis a jour',
    description: 'Les changements ont ete sauvegardes.',
    duration: 5000,
  },
} satisfies Meta<typeof PrToast>

type Story = StoryObj<typeof meta>

// noinspection JSUnusedGlobalSymbols
export default meta

// noinspection JSUnusedGlobalSymbols
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

// noinspection JSUnusedGlobalSymbols
export const Variants: Story = {
  render: () => ({
    components: { PrButton, PrToast, PrToastProvider },
    setup() {
      const VARIANTS = [
        { variant: 'success' as const, title: 'Benevole ajoute', description: 'Jeanne Dupont a ete ajoutee a la liste.' },
        { variant: 'danger' as const, title: 'Benevole supprime', description: 'Jeanne Dupont a ete retiree de la liste.' },
        { variant: 'warning' as const, title: 'Verification requise', description: 'Certains champs meritent une relecture.' },
        { variant: 'info' as const, title: 'Information', description: 'La liste a ete synchronisee.' },
      ]

      const toasts = ref<Array<{ id: number, open: boolean, variant: typeof VARIANTS[number]['variant'], title: string, description: string }>>([])
      let id = 0

      const addToast = (preset: typeof VARIANTS[number]) => {
        id += 1
        toasts.value.push({ id, open: true, ...preset })
      }

      const onOpenChange = (toast: { id: number, open: boolean }, open: boolean) => {
        toast.open = open
        if (!open) {
          window.setTimeout(() => {
            toasts.value = toasts.value.filter((item) => item.id !== toast.id)
          }, 180)
        }
      }

      return { VARIANTS, addToast, onOpenChange, toasts }
    },
    template: `
      <div class="story-toast-demo">
        <PrToastProvider>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <PrButton v-for="preset in VARIANTS" :key="preset.variant" @click="addToast(preset)">
              {{ preset.variant }}
            </PrButton>
          </div>
          <PrToast
            v-for="toast in toasts"
            :key="toast.id"
            :open="toast.open"
            :variant="toast.variant"
            :title="toast.title"
            :description="toast.description"
            :duration="4000"
            @update:open="onOpenChange(toast, $event)"
          />
        </PrToastProvider>
      </div>
    `,
  }),
}

// noinspection JSUnusedGlobalSymbols
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
            title="Validation requise"
            description="Une verification manuelle est necessaire."
            action-label="Voir"
            @update:open="onOpenChange(toast, $event)"
          />
        </PrToastProvider>
      </div>
    `,
  }),
}
