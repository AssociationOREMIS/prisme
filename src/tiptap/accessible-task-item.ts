import { mergeAttributes } from '@tiptap/core'
import { TaskItem } from '@tiptap/extension-task-item'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'

// The task's own text (its first paragraph), not the text of the tasks nested under it.
export function taskText(node: ProseMirrorNode): string {
  return (node.firstChild?.textContent ?? node.textContent).trim()
}

/**
 * tiptap's task item whose checkbox has a name in the saved HTML too (`aria-label` from the task's
 * text), not only in the editor: tiptap writes an unnamed `<input type="checkbox">`, so a published
 * checklist read "case à cocher" with no label (RGAA 11.1). The name comes from `a11y.checkboxLabel`,
 * as in the editor, and defaults to the task's text.
 */
export const AccessibleTaskItem = TaskItem.extend({
  addOptions() {
    return {
      ...this.parent!(),
      a11y: {
        checkboxLabel: (node: ProseMirrorNode) => taskText(node) || 'Tâche sans texte',
      },
    }
  },

  renderHTML({ node, HTMLAttributes }) {
    const label = this.options.a11y?.checkboxLabel?.(node, Boolean(node.attrs.checked)) || taskText(node)

    return [
      'li',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-type': this.name }),
      [
        'label',
        ['input', { 'type': 'checkbox', 'checked': node.attrs.checked ? 'checked' : null, 'aria-label': label || null }],
        ['span'],
      ],
      ['div', 0],
    ]
  },
})
