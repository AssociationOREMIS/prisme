import type { Editor, Range } from '@tiptap/core'
import { Extension } from '@tiptap/core'
import { PluginKey } from '@tiptap/pm/state'
import { Suggestion, type SuggestionFloatingUiOptions, type SuggestionKeyDownProps, type SuggestionProps } from '@tiptap/suggestion'
import type { Component } from 'vue'

/**
 * The blocks variant of `PrRichTextEditor` (`variant="blocks"`): the "/" menu, moving blocks with the
 * keyboard, and the "Code HTML" tab. Pure helpers first (no DOM, covered by `blocks.test.ts`), then
 * the two tiptap extensions.
 */

/** An entry of the "/" menu. Apps add their own with the editor's `slashItems` prop. */
export interface PrRichTextEditorSlashItem {
  /** What the menu shows, and what the search matches first ("Encadré info"). */
  title: string
  /** A few words under the title ("Une information à retenir"). */
  hint?: string
  /** A Vue component (a `@lucide/vue` icon) or a short text ("¶"). Decorative. */
  icon?: Component | string
  /** More words the search matches, accents and case ignored ("note remarque"). */
  keywords?: string
  /** Items of a group are listed together, under this heading, after the editor's own blocks. */
  group?: string
  /** Inserts the block, the "/" and what follows it already removed. */
  command: (editor: Editor) => void
}

/** Lower case, without accents: "Élève" and "eleve" match. */
export function normalizeSearch(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim()
}

/**
 * The items of the "/" menu for what was typed after the slash: every item whose title or keywords
 * contain each word of the query (accents and case ignored), those whose title starts with the
 * whole query first. "encadre att" finds "Encadré attention".
 */
export function filterSlashItems<T extends Pick<PrRichTextEditorSlashItem, 'title' | 'keywords'>>(items: T[], query: string): T[] {
  const wanted = normalizeSearch(query).replace(/\s+/g, ' ')
  const words = wanted.split(' ').filter(Boolean)
  const matches = items.filter((item) => {
    const haystack = normalizeSearch(`${item.title} ${item.keywords ?? ''}`)

    return words.every(word => haystack.includes(word))
  })
  const startsWithQuery = (item: T) => normalizeSearch(item.title).startsWith(wanted)

  return [...matches.filter(startsWithQuery), ...matches.filter(item => !startsWithQuery(item))]
}

/** Past this length, what follows a "/" is ordinary text, not a search. */
export const SLASH_QUERY_MAX_LENGTH = 30

/**
 * Whether the "/" menu stays open for what was typed after the slash, so that ordinary writing never
 * leaves it stuck open: it closes on a space right after the slash, on two spaces in a row, on a
 * long query, and once the query has several words and nothing matches.
 */
export function keepSlashMenuOpen(query: string, matchCount: number): boolean {
  if (/^\s/.test(query) || /\s\s/.test(query) || query.length > SLASH_QUERY_MAX_LENGTH) return false
  const words = query.trim().split(/\s+/).filter(Boolean)

  return matchCount > 0 || words.length < 2
}

export interface PrSlashItemGroup<T> {
  /** `undefined` for the items without a group (the editor's own blocks), listed first. */
  name?: string
  items: T[]
}

/**
 * The filtered items in the order the menu shows them: those without a group first, then each group
 * in the order it first appears. Within a section, the filter's order is kept.
 */
export function groupSlashItems<T extends Pick<PrRichTextEditorSlashItem, 'group'>>(items: T[]): PrSlashItemGroup<T>[] {
  const groups = new Map<string | undefined, T[]>([[undefined, []]])
  for (const item of items) {
    const name = item.group?.trim() || undefined
    if (!groups.has(name)) groups.set(name, [])
    groups.get(name)!.push(item)
  }

  return [...groups].filter(([, members]) => members.length > 0).map(([name, members]) => ({ name, items: members }))
}

/**
 * Where a top-level block lands when moved one step up (-1) or down (+1), from the sizes of the
 * document's top-level blocks: the position to insert it at once it has been removed, or null at
 * the edge of the document.
 */
export function moveTarget(sizes: number[], index: number, direction: -1 | 1): number | null {
  if (index < 0 || index >= sizes.length) return null
  if ((direction < 0 && index === 0) || (direction > 0 && index >= sizes.length - 1)) return null

  const start = sizes.slice(0, index).reduce((sum, size) => sum + size, 0)

  return direction < 0 ? start - sizes[index - 1] : start + sizes[index + 1]
}

/** The position of the top-level block holding the cursor, or null. */
export function topBlockPos(editor: Editor): number | null {
  const { $from } = editor.state.selection

  return $from.depth === 0 ? $from.pos - ($from.nodeBefore && !$from.nodeAfter ? $from.nodeBefore.nodeSize : 0) : $from.before(1)
}

/**
 * Moves the top-level block at `pos` one step up or down. Returns its new position, or null when it
 * is already the first or the last block.
 */
export function moveBlock(editor: Editor, pos: number, direction: -1 | 1): number | null {
  const { state, view } = editor
  const node = state.doc.nodeAt(pos)
  if (!node) return null

  const sizes: number[] = []
  state.doc.forEach(child => sizes.push(child.nodeSize))
  const target = moveTarget(sizes, state.doc.resolve(pos).index(0), direction)
  if (target === null) return null

  view.dispatch(state.tr.delete(pos, pos + node.nodeSize).insert(target, node).scrollIntoView())

  return target
}

/** Inserts a copy of the top-level block at `pos` right after it. Returns the copy's position. */
export function duplicateBlock(editor: Editor, pos: number): number | null {
  const node = editor.state.doc.nodeAt(pos)
  if (!node) return null
  const target = pos + node.nodeSize
  editor.view.dispatch(editor.state.tr.insert(target, node).scrollIntoView())

  return target
}

/** Removes the top-level block at `pos`. */
export function deleteBlock(editor: Editor, pos: number): boolean {
  const node = editor.state.doc.nodeAt(pos)
  if (!node) return false

  return editor.chain().focus().deleteRange({ from: pos, to: pos + node.nodeSize }).run()
}

/**
 * The editor's HTML as shown in the "Code HTML" tab: one top-level block per line. Loading it back
 * gives the same document (whitespace between blocks is not content).
 */
export function htmlToSource(html: string): string {
  const template = document.createElement('template')
  template.innerHTML = html

  return Array.from(template.content.childNodes)
    .map(node => (node instanceof Element ? node.outerHTML : (node.textContent ?? '').trim()))
    .filter(Boolean)
    .join('\n')
}

/** What the editor's "/" menu needs from the component that renders it. */
export interface PrSlashMenuRenderer {
  onStart: (props: SuggestionProps<PrRichTextEditorSlashItem, PrRichTextEditorSlashItem>) => void
  onUpdate: (props: SuggestionProps<PrRichTextEditorSlashItem, PrRichTextEditorSlashItem>) => void
  onKeyDown: (props: SuggestionKeyDownProps) => boolean
  onExit: () => void
}

export interface PrSlashCommandOptions {
  /** Every item of the menu, before filtering. */
  items: () => PrRichTextEditorSlashItem[]
  renderer: () => PrSlashMenuRenderer
  /** Floating UI options of the popup (strategy, extra middleware). */
  floatingUi?: SuggestionFloatingUiOptions
}

export const slashMenuPluginKey = new PluginKey('prSlashMenu')

/**
 * The "/" menu: typed at the start of a block or after a space (never inside a word, as in "et/ou"
 * or a web address), it lists the blocks to insert, filtered by what follows the slash, spaces
 * included ("/encadré att"). It closes by itself when the text after the slash is clearly not a
 * search (see `keepSlashMenuOpen`), and on Escape.
 */
export const SlashCommand = Extension.create<PrSlashCommandOptions>({
  name: 'prSlashCommand',

  addOptions() {
    return {
      items: () => [],
      renderer: () => ({ onStart: () => {}, onUpdate: () => {}, onKeyDown: () => false, onExit: () => {} }),
      floatingUi: undefined,
    }
  },

  addProseMirrorPlugins() {
    const items = (query: string) => filterSlashItems(this.options.items(), query)

    return [
      Suggestion<PrRichTextEditorSlashItem, PrRichTextEditorSlashItem>({
        editor: this.editor,
        pluginKey: slashMenuPluginKey,
        char: '/',
        allowSpaces: true,
        allowedPrefixes: [' ', ' '],
        decorationClass: 'pr-rich-text-editor__slash-query',
        floatingUi: this.options.floatingUi,
        shouldShow: ({ query }) => keepSlashMenuOpen(query, items(query).length),
        items: ({ query }) => groupSlashItems(items(query)).flatMap(group => group.items),
        command: ({ editor, range, props }: { editor: Editor, range: Range, props: PrRichTextEditorSlashItem }) => {
          editor.chain().focus().deleteRange(range).run()
          props.command(editor)
        },
        render: () => this.options.renderer(),
      }),
    ]
  },
})

export type PrBlockMoveResult = 'up' | 'down' | 'first' | 'last'

/** Alt+ArrowUp and Alt+ArrowDown move the current top-level block, the cursor going along. */
export const BlockKeys = Extension.create<{ onMove: (result: PrBlockMoveResult) => void }>({
  name: 'prBlockKeys',

  addOptions() {
    return { onMove: () => {} }
  },

  addKeyboardShortcuts() {
    const move = (direction: -1 | 1) => () => {
      const pos = topBlockPos(this.editor)
      if (pos === null) return false
      const offset = Math.max(0, this.editor.state.selection.from - pos)
      const target = moveBlock(this.editor, pos, direction)
      if (target === null) {
        this.options.onMove(direction < 0 ? 'first' : 'last')

        return true
      }
      this.editor.commands.setTextSelection(target + offset)
      this.options.onMove(direction < 0 ? 'up' : 'down')

      return true
    }

    return { 'Alt-ArrowUp': move(-1), 'Alt-ArrowDown': move(1) }
  },
})
