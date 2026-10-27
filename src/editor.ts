import type { App, Plugin } from 'vue'
import { PrRichTextEditor } from './components/molecules/RichTextEditor'

/**
 * `@oremis/prisme/editor`: everything that depends on tiptap/lowlight.
 *
 * Kept out of the main `@oremis/prisme` entry (and out of `app.use(Prisme)`)
 * so that apps which never render a rich text editor don't have to install
 * the ~20 optional tiptap peerDependencies just to import `PrButton`. Bundlers
 * resolve every static AND dynamic `import()` at build time, so a separate
 * entry point is the only way to make those packages truly optional.
 *
 * Its styles are NOT imported here: they already ship in
 * `@oremis/prisme/styles.css` (see `src/styles/prisme.css`).
 */
export { PrRichTextEditor }
export type { PrRichTextEditorProps } from './components/molecules/RichTextEditor'

export { Callout } from './tiptap/callout'
export type { PrCalloutAttributes, PrCalloutOptions, PrCalloutVariant } from './tiptap/callout'

// The accessible variants of tiptap nodes the editor uses, for an app mounting its own tiptap editor.
export { AccessibleImage, imageWidthAttributes, PR_IMAGE_WIDTHS } from './tiptap/accessible-image'
export type { PrImageWidth } from './tiptap/accessible-image'
export { AccessibleTaskItem } from './tiptap/accessible-task-item'
export { AccessibleYoutube } from './tiptap/accessible-youtube'
export type { PrYoutubeOptions } from './tiptap/accessible-youtube'
export { ScopedTableHeader } from './tiptap/scoped-table-header'

/**
 * Registers `PrRichTextEditor` globally, the editor counterpart of
 * `app.use(Prisme)`: `app.use(Prisme).use(PrismeEditor)` makes
 * `<pr-rich-text-editor>` usable in plain HTML/Blade.
 */
export const PrismeEditor: Plugin = {
  install(app: App) {
    app.component('PrRichTextEditor', PrRichTextEditor)
  },
}
