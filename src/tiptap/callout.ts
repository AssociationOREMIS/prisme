import type { CommandProps } from '@tiptap/core'
import { mergeAttributes, Node } from '@tiptap/core'

export type PrCalloutVariant = 'info' | 'success' | 'warning' | 'danger'

export interface PrCalloutAttributes {
  variant: PrCalloutVariant
}

export interface PrCalloutOptions {
  /**
   * Text written before the callout's content, for each variant ("Attention :"). It is in the
   * HTML (hidden visually by `editor-content.css`), so the meaning of the box does not rest on its
   * color and glyph alone: screen readers read it, and so does a page without CSS.
   */
  prefixes: Record<PrCalloutVariant, string>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    callout: {
      /**
       * Wrap the current selection in a callout of the given variant, or
       * update/lift the callout the selection is already inside - toggling
       * the same variant twice lifts the content back out.
       */
      toggleCallout: (variant: PrCalloutVariant) => ReturnType
    }
  }
}

/**
 * A colored callout/admonition box (info, success, warning, danger) that
 * wraps one or more blocks. Renders as
 * `<div data-callout data-variant="..."><span class="pr-editor-sr-only" data-callout-prefix>Attention :</span><div data-callout-content>...</div></div>`
 * so it can be styled identically in the editor and in a read-only render
 * (see `src/styles/editor-content.css`). HTML written before the prefix existed
 * (blocks directly inside `div[data-callout]`) still parses.
 */
export const Callout = Node.create<PrCalloutOptions>({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,

  addOptions() {
    return {
      prefixes: {
        info: 'Information :',
        success: 'Succès :',
        warning: 'Attention :',
        danger: 'Danger :',
      },
    }
  },

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
    return [{
      tag: 'div[data-callout]',
      contentElement: (element: HTMLElement) => element.querySelector<HTMLElement>(':scope > [data-callout-content]') ?? element,
    }]
  },

  renderHTML({ node, HTMLAttributes }) {
    const variant = node.attrs.variant as PrCalloutVariant
    const prefix = this.options.prefixes[variant] ?? this.options.prefixes.info

    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-callout': '' }),
      ['span', { 'class': 'pr-editor-sr-only', 'data-callout-prefix': '' }, prefix],
      ['div', { 'data-callout-content': '' }, 0],
    ]
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
