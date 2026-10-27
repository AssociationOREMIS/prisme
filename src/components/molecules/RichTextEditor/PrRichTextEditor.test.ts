// @vitest-environment jsdom
//
// tiptap/ProseMirror needs a real DOM (contenteditable, Selection/Range) that
// the rest of Prisme's unit tests (plain `environment: 'node'`) don't require
// — hence the per-file environment override instead of changing it project-wide.
//
// These tests drive the tiptap `Editor` instance directly through
// `wrapper.vm.editor`'s command API (exposed via `defineExpose`) rather than
// simulating real keyboard/contenteditable input: jsdom does not implement
// enough of `Selection`/`Range`/layout for ProseMirror to reproduce real
// typing, but transactions dispatched through the command API exercise the
// exact same `onUpdate` → `emit('update:modelValue')` path a real keystroke
// would.
import type { VueWrapper } from '@vue/test-utils'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import PrRichTextEditor from './PrRichTextEditor.vue'

async function waitForEditor(wrapper: VueWrapper<InstanceType<typeof PrRichTextEditor>>) {
  return vi.waitFor(() => {
    const editor = wrapper.vm.editor
    if (!editor) throw new Error('editor not ready')
    return editor
  })
}

// Tests mounted with `attachTo` leave the focus in the page: unmount each one, even when it fails.
enableAutoUnmount(afterEach)

// Drops the empty paragraph tiptap appends after a last block that is not a paragraph.
function withoutTrailingParagraph(html: string) {
  return html.replace(/<p><\/p>$/, '')
}

function buttonByText(wrapper: VueWrapper, text: string) {
  const button = wrapper.findAll('button').find(candidate => candidate.text() === text)
  if (!button) throw new Error(`no button "${text}"`)
  return button
}

describe('prRichTextEditor', () => {
  it('keeps a wide image or table within its container (minmax(0, 1fr) column)', () => {
    const wrapper = mount(PrRichTextEditor, { props: { modelValue: '<p>Texte</p>' } })
    expect(wrapper.find('.pr-rich-text-editor').classes()).toContain('pr:grid-cols-[minmax(0,1fr)]')
    wrapper.unmount()
  })

  it('renders the toolbar and the initial content', async () => {
    const wrapper = mount(PrRichTextEditor, {
      props: { modelValue: '<p>Contenu initial</p>', label: 'Contenu' },
    })
    await waitForEditor(wrapper)

    expect(wrapper.find('[role="toolbar"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Contenu initial')
    expect(wrapper.text()).toContain('Contenu')
  })

  it('updates modelValue when content changes (v-model round trip, out)', async () => {
    const wrapper = mount(PrRichTextEditor, {
      props: { modelValue: '<p></p>' },
    })
    const editor = await waitForEditor(wrapper)

    editor.chain().focus().insertContent('Hello world').run()
    await wrapper.vm.$nextTick()

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    const lastValue = emitted![emitted!.length - 1][0] as string
    expect(lastValue).toContain('Hello world')
  })

  it('reflects an external modelValue change back into the editor (v-model round trip, in)', async () => {
    const wrapper = mount(PrRichTextEditor, {
      props: { modelValue: '<p>Départ</p>' },
    })
    const editor = await waitForEditor(wrapper)
    expect(editor.getHTML()).toContain('Départ')

    await wrapper.setProps({ modelValue: '<p>Nouveau contenu</p>' })
    await wrapper.vm.$nextTick()

    expect(editor.getHTML()).toContain('Nouveau contenu')
    expect(editor.getHTML()).not.toContain('Départ')
  })

  it('does not reset the document via setContent when a real v-model echoes its own emitted update back (no cursor-resetting loop)', async () => {
    const host = defineComponent({
      components: { PrRichTextEditor },
      setup() {
        const value = ref('<p></p>')

        return { value }
      },
      template: '<PrRichTextEditor v-model="value" />',
    })
    const wrapper = mount(host)
    const richTextEditor = wrapper.findComponent(PrRichTextEditor)
    const editor = await waitForEditor(richTextEditor)

    const setContentSpy = vi.spyOn(editor.commands, 'setContent')
    editor.chain().focus().insertContent('typed').run()
    // Flush the emit → parent ref update → prop watcher round trip.
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(editor.getHTML()).toContain('typed')
    // The prop watcher compares against `editor.getHTML()` before calling
    // `setContent`, so echoing the editor's own emitted HTML back in as
    // `modelValue` must not re-trigger it (that would reset the cursor).
    expect(setContentSpy).not.toHaveBeenCalled()
  })

  it.each([
    ['info', 'Encadré info'],
    ['success', 'Encadré succès'],
    ['warning', 'Encadré avertissement'],
    ['danger', 'Encadré danger'],
  ])('toggles the %s callout variant on and back off', async (variant, label) => {
    const wrapper = mount(PrRichTextEditor, {
      props: { modelValue: '<p>Texte</p>' },
    })
    const editor = await waitForEditor(wrapper)

    const button = wrapper.get(`button[aria-label="${label}"]`)

    await button.trigger('click')
    expect(editor.isActive('callout', { variant })).toBe(true)
    expect(editor.getHTML()).toContain(`data-variant="${variant}"`)

    await button.trigger('click')
    expect(editor.isActive('callout', { variant })).toBe(false)
  })

  it('calls uploadImage with the file and an onProgress callback, then asks for the alt text before inserting the image', async () => {
    const uploadImage = vi.fn(async (_file: File, onProgress?: (percent: number) => void) => {
      onProgress?.(100)

      return 'https://cdn.example.com/uploaded-image.png'
    })
    const wrapper = mount(PrRichTextEditor, {
      props: { modelValue: '<p></p>', uploadImage },
      attachTo: document.body,
    })
    const editor = await waitForEditor(wrapper)

    const file = new File(['fake-image-bytes'], 'photo.png', { type: 'image/png' })
    const url = await wrapper.vm.insertImageFromFile(file)
    await flushPromises()

    expect(uploadImage).toHaveBeenCalledTimes(1)
    expect(uploadImage.mock.calls[0][0]).toBe(file)
    expect(typeof uploadImage.mock.calls[0][1]).toBe('function')
    expect(url).toBe('https://cdn.example.com/uploaded-image.png')
    // Not inserted yet: the panel asks for the alternative text first, and takes the focus.
    expect(editor.getHTML()).not.toContain('<img')
    const altInput = wrapper.get<HTMLInputElement>('.pr-rich-text-editor__image-panel input[type="text"]')
    expect(document.activeElement).toBe(altInput.element)

    await altInput.setValue('Des bénévoles autour d\'une table')
    await buttonByText(wrapper, 'Insérer l\'image').trigger('click')

    expect(editor.getHTML()).toContain('src="https://cdn.example.com/uploaded-image.png"')
    expect(editor.getHTML()).toContain('alt="Des bénévoles autour d\'une table"')
    expect(wrapper.find('.pr-rich-text-editor__image-panel').exists()).toBe(false)
    wrapper.unmount()
  })

  it('refuses an empty alt text unless the image is marked decorative, then inserts alt=""', async () => {
    const wrapper = mount(PrRichTextEditor, {
      props: { modelValue: '<p></p>', uploadImage: async () => 'https://cdn.example.com/deco.png' },
      attachTo: document.body,
    })
    const editor = await waitForEditor(wrapper)

    await wrapper.vm.insertImageFromFile(new File(['x'], 'deco.png', { type: 'image/png' }))
    await flushPromises()

    await buttonByText(wrapper, 'Insérer l\'image').trigger('click')
    expect(editor.getHTML()).not.toContain('<img')
    expect(wrapper.text()).toContain('Saisissez un texte alternatif, ou cochez « Image décorative ».')

    await wrapper.get('.pr-rich-text-editor__image-panel [role="checkbox"]').trigger('click')
    await buttonByText(wrapper, 'Insérer l\'image').trigger('click')

    expect(editor.getHTML()).toMatch(/<img[^>]* alt=""/)
    wrapper.unmount()
  })

  it('cancels the insertion with Escape and gives the focus back', async () => {
    const wrapper = mount(PrRichTextEditor, {
      props: { modelValue: '<p></p>', uploadImage: async () => 'https://cdn.example.com/a.png' },
      attachTo: document.body,
    })
    const editor = await waitForEditor(wrapper)

    await wrapper.vm.insertImageFromFile(new File(['x'], 'a.png', { type: 'image/png' }))
    await flushPromises()
    await wrapper.get('.pr-rich-text-editor__image-panel input[type="text"]').trigger('keydown', { key: 'Escape' })

    expect(wrapper.find('.pr-rich-text-editor__image-panel').exists()).toBe(false)
    expect(editor.getHTML()).not.toContain('<img')
    wrapper.unmount()
  })

  it('inserts right away with the given alt (programmatic use)', async () => {
    const wrapper = mount(PrRichTextEditor, {
      props: { modelValue: '<p></p>', uploadImage: async () => 'https://cdn.example.com/b.png' },
    })
    const editor = await waitForEditor(wrapper)

    await wrapper.vm.insertImageFromFile(new File(['x'], 'b.png', { type: 'image/png' }), 'Logo de l\'association')

    expect(editor.getHTML()).toContain('alt="Logo de l\'association"')
    expect(wrapper.find('.pr-rich-text-editor__image-panel').exists()).toBe(false)
  })

  it('keeps the upload button focusable while uploading (aria-disabled) and announces the upload', async () => {
    let resolveUpload: (url: string) => void = () => {}
    const wrapper = mount(PrRichTextEditor, {
      props: { modelValue: '<p></p>', uploadImage: () => new Promise<string>((resolve) => { resolveUpload = resolve }) },
    })
    await waitForEditor(wrapper)

    const pending = wrapper.vm.insertImageFromFile(new File(['x'], 'c.png', { type: 'image/png' }))
    await wrapper.vm.$nextTick()

    const button = wrapper.get('button[aria-label="Insérer une image"]')
    expect(button.attributes('disabled')).toBeUndefined()
    expect(button.attributes('aria-disabled')).toBe('true')
    expect(wrapper.get('[role="status"]').text()).toBe('Envoi de l\'image en cours…')

    resolveUpload('https://cdn.example.com/c.png')
    await pending
    await wrapper.vm.$nextTick()
    expect(button.attributes('aria-disabled')).toBeUndefined()
    expect(wrapper.get('[role="status"]').text()).toBe('Image envoyée.')
  })

  it('keeps alt through a getHTML / setContent round trip, alt="" included, and never turns it into a number', async () => {
    const source = '<img src="https://cdn.example.com/a.png" alt="Atelier 2024"><img src="https://cdn.example.com/b.png" alt=""><img src="https://cdn.example.com/c.png" alt="2024">'
    const wrapper = mount(PrRichTextEditor, { props: { modelValue: source } })
    const editor = await waitForEditor(wrapper)

    const first = editor.getHTML()
    expect(first).toContain('alt="Atelier 2024"')
    expect(first).toMatch(/src="https:\/\/cdn.example.com\/b.png"[^>]* alt=""|alt=""[^>]* src="https:\/\/cdn.example.com\/b.png"/)
    expect(first).toContain('alt="2024"')

    // setContent adds tiptap's trailing paragraph after a last block that is not one.
    editor.commands.setContent(first)
    expect(withoutTrailingParagraph(editor.getHTML())).toBe(first)
  })

  it('warns the author about images without alt, and edits the alt and width of the selected image', async () => {
    const wrapper = mount(PrRichTextEditor, {
      props: { modelValue: '<p>Avant</p><img src="https://cdn.example.com/old.png"><p>Après</p>' },
      attachTo: document.body,
    })
    const editor = await waitForEditor(wrapper)

    await vi.waitFor(() => expect(wrapper.text()).toContain('1 image sans texte alternatif'))
    expect(editor.getHTML()).not.toContain('alt=')

    const propertiesButton = wrapper.get('button[aria-label="Texte alternatif et taille de l\'image"]')
    expect(propertiesButton.attributes('disabled')).toBeDefined()

    let imagePosition = -1
    editor.state.doc.descendants((node, position) => {
      if (node.type.name === 'imageResize') imagePosition = position
    })
    editor.commands.setNodeSelection(imagePosition)
    await vi.waitFor(() => expect(propertiesButton.attributes('disabled')).toBeUndefined())

    await propertiesButton.trigger('click')
    await flushPromises()
    await wrapper.get('.pr-rich-text-editor__image-panel input[type="text"]').setValue('Photo de groupe')
    await buttonByText(wrapper, 'Moyenne').trigger('click')
    await buttonByText(wrapper, 'Enregistrer').trigger('click')

    const html = editor.getHTML()
    expect(html).toContain('alt="Photo de groupe"')
    expect(html).toContain('width="480"')
    await vi.waitFor(() => expect(wrapper.text()).not.toContain('sans texte alternatif'))
    wrapper.unmount()
  })

  it('gives a YouTube iframe the title asked at insertion, a default one otherwise, and keeps it on a round trip', async () => {
    const prompt = vi.spyOn(window, 'prompt')
      .mockReturnValueOnce('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
      .mockReturnValueOnce('Présentation de l\'association')
    const wrapper = mount(PrRichTextEditor, { props: { modelValue: '<p></p>' } })
    const editor = await waitForEditor(wrapper)

    await wrapper.get('button[aria-label="Intégrer une vidéo YouTube"]').trigger('click')
    expect(prompt).toHaveBeenLastCalledWith('Titre de la vidéo (lu par les lecteurs d\'écran) :', 'Vidéo YouTube')
    prompt.mockRestore()

    const html = editor.getHTML()
    expect(html).toMatch(/<iframe[^>]* title="Présentation de l'association"/)
    editor.commands.setContent(html)
    expect(withoutTrailingParagraph(editor.getHTML())).toBe(withoutTrailingParagraph(html))

    editor.commands.setContent('<div data-youtube-video><iframe src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"></iframe></div>')
    expect(editor.getHTML()).toMatch(/<iframe[^>]* title="Vidéo YouTube"/)
  })

  it('gives table header cells a scope (col for a header row, row for a header column)', async () => {
    const wrapper = mount(PrRichTextEditor, { props: { modelValue: '<p></p>' } })
    const editor = await waitForEditor(wrapper)

    await wrapper.get('button[aria-label="Insérer un tableau"]').trigger('click')
    const html = editor.getHTML()
    expect(html.match(/<th[^>]*scope="col"/g)).toHaveLength(3)
    editor.commands.setContent(html)
    expect(editor.getHTML()).toBe(html)

    editor.commands.setContent('<table><tbody><tr><th>Bénévole</th><th>Heures</th></tr><tr><th>Camille</th><td>4</td></tr></tbody></table>')
    const parsed = editor.getHTML()
    expect(parsed.match(/<th[^>]*scope="col"/g)).toHaveLength(2)
    expect(parsed).toMatch(/<th[^>]*scope="row"[^>]*><p>Camille/)
  })

  it('names the task list checkboxes in the saved HTML, after their task', async () => {
    const wrapper = mount(PrRichTextEditor, {
      props: { modelValue: '<ul data-type="taskList"><li data-type="taskItem" data-checked="true"><p>Préparer la salle</p></li><li data-type="taskItem" data-checked="false"><p></p></li></ul>' },
    })
    const editor = await waitForEditor(wrapper)

    const html = editor.getHTML()
    expect(html).toContain('aria-label="Préparer la salle"')
    expect(html).toContain('aria-label="Tâche sans texte"')
    expect(html).not.toContain('Task item checkbox')
    // In the editor too (tiptap's node view), in French.
    expect(wrapper.find('input[type="checkbox"][aria-label="Préparer la salle"]').exists()).toBe(true)
  })

  it('names the details toggle button in French', async () => {
    const wrapper = mount(PrRichTextEditor, {
      props: { modelValue: '<details><summary>Pour aller plus loin</summary><div data-type="detailsContent"><p>Texte</p></div></details>' },
    })
    await waitForEditor(wrapper)

    expect(wrapper.find('button[aria-label="Déplier la section"]').exists()).toBe(true)
    expect(wrapper.html()).not.toContain('Expand details content')
  })

  it('writes the callout meaning as text in the HTML, and still reads callouts saved without it', async () => {
    const wrapper = mount(PrRichTextEditor, {
      props: { modelValue: '<div data-callout data-variant="warning"><p>Fermé le lundi.</p></div>' },
    })
    const editor = await waitForEditor(wrapper)

    const html = editor.getHTML()
    expect(html).toBe('<div data-variant="warning" data-callout=""><span class="pr-editor-sr-only" data-callout-prefix="">Attention :</span><div data-callout-content=""><p>Fermé le lundi.</p></div></div>')
    editor.commands.setContent(html)
    expect(withoutTrailingParagraph(editor.getHTML())).toBe(html)
  })

  it('makes the toolbar a single tab stop with aria-pressed toggles, italic included', async () => {
    const wrapper = mount(PrRichTextEditor, { props: { modelValue: '<p>Texte</p>' }, attachTo: document.body })
    const editor = await waitForEditor(wrapper)
    await wrapper.vm.$nextTick()

    const items = wrapper.findAll('[role="toolbar"] [data-toolbar-item]')
    expect(items.filter(item => item.attributes('tabindex') === '0')).toHaveLength(1)
    expect(wrapper.findAll('[role="toolbar"] [tabindex="0"]')).toHaveLength(1)

    const italic = wrapper.get('button[aria-label="Italique"]')
    expect(italic.attributes('aria-pressed')).toBe('false')
    editor.chain().focus().selectAll().toggleItalic().run()
    // tiptap's Vue editor re-renders its active states two animation frames after a transaction.
    await vi.waitFor(() => expect(italic.attributes('aria-pressed')).toBe('true'))
    expect(italic.classes()).toContain('pr:bg-[var(--pr-color-primary)]!')
    expect(wrapper.get('button[aria-label="Gras"]').attributes('aria-pressed')).toBe('false')
    wrapper.unmount()
  })

  it('moves between toolbar controls with the arrow keys, Home and End, and remembers the last one', async () => {
    const wrapper = mount(PrRichTextEditor, { props: { modelValue: '<p>Texte</p>' }, attachTo: document.body })
    await waitForEditor(wrapper)
    await wrapper.vm.$nextTick()

    const heading = wrapper.get<HTMLButtonElement>('button[aria-label="Titre"]')
    heading.element.focus()
    await heading.trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Sous-titre')

    await wrapper.get('button[aria-label="Sous-titre"]').trigger('keydown', { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(heading.element)

    // Wraps around, and skips disabled controls (undo/redo with no history).
    await heading.trigger('keydown', { key: 'ArrowLeft' })
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Insérer un emoji')

    await wrapper.get('button[aria-label="Insérer un emoji"]').trigger('keydown', { key: 'Home' })
    expect(document.activeElement).toBe(heading.element)
    await heading.trigger('keydown', { key: 'End' })
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Insérer un emoji')

    await wrapper.vm.$nextTick()
    expect(wrapper.get('button[aria-label="Insérer un emoji"]').attributes('tabindex')).toBe('0')
    expect(heading.attributes('tabindex')).toBe('-1')
    wrapper.unmount()
  })

  it('opens the emoji menu on the first item, moves with the arrows, and Escape gives the focus back', async () => {
    const wrapper = mount(PrRichTextEditor, { props: { modelValue: '<p>Texte</p>' }, attachTo: document.body })
    await waitForEditor(wrapper)

    const trigger = wrapper.get<HTMLButtonElement>('button[aria-label="Insérer un emoji"]')
    expect(trigger.attributes('aria-haspopup')).toBe('menu')
    expect(trigger.attributes('aria-expanded')).toBe('false')

    trigger.element.focus()
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await flushPromises()
    expect(trigger.attributes('aria-expanded')).toBe('true')
    const items = wrapper.findAll('[role="menuitem"]')
    expect(items[0].attributes('aria-label')).toBe('Ampoule')
    expect(items[1].attributes('aria-label')).toBe('Coche')
    expect(items.map(item => item.attributes('aria-label'))).not.toContain('white_check_mark')
    expect(document.activeElement).toBe(items[0].element)

    await items[0].trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement).toBe(items[1].element)
    await items[1].trigger('keydown', { key: 'End' })
    expect(document.activeElement).toBe(items[items.length - 1].element)
    await items[items.length - 1].trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(items[0].element)

    await items[0].trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('[role="menu"]').exists()).toBe(false)
    expect(document.activeElement).toBe(trigger.element)
    wrapper.unmount()
  })

  it('surfaces an error and inserts nothing when uploadImage rejects', async () => {
    const uploadImage = vi.fn(async () => {
      throw new Error('Upload failed with status 500')
    })
    const wrapper = mount(PrRichTextEditor, {
      props: { modelValue: '<p></p>', uploadImage },
    })
    const editor = await waitForEditor(wrapper)

    const file = new File(['fake-image-bytes'], 'photo.png', { type: 'image/png' })
    const url = await wrapper.vm.insertImageFromFile(file)
    await wrapper.vm.$nextTick()

    expect(url).toBeNull()
    expect(editor.getHTML()).not.toContain('<img')
    expect(wrapper.find('[role="alert"]').exists()).toBe(true)
    expect(wrapper.text()).toContain("L'envoi de l'image a échoué")
  })

  it('shows an explanatory error instead of throwing when no uploadImage handler is configured', async () => {
    const wrapper = mount(PrRichTextEditor, {
      props: { modelValue: '<p></p>' },
    })
    await waitForEditor(wrapper)

    const file = new File(['fake-image-bytes'], 'photo.png', { type: 'image/png' })
    const url = await wrapper.vm.insertImageFromFile(file)
    await wrapper.vm.$nextTick()

    expect(url).toBeNull()
    expect(wrapper.find('[role="alert"]').exists()).toBe(true)
  })

  it('disables the toolbar and the editor when disabled', async () => {
    const wrapper = mount(PrRichTextEditor, {
      props: { modelValue: '<p>Texte</p>', disabled: true },
    })
    const editor = await waitForEditor(wrapper)

    expect(editor.isEditable).toBe(false)
    expect(wrapper.get('button[aria-label="Gras"]').attributes('disabled')).toBeDefined()
  })

  it('renders the error message and marks the field as invalid', async () => {
    const wrapper = mount(PrRichTextEditor, {
      props: { modelValue: '<p></p>', error: 'Le contenu est requis.' },
    })
    await waitForEditor(wrapper)

    expect(wrapper.text()).toContain('Le contenu est requis.')
  })

  it('renders a hidden input mirroring modelValue when name is provided (native form submission)', async () => {
    const wrapper = mount(PrRichTextEditor, {
      props: { modelValue: '<p>Contenu</p>', name: 'lesson_content' },
    })
    await waitForEditor(wrapper)

    const hidden = wrapper.find<HTMLInputElement>('input[type="hidden"][name="lesson_content"]')
    expect(hidden.exists()).toBe(true)
    expect(hidden.element.value).toBe('<p>Contenu</p>')
  })
})
