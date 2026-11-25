// @vitest-environment jsdom
//
// The blocks variant (`variant="blocks"`) of PrRichTextEditor. Like PrRichTextEditor.test.ts, these
// tests drive tiptap through its command API (jsdom cannot type into a contenteditable), and send
// keydown events to ProseMirror's element for the keyboard shortcuts.
import type { VueWrapper } from '@vue/test-utils'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { Node, type Editor } from '@tiptap/core'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import type { PrRichTextEditorSlashItem } from './blocks'
import PrRichTextEditor from './PrRichTextEditor.vue'

enableAutoUnmount(afterEach)

// jsdom has no layout for ranges: ProseMirror measures one when it scrolls the cursor into view.
Range.prototype.getClientRects ??= () => [] as unknown as DOMRectList
Range.prototype.getBoundingClientRect ??= () => new DOMRect()

type EditorWrapper = VueWrapper<InstanceType<typeof PrRichTextEditor>>

function mountBlocks(props: Record<string, unknown> = {}) {
  return mount(PrRichTextEditor, {
    props: { variant: 'blocks', label: 'Contenu', ...props },
    attachTo: document.body,
  }) as EditorWrapper
}

async function waitForEditor(wrapper: EditorWrapper) {
  return vi.waitFor(() => {
    const editor = wrapper.vm.editor
    if (!editor) throw new Error('editor not ready')

    return editor
  })
}

function withoutTrailingParagraph(html: string) {
  return html.replace(/<p><\/p>$/, '')
}

function press(wrapper: EditorWrapper, key: string, options: KeyboardEventInit = {}) {
  wrapper.vm.editor!.view.dom.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...options }))
}

/** Types `text` at the end of the document, then waits for the "/" menu. */
async function typeSlash(wrapper: EditorWrapper, text: string) {
  const editor = await waitForEditor(wrapper)
  editor.chain().focus('end').insertContent(text).run()
  await flushPromises()

  return vi.waitFor(() => {
    const listbox = document.querySelector<HTMLElement>('[role="listbox"]')
    if (!listbox) throw new Error('no slash menu')

    return listbox
  })
}

function optionTitles(listbox: HTMLElement) {
  return Array.from(listbox.querySelectorAll('.pr-rich-text-editor__slash-title')).map(option => option.textContent?.trim())
}

describe('prRichTextEditor variant="blocks"', () => {
  it('replaces the big toolbar with tabs and a small toolbar, and says how to insert a block', async () => {
    const wrapper = mountBlocks({ modelValue: '<p></p>' })
    const editor = await waitForEditor(wrapper)

    expect(wrapper.findAll('[role="tab"]').map(tab => tab.text())).toEqual(['Écrire', 'Aperçu', 'Code HTML'])
    expect(wrapper.find('[role="tab"][aria-selected="true"]').text()).toBe('Écrire')
    expect(wrapper.find('button[aria-label="Gras"]').exists()).toBe(false)
    expect(wrapper.find('button[aria-label="Options du bloc"]').exists()).toBe(true)
    expect(wrapper.find('button[aria-label="Annuler"]').exists()).toBe(true)
    expect(editor.view.dom.querySelector('p')?.getAttribute('data-placeholder')).toBe('Écrivez, ou tapez / pour insérer un bloc')

    const help = wrapper.find('.pr-rich-text-editor__help')
    expect(help.text()).toContain('tapez / pour insérer un bloc')
    expect(editor.view.dom.getAttribute('aria-describedby')).toContain(help.attributes('id'))
  })

  it('keeps the toolbar variant unchanged by default', async () => {
    const wrapper = mount(PrRichTextEditor, { props: { modelValue: '<p>Texte</p>' } })
    await waitForEditor(wrapper)

    expect(wrapper.find('[role="tablist"]').exists()).toBe(false)
    expect(wrapper.find('button[aria-label="Gras"]').exists()).toBe(true)
  })

  it('opens the "/" menu, filters it by what follows the slash and inserts the chosen block with Enter', async () => {
    const wrapper = mountBlocks({ modelValue: '<p></p>' })
    const editor = await waitForEditor(wrapper)
    const listbox = await typeSlash(wrapper, '/tit')

    expect(listbox.getAttribute('aria-label')).toBe('Insérer un bloc')
    expect(optionTitles(listbox)).toEqual(['Titre', 'Sous-titre'])
    expect(editor.view.dom.getAttribute('aria-controls')).toBe(listbox.id)
    await vi.waitFor(() => expect(editor.view.dom.getAttribute('aria-activedescendant')).toBe(`${listbox.id}-option-0`))

    press(wrapper, 'ArrowDown')
    await vi.waitFor(() => expect(editor.view.dom.getAttribute('aria-activedescendant')).toBe(`${listbox.id}-option-1`))
    expect(listbox.querySelector('[aria-selected="true"]')?.textContent).toContain('Sous-titre')

    press(wrapper, 'Enter')
    await flushPromises()

    expect(withoutTrailingParagraph(editor.getHTML())).toBe('<h3></h3>')
    await vi.waitFor(() => expect(document.querySelector('[role="listbox"]')).toBeNull())
    expect(editor.view.dom.hasAttribute('aria-activedescendant')).toBe(false)
  })

  it('filters with spaces and accents, says when nothing matches, and closes on Escape or on ordinary writing', async () => {
    const wrapper = mountBlocks({ modelValue: '<p></p>' })
    const editor = await waitForEditor(wrapper)
    const listbox = await typeSlash(wrapper, '/encadré aver')

    expect(optionTitles(listbox)).toEqual(['Encadré avertissement'])

    // Two words that match nothing: ordinary text, the menu closes by itself.
    editor.chain().insertContent('zz').run()
    await vi.waitFor(() => expect(document.querySelector('[role="listbox"]')).toBeNull())

    editor.commands.setContent('<p></p>')
    const empty = await typeSlash(wrapper, '/xyz')
    expect(empty.textContent).toContain('Aucun bloc ne correspond')
    expect(editor.view.dom.hasAttribute('aria-activedescendant')).toBe(false)

    press(wrapper, 'Escape')
    await vi.waitFor(() => expect(document.querySelector('[role="listbox"]')).toBeNull())
    expect(editor.getText()).toBe('/xyz')
  })

  it('inserts a callout, a separator and a collapsible section from the menu', async () => {
    const wrapper = mountBlocks({ modelValue: '<p></p>' })
    const editor = await waitForEditor(wrapper)

    await typeSlash(wrapper, '/encadre info')
    press(wrapper, 'Enter')
    await flushPromises()
    expect(editor.getHTML()).toContain('data-variant="info"')

    editor.commands.setContent('<p></p>')
    await typeSlash(wrapper, '/separateur')
    press(wrapper, 'Enter')
    await flushPromises()
    expect(editor.getHTML()).toContain('<hr>')

    editor.commands.setContent('<p></p>')
    await typeSlash(wrapper, '/repliable')
    press(wrapper, 'Enter')
    await flushPromises()
    expect(editor.getHTML()).toContain('<details')
  })

  it('offers the image only with an uploadImage handler', async () => {
    const without = mountBlocks({ modelValue: '<p></p>' })
    expect(optionTitles(await typeSlash(without, '/ima'))).toEqual([])
    without.unmount()

    const withUpload = mountBlocks({ modelValue: '<p></p>', uploadImage: async () => '/image.png' })
    expect(optionTitles(await typeSlash(withUpload, '/ima'))).toEqual(['Image'])
  })

  it('selects an option with the mouse', async () => {
    const wrapper = mountBlocks({ modelValue: '<p></p>' })
    const editor = await waitForEditor(wrapper)
    const listbox = await typeSlash(wrapper, '/liste')

    const option = Array.from(listbox.querySelectorAll('[role="option"]')).find(candidate => candidate.textContent?.includes('Liste numérotée'))!
    option.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }))
    await flushPromises()

    expect(editor.getHTML()).toContain('<ol>')
  })

  it('lists the app\'s slashItems after the editor\'s blocks, under their group, and runs their command', async () => {
    const command = vi.fn((editor: Editor) => editor.chain().focus().insertContent('<p>Bannière insérée</p>').run())
    const slashItems: PrRichTextEditorSlashItem[] = [
      { title: 'Bannière', hint: 'Un grand bandeau', icon: 'B', keywords: 'banniere bandeau', group: 'Mise en page', command },
      { title: 'Texte mis en avant', command: () => {} },
    ]
    const wrapper = mountBlocks({ modelValue: '<p></p>', slashItems })
    const editor = await waitForEditor(wrapper)

    const listbox = await typeSlash(wrapper, '/')
    const titles = optionTitles(listbox)
    expect(titles.indexOf('Texte mis en avant')).toBeGreaterThan(titles.indexOf('Séparateur'))
    expect(titles.at(-1)).toBe('Bannière')
    expect(listbox.querySelector('[role="group"]')?.getAttribute('aria-label')).toBe('Mise en page')

    editor.chain().insertContent('bandeau').run()
    await vi.waitFor(() => expect(optionTitles(listbox)).toEqual(['Bannière']))
    press(wrapper, 'Enter')
    await flushPromises()

    expect(command).toHaveBeenCalledWith(editor)
    expect(editor.getText()).toContain('Bannière insérée')
    expect(editor.getText()).not.toContain('/bandeau')
  })

  it('adds the app\'s tiptap extensions, so their HTML survives', async () => {
    const Banner = Node.create({
      name: 'banner',
      group: 'block',
      content: 'inline*',
      parseHTML: () => [{ tag: 'section[data-banner]' }],
      renderHTML: () => ['section', { 'data-banner': '' }, 0],
    })
    const wrapper = mountBlocks({ modelValue: '<section data-banner="">Bienvenue</section>', extensions: [Banner] })
    const editor = await waitForEditor(wrapper)

    expect(withoutTrailingParagraph(editor.getHTML())).toBe('<section data-banner="">Bienvenue</section>')
  })

  it('moves the current block with Alt+ArrowUp and Alt+ArrowDown, and says so', async () => {
    const wrapper = mountBlocks({ modelValue: '<p>Un</p><p>Deux</p><p>Trois</p>' })
    const editor = await waitForEditor(wrapper)
    const status = () => wrapper.findAll('[role="status"]').map(region => region.text()).join(' ')

    editor.commands.setTextSelection(2)
    press(wrapper, 'ArrowDown', { altKey: true })
    expect(editor.getHTML()).toBe('<p>Deux</p><p>Un</p><p>Trois</p>')
    expect(editor.state.selection.$from.parent.textContent).toBe('Un')
    await vi.waitFor(() => expect(status()).toContain('Bloc descendu'))

    press(wrapper, 'ArrowUp', { altKey: true })
    press(wrapper, 'ArrowUp', { altKey: true })
    expect(editor.getHTML()).toBe('<p>Un</p><p>Deux</p><p>Trois</p>')
    await vi.waitFor(() => expect(status()).toContain('Ce bloc est déjà le premier'))
  })

  it('opens the block menu from the toolbar: Monter, Descendre, Dupliquer, Supprimer, focus on the first one', async () => {
    const wrapper = mountBlocks({ modelValue: '<p>Un</p><p>Deux</p>' })
    const editor = await waitForEditor(wrapper)
    editor.commands.setTextSelection(2)

    await wrapper.find('button[aria-label="Options du bloc"]').trigger('click')
    await flushPromises()
    const menu = document.querySelector<HTMLElement>('[role="menu"]')!
    expect(menu.getAttribute('aria-label')).toBe('Options du bloc')
    const items = Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]'))
    expect(items.map(item => item.querySelector('.pr\\:flex-1')?.textContent)).toEqual(['Monter', 'Descendre', 'Dupliquer', 'Supprimer'])
    expect(document.activeElement).toBe(items[0])

    items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    expect(document.activeElement).toBe(items[1])

    items[2].click()
    await flushPromises()
    expect(editor.getHTML()).toBe('<p>Un</p><p>Un</p><p>Deux</p>')
    expect(document.querySelector('[role="menu"]')).toBeNull()

    await wrapper.find('button[aria-label="Options du bloc"]').trigger('click')
    await flushPromises()
    Array.from(document.querySelectorAll<HTMLElement>('[role="menuitem"]')).at(-1)!.click()
    await flushPromises()
    expect(editor.getHTML()).toBe('<p>Un</p><p>Deux</p>')
  })

  it('gives the focus back to its button when the block menu closes with Escape', async () => {
    const wrapper = mountBlocks({ modelValue: '<p>Un</p>' })
    await waitForEditor(wrapper)
    const button = wrapper.find('button[aria-label="Options du bloc"]')

    await button.trigger('click')
    await flushPromises()
    document.querySelector<HTMLElement>('[role="menuitem"]')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await flushPromises()

    expect(document.querySelector('[role="menu"]')).toBeNull()
    expect(document.activeElement).toBe(button.element)
  })

  it('shows the preview read-only, and loads the edited HTML code back into the editor', async () => {
    const wrapper = mountBlocks({ modelValue: '<h2>Titre</h2><p>Un <strong>mot</strong></p>' })
    const editor = await waitForEditor(wrapper)
    const tab = (name: string) => wrapper.findAll('[role="tab"]').find(candidate => candidate.text() === name)!

    await tab('Aperçu').trigger('click')
    const preview = wrapper.find('.pr-rich-text-editor__preview')
    expect(tab('Aperçu').attributes('aria-selected')).toBe('true')
    expect(preview.attributes('role')).toBe('tabpanel')
    expect(preview.find('.pr-editor-content').html()).toContain('<h2>Titre</h2>')
    expect(preview.find('[contenteditable]').exists()).toBe(false)

    // Arrow keys move between the tabs (automatic activation).
    await tab('Aperçu').trigger('keydown', { key: 'ArrowRight' })
    expect(tab('Code HTML').attributes('aria-selected')).toBe('true')
    expect(document.activeElement).toBe(tab('Code HTML').element)

    const textarea = wrapper.find<HTMLTextAreaElement>('textarea')
    expect(textarea.element.value).toBe('<h2>Titre</h2>\n<p>Un <strong>mot</strong></p>')
    expect(wrapper.find(`label[for="${textarea.attributes('id')}"]`).text()).toBe('Code HTML : Contenu')

    await textarea.setValue('<h2>Titre</h2>\n<p>Nouveau <em>texte</em></p>\n<script>alert(1)</script>')
    await tab('Écrire').trigger('click')

    expect(withoutTrailingParagraph(editor.getHTML())).toBe('<h2>Titre</h2><p>Nouveau <em>texte</em></p>')
    const emitted = wrapper.emitted('update:modelValue')!
    expect(emitted.at(-1)![0]).toContain('Nouveau <em>texte</em>')
  })

  it('submits the latest HTML through the hidden input, even from the "Code HTML" tab', async () => {
    const host = defineComponent({
      setup: () => () => h('form', [h(PrRichTextEditor, { variant: 'blocks', name: 'body', modelValue: '<p>Départ</p>' })]),
    })
    const wrapper = mount(host, { attachTo: document.body })
    const editorWrapper = wrapper.findComponent(PrRichTextEditor) as EditorWrapper
    const editor = await waitForEditor(editorWrapper)
    const form = wrapper.find('form').element as HTMLFormElement

    // What an app's submit handler, or the browser, reads once the form is sent.
    const sentBody = () => {
      form.dispatchEvent(new Event('submit', { cancelable: true }))

      return new FormData(form).get('body')
    }

    editor.commands.setContent('<p>Modifié</p>', { emitUpdate: true })
    expect(sentBody()).toBe('<p>Modifié</p>')

    await editorWrapper.findAll('[role="tab"]').find(candidate => candidate.text() === 'Code HTML')!.trigger('click')
    await editorWrapper.find('textarea').setValue('<p>Depuis le code</p>')

    expect(sentBody()).toBe('<p>Depuis le code</p>')
    expect(editor.getHTML()).toBe('<p>Depuis le code</p>')
  })
})
