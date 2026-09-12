import type { CommandProps } from '@tiptap/core'
import { mergeAttributes, Node } from '@tiptap/core'

export type PrCalloutVariant = 'info' | 'success' | 'warning' | 'danger'

export interface PrCalloutAttributes {
  variant: PrCalloutVariant
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    callout: {
      /**
       * Wrap the current selection in a callout of the given variant, or
       * update/lift the callout the selection is already inside — toggling
       * the same variant twice lifts the content back out.
       */
      toggleCallout: (variant: PrCalloutVariant) => ReturnType
    }
  }
}

/**
 * A colored callout/admonition box (info, success, warning, danger) that
 * wraps one or more blocks. Renders as `<div data-callout data-variant="...">`
 * so it can be styled identically in the editor and in a read-only render
 * (see `src/styles/editor-content.css`).
 */
export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      variant: {
        default: 'info',
        parseHTML: (element: HTMLElement) => element.getAttribute('data-variant'),
        renderHTML: (attributes: PrCalloutAttributes) => ({ 'data-variant': attributes.variant }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-callout]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-callout': '' }), 0]
  },

  addCommands() {
    return {
      toggleCallout: (variant: PrCalloutVariant) => ({ commands }: CommandProps) => {
        if (this.editor.isActive(this.name)) {
          const currentVariant = this.editor.getAttributes(this.name).variant

          if (currentVariant === variant) {
            return commands.lift(this.name)
          }

          return commands.updateAttributes(this.name, { variant })
        }

        return commands.wrapIn(this.name, { variant })
      },
    }
  },
})
