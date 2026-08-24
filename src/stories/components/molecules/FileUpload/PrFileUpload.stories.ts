import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { PrFileUpload } from '../../../../components/molecules/FileUpload'
import '../../../stories.css'

const meta = {
  title: 'Forms/FileUpload',
  component: PrFileUpload,
  tags: ['autodocs'],
  args: {
    label: 'Pièces justificatives',
    hint: '',
    error: '',
    multiple: false,
    accept: '',
    disabled: false,
  },
} satisfies Meta<typeof PrFileUpload>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrFileUpload },
    setup() {
      const files = ref<File[]>([])
      return { args, files }
    },
    template: '<div class="story-column"><PrFileUpload v-model="files" v-bind="args" /></div>',
  }),
}

export const Multiple: Story = {
  render: () => ({
    components: { PrFileUpload },
    setup() {
      const files = ref<File[]>([])
      return { files }
    },
    template: `
      <div class="story-column">
        <PrFileUpload
          v-model="files"
          label="Documents (multiple)"
          multiple
          accept=".pdf,.docx"
          :max-size="5 * 1024 * 1024"
          :max-files="3"
          hint="PDF ou Word, max 5 Mo, jusqu'à 3 fichiers"
        />
      </div>
    `,
  }),
}

export const States: Story = {
  render: () => ({
    components: { PrFileUpload },
    setup() {
      const files = ref<File[]>([])
      return { files }
    },
    template: `
      <div class="story-column">
        <PrFileUpload v-model="files" label="Par défaut" />
        <PrFileUpload v-model="files" label="Avec erreur" error="Le fichier dépasse la taille autorisée." />
        <PrFileUpload v-model="files" label="Désactivé" disabled hint="Dépôt de fichiers fermé" />
      </div>
    `,
  }),
}

export const Playground: Story = {
  render: (args) => ({
    components: { PrFileUpload },
    setup() {
      const files = ref<File[]>([])
      return { args, files }
    },
    template: '<div class="story-column"><PrFileUpload v-model="files" v-bind="args" /></div>',
  }),
}
