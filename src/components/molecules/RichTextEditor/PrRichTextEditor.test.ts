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
import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import PrRichTextEditor from './PrRichTextEditor.vue'

async function waitForEditor(wrapper: VueWrapper) {
  await vi.waitFor(() => {
    if (!(wrapper.vm as any).editor) throw new Error('editor not ready')
  })

  return (wrapper.vm as any).editor
}

describe('prRichTextEditor', () => {
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

  it('calls uploadImage with the file and an onProgress callback, and inserts the resolved URL', async () => {
    const uploadImage = vi.fn(async (_file: File, onProgress?: (percent: number) => void) => {
      onProgress?.(100)

      return 'https://cdn.example.com/uploaded-image.png'
    })
    const wrapper = mount(PrRichTextEditor, {
      props: { modelValue: '<p></p>', uploadImage },
    })
    const editor = await waitForEditor(wrapper)

    const file = new File(['fake-image-bytes'], 'photo.png', { type: 'image/png' })
    const url = await (wrapper.vm as any).insertImageFromFile(file)

    expect(uploadImage).toHaveBeenCalledTimes(1)
    expect(uploadImage.mock.calls[0][0]).toBe(file)
    expect(typeof uploadImage.mock.calls[0][1]).toBe('function')
    expect(url).toBe('https://cdn.example.com/uploaded-image.png')
    expect(editor.getHTML()).toContain('https://cdn.example.com/uploaded-image.png')
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
    const url = await (wrapper.vm as any).insertImageFromFile(file)
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
    const url = await (wrapper.vm as any).insertImageFromFile(file)
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
