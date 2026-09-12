import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import { PrRichTextEditor } from '../../../../components/molecules/RichTextEditor'
import '../../../stories.css'

const meta = {
  title: 'Forms/RichTextEditor',
  component: PrRichTextEditor,
  tags: ['autodocs'],
  args: {
    label: 'Contenu',
    hint: '',
    error: '',
    disabled: false,
    required: false,
    placeholder: 'Rédigez votre contenu…',
  },
} satisfies Meta<typeof PrRichTextEditor>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrRichTextEditor },
    setup() {
      const value = ref('<p>Bienvenue dans <strong>PrRichTextEditor</strong>.</p>')
      return { args, value }
    },
    template: '<div class="story-column"><PrRichTextEditor v-model="value" v-bind="args" /></div>',
  }),
}

export const States: Story = {
  render: () => ({
    components: { PrRichTextEditor },
    template: `
      <div class="story-column">
        <PrRichTextEditor label="Par défaut" model-value="<p>Texte modifiable.</p>" />
        <PrRichTextEditor label="Avec erreur" model-value="<p></p>" error="Le contenu est requis." />
        <PrRichTextEditor label="Désactivé" model-value="<p>Lecture seule.</p>" disabled />
      </div>
    `,
  }),
}

export const CalloutVariants: Story = {
  render: () => ({
    components: { PrRichTextEditor },
    setup() {
      const value = ref(`
        <div data-callout data-variant="info"><p>Encadré d'information.</p></div>
        <div data-callout data-variant="success"><p>Encadré de succès.</p></div>
        <div data-callout data-variant="warning"><p>Encadré d'avertissement.</p></div>
        <div data-callout data-variant="danger"><p>Encadré de danger.</p></div>
      `)
      return { value }
    },
    template: '<div class="story-column"><PrRichTextEditor v-model="value" label="Variantes de Callout" /></div>',
  }),
}

export const WithImageUpload: Story = {
  render: () => ({
    components: { PrRichTextEditor },
    setup() {
      const value = ref('<p>Déposez ou insérez une image ci-dessous.</p>')

      // Simulates a real backend upload: progress ticks over ~600ms, then
      // resolves with the uploaded file's URL — any file named "fail.*"
      // rejects, like a real endpoint returning an error response would.
      function uploadImage(file: File, onProgress?: (percent: number) => void) {
        return new Promise<string>((resolve, reject) => {
          let percent = 0
          const interval = setInterval(() => {
            percent += 20
            onProgress?.(percent)
            if (percent >= 100) {
              clearInterval(interval)
              if (file.name.startsWith('fail')) {
                reject(new Error('Upload failed with status 500'))
              }
              else {
                resolve(`https://picsum.photos/seed/${encodeURIComponent(file.name)}/640/360`)
              }
            }
          }, 120)
        })
      }

      return { value, uploadImage }
    },
    template: '<div class="story-column"><PrRichTextEditor v-model="value" label="Contenu" hint="Le bouton image insère une image factice." :upload-image="uploadImage" /></div>',
  }),
}

export const Interaction: Story = {
  render: () => ({
    components: { PrRichTextEditor },
    setup() {
      const value = ref('<p></p>')
      return { value }
    },
    template: '<div class="story-column"><PrRichTextEditor v-model="value" label="Contenu" /></div>',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const editable = canvasElement.querySelector<HTMLElement>('.tiptap')
    if (!editable) throw new Error('tiptap content area not found')

    await userEvent.click(editable)
    await userEvent.type(editable, 'Bonjour Prisme')
    await expect(canvas.getByText('Bonjour Prisme')).toBeVisible()

    const boldButton = canvas.getByRole('button', { name: 'Gras' })
    await userEvent.click(boldButton)
    await expect(boldButton).toHaveAttribute('title', 'Gras')

    await userEvent.type(editable, ' et en gras')
    await expect(editable.querySelector('strong')).not.toBeNull()

    const infoCalloutButton = canvas.getByRole('button', { name: 'Encadré info' })
    await userEvent.click(infoCalloutButton)
    await expect(editable.querySelector('div[data-callout][data-variant="info"]')).not.toBeNull()
  },
}

export const Playground: Story = {
  render: (args) => ({
    components: { PrRichTextEditor },
    setup() {
      const value = ref('<p>Terrain de jeu.</p>')
      return { args, value }
    },
    template: '<div class="story-column"><PrRichTextEditor v-model="value" v-bind="args" /></div>',
  }),
}
