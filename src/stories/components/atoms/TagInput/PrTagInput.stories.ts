import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { PrTagInput } from '../../../../components/atoms/TagInput'
import '../../../stories.css'

const meta = {
  title: 'Forms/TagInput',
  component: PrTagInput,
  tags: ['autodocs'],
  args: {
    label: 'Mots-clés',
    placeholder: 'Ajouter...',
    hint: 'Appuyez sur Entrée ou virgule pour valider',
    error: '',
    disabled: false,
    required: false,
  },
} satisfies Meta<typeof PrTagInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrTagInput },
    setup() {
      const tags = ref(['vue', 'laravel'])
      return { args, tags }
    },
    template: '<div class="story-column"><PrTagInput v-model="tags" v-bind="args" /></div>',
  }),
}

export const EmailList: Story = {
  render: () => ({
    components: { PrTagInput },
    setup() {
      const emails = ref(['admin@oremis.fr'])
      return { emails }
    },
    template: `
      <div class="story-column">
        <PrTagInput
          v-model="emails"
          label="Destinataires"
          placeholder="Ajouter une adresse email..."
          hint="Appuyez sur Entrée pour ajouter"
        />
      </div>
    `,
  }),
}

export const States: Story = {
  render: () => ({
    components: { PrTagInput },
    setup() {
      const t1 = ref(['design', 'dev'])
      const t2 = ref(['tag1'])
      const t3 = ref(['lecture seule'])
      return { t1, t2, t3 }
    },
    template: `
      <div class="story-column">
        <PrTagInput v-model="t1" label="Par défaut" placeholder="Ajouter..." />
        <PrTagInput v-model="t2" label="Avec erreur" error="Au moins 2 tags sont requis." />
        <PrTagInput v-model="t3" label="Désactivé" disabled />
      </div>
    `,
  }),
}

export const Playground: Story = {
  render: (args) => ({
    components: { PrTagInput },
    setup() {
      const tags = ref<string[]>([])
      return { args, tags }
    },
    template: '<div class="story-column"><PrTagInput v-model="tags" v-bind="args" /></div>',
  }),
}
