import { Youtube, type YoutubeOptions } from '@tiptap/extension-youtube'

export interface PrYoutubeOptions extends YoutubeOptions {
  /** `title` of an iframe whose author gave none, since a frame needs a name. */
  defaultTitle: string
}

/**
 * tiptap's YouTube node with a `title` on its iframe (RGAA 2.1, WCAG 4.1.2): the editor asks for
 * it when the video is inserted, and an iframe without one gets `defaultTitle`.
 */
export const AccessibleYoutube = Youtube.extend<PrYoutubeOptions>({
  addOptions() {
    return {
      ...this.parent!(),
      defaultTitle: 'Vidéo YouTube',
    }
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      title: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('title'),
        renderHTML: (attributes: Record<string, unknown>) => ({
          title: typeof attributes.title === 'string' && attributes.title.trim() ? attributes.title : this.options.defaultTitle,
        }),
      },
    }
  },
})
