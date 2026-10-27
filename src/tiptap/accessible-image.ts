import { ImageResize } from 'tiptap-extension-resize-image'

/** Widths offered by `setImageWidth`, the keyboard alternative to dragging the resize handles. */
export const PR_IMAGE_WIDTHS = { small: 240, medium: 480, full: 1200 } as const

export type PrImageWidth = keyof typeof PR_IMAGE_WIDTHS

/** Node attributes of an image `width` wide, the same style string the resize handles write. */
export function imageWidthAttributes(width: PrImageWidth | number): { width: number, containerStyle: string } {
  const pixels = typeof width === 'number' ? width : PR_IMAGE_WIDTHS[width]

  return { width: pixels, containerStyle: `width: ${pixels}px; height: auto; cursor: pointer;` }
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    accessibleImage: {
      /** Sets the width of the selected image (the keyboard alternative to its resize handles). */
      setImageWidth: (width: PrImageWidth | number) => ReturnType
    }
  }
}

/**
 * `tiptap-extension-resize-image`'s image node (same name, `imageResize`, same HTML) with an
 * `alt` attribute that keeps the difference between a decorative image (`alt=""`) and an image
 * with no alternative text at all (no `alt`), and is never turned into a number (`alt="2024"`).
 */
export const AccessibleImage = ImageResize.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      alt: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('alt'),
        renderHTML: (attributes: Record<string, unknown>) => (typeof attributes.alt === 'string' ? { alt: attributes.alt } : {}),
      },
    }
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setImageWidth: (width: PrImageWidth | number) => ({ commands }) => commands.updateAttributes(this.name, imageWidthAttributes(width)),
    }
  },
})
