import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { ref } from 'vue'
import { PrButton } from '../../../../components/atoms/Button'
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
    await waitFor(() => expect(boldButton).toHaveAttribute('aria-pressed', 'true'))

    await userEvent.type(editable, ' et en gras')
    await expect(editable.querySelector('strong')).not.toBeNull()

    const infoCalloutButton = canvas.getByRole('button', { name: 'Encadré info' })
    await userEvent.click(infoCalloutButton)
    await expect(editable.querySelector('div[data-callout][data-variant="info"]')).not.toBeNull()
  },
}

// The toolbar is one tab stop (WAI-ARIA toolbar pattern): Tab reaches its last used control, then
// the text; the arrow keys, Home and End move between controls. Toggle buttons say if they are on.
export const ToolbarKeyboard: Story = {
  render: () => ({
    components: { PrRichTextEditor },
    setup() {
      const value = ref('<p>Texte</p>')
      return { value }
    },
    template: '<div class="story-column"><PrRichTextEditor v-model="value" label="Contenu" /></div>',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heading = canvas.getByRole('button', { name: 'Titre' })
    const editable = canvasElement.querySelector<HTMLElement>('.tiptap')!

    await waitFor(() => expect(heading).toHaveAttribute('tabindex', '0'))
    await userEvent.tab()
    await expect(heading).toHaveFocus()
    await userEvent.tab()
    await expect(editable).toHaveFocus()
    await userEvent.tab({ shift: true })
    await expect(heading).toHaveFocus()

    await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}')
    const italic = canvas.getByRole('button', { name: 'Italique' })
    await expect(italic).toHaveFocus()
    await expect(italic).toHaveAttribute('aria-pressed', 'false')
    await userEvent.keyboard('{End}')
    await expect(canvas.getByRole('button', { name: 'Insérer un emoji' })).toHaveFocus()
    await userEvent.keyboard('{Home}')
    await expect(heading).toHaveFocus()

    // Italic on the selected text: the button says so (it never did, `isActive('pr:italic')`).
    await userEvent.click(editable)
    await userEvent.keyboard('{Control>}a{/Control}')
    await userEvent.click(italic)
    await waitFor(() => expect(italic).toHaveAttribute('aria-pressed', 'true'))
    await expect(editable.querySelector('em')).not.toBeNull()

    // Tab comes back to the control used last.
    await userEvent.tab({ shift: true })
    await expect(italic).toHaveFocus()
  },
}

// The emoji button opens a menu: arrow keys between emoji (named in French), Escape closes it and
// gives the focus back. The play leaves it open, an emoji focused, for the accessibility check.
export const EmojiPickerKeyboard: Story = {
  render: () => ({
    components: { PrRichTextEditor },
    setup() {
      const value = ref('<p>Texte</p>')
      return { value }
    },
    template: '<div class="story-column"><PrRichTextEditor v-model="value" label="Contenu" /></div>',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Insérer un emoji' })
    await expect(trigger).toHaveAttribute('aria-haspopup', 'menu')

    trigger.focus()
    await userEvent.keyboard('{Enter}')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const menu = await canvas.findByRole('menu')
    await expect(canvas.getByRole('menuitem', { name: 'Ampoule' })).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByRole('menuitem', { name: 'Coche' })).toHaveFocus()
    await userEvent.keyboard('{End}')
    await expect(canvas.getByRole('menuitem', { name: 'Visage souriant' })).toHaveFocus()

    await userEvent.keyboard('{Escape}')
    await expect(menu).not.toBeInTheDocument()
    await expect(trigger).toHaveFocus()

    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{ArrowRight}')
    const focused = canvas.getByRole('menuitem', { name: 'Coche' })
    await expect(focused).toHaveFocus()
    await expect(getComputedStyle(focused).outlineStyle).toBe('solid')
  },
}

// The text color input is invisible (opacity 0) over its icon: its focus ring is on the icon's frame.
export const ColorPickerFocus: Story = {
  render: () => ({
    components: { PrRichTextEditor },
    setup() {
      const value = ref('<p>Texte</p>')
      return { value }
    },
    template: '<div class="story-column"><PrRichTextEditor v-model="value" label="Contenu" /></div>',
  }),
  play: async ({ canvasElement }) => {
    const heading = within(canvasElement).getByRole('button', { name: 'Titre' })
    await waitFor(() => expect(heading).toHaveAttribute('tabindex', '0'))
    await userEvent.tab()
    // Titre, Sous-titre, Gras, Italique, Indice, Exposant, Lien, Surligner, then the color.
    await userEvent.keyboard('{ArrowRight}'.repeat(8))

    const input = canvasElement.querySelector<HTMLInputElement>('input[type="color"]')!
    await expect(input).toHaveFocus()
    const frame = input.closest('label')!
    await expect(getComputedStyle(frame).outlineStyle).toBe('solid')
    await expect(getComputedStyle(frame).outlineWidth).toBe('2px')
    await expect(getComputedStyle(frame).outlineOffset).toBe('2px')
  },
}

// What the editor writes for assistive technologies: alternative text of images, `scope` of table
// headers, names of checklist boxes, a text prefix in callouts (hidden visually), underlined links.
export const AccessibleContent: Story = {
  render: () => ({
    components: { PrRichTextEditor },
    setup() {
      const image = URL.createObjectURL(new Blob(['<svg xmlns="http://www.w3.org/2000/svg" width="320" height="120"><rect width="320" height="120" fill="#2f5bea"/></svg>'], { type: 'image/svg+xml' }))
      const value = ref(`
        <p>Un <a href="https://www.oremis.fr">lien vers le site</a> dans le texte.</p>
        <img src="${image}" alt="Bandeau bleu de la formation">
        <table><tbody><tr><th>Bénévole</th><th>Mission</th></tr><tr><td>Camille MARTIN</td><td>Accueil</td></tr></tbody></table>
        <ul data-type="taskList"><li data-type="taskItem" data-checked="true"><p>Préparer la salle</p></li></ul>
        <div data-callout data-variant="warning"><p>Fermé le lundi.</p></div>
        <details><summary>Pour aller plus loin</summary><div data-type="detailsContent"><p>Ressources.</p></div></details>
      `)
      return { value }
    },
    template: '<div class="story-column"><PrRichTextEditor v-model="value" label="Contenu" /></div>',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const editable = canvasElement.querySelector<HTMLElement>('.tiptap')!

    await expect(canvas.getByRole('img', { name: 'Bandeau bleu de la formation' })).toBeInTheDocument()
    await expect(editable.querySelectorAll('th[scope="col"]')).toHaveLength(2)
    await expect(canvas.getByRole('checkbox', { name: 'Préparer la salle' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Déplier la section' })).toBeInTheDocument()

    const prefix = editable.querySelector<HTMLElement>('[data-callout-prefix]')!
    await expect(prefix).toHaveTextContent('Attention :')
    await expect(prefix.getBoundingClientRect().width).toBeLessThanOrEqual(1)

    const link = canvas.getByRole('link', { name: 'lien vers le site' })
    await expect(getComputedStyle(link).textDecorationLine).toBe('underline')
  },
}

// After the upload, the editor asks for the image's alternative text (or "decorative") before
// inserting it. The play inserts one, then opens the panel again on it for the accessibility check.
export const ImageAlternativeText: Story = {
  render: () => ({
    components: { PrButton, PrRichTextEditor },
    setup() {
      const value = ref('<p>Texte</p>')
      const editorRef = ref<InstanceType<typeof PrRichTextEditor> | null>(null)
      const image = URL.createObjectURL(new Blob(['<svg xmlns="http://www.w3.org/2000/svg" width="320" height="120"><rect width="320" height="120" fill="#2f5bea"/></svg>'], { type: 'image/svg+xml' }))
      const uploadImage = async () => image

      function simulateUpload() {
        editorRef.value?.insertImageFromFile(new File(['image'], 'atelier.svg', { type: 'image/svg+xml' }))
      }

      return { value, editorRef, uploadImage, simulateUpload }
    },
    template: `
      <div class="story-column">
        <PrButton variant="secondary" @click="simulateUpload">Simuler l'envoi d'une image</PrButton>
        <PrRichTextEditor ref="editorRef" v-model="value" label="Contenu" :upload-image="uploadImage" />
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const editable = canvasElement.querySelector<HTMLElement>('.tiptap')!

    await userEvent.click(canvas.getByRole('button', { name: 'Simuler l\'envoi d\'une image' }))
    const altInput = await canvas.findByRole('textbox', { name: 'Texte alternatif' })
    await expect(altInput).toHaveFocus()

    await userEvent.click(canvas.getByRole('button', { name: 'Insérer l\'image' }))
    await expect(canvas.getByText('Saisissez un texte alternatif, ou cochez « Image décorative ».')).toBeVisible()
    await expect(editable.querySelector('img')).toBeNull()

    await userEvent.type(altInput, 'Atelier de sensibilisation{Enter}')
    await waitFor(() => expect(editable.querySelector('img')).toHaveAttribute('alt', 'Atelier de sensibilisation'))

    // A second upload leaves the panel open for the accessibility check.
    await userEvent.click(canvas.getByRole('button', { name: 'Simuler l\'envoi d\'une image' }))
    await canvas.findByRole('textbox', { name: 'Texte alternatif' })
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

// Bullet and numbered lists keep their markers and indent, in the editor as in a read-only render.
// noinspection JSUnusedGlobalSymbols
export const Lists: Story = {
  render: () => ({
    template: `
      <div class="pr-editor-content">
        <ul><li>Premier point<ul><li>Sous-point</li></ul></li><li>Second point</li></ul>
        <ol><li>Etape un</li><li>Etape deux</li></ol>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const [bullets, nested] = canvasElement.querySelectorAll('ul')
    const numbers = canvasElement.querySelector('ol')!
    await expect(getComputedStyle(bullets).listStyleType).toBe('disc')
    await expect(getComputedStyle(nested).listStyleType).toBe('circle')
    await expect(getComputedStyle(numbers).listStyleType).toBe('decimal')
    await expect(parseFloat(getComputedStyle(bullets).paddingLeft)).toBeGreaterThan(0)
  },
}
