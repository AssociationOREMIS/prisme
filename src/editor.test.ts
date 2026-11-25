import { createApp } from 'vue'
import { describe, expect, it } from 'vitest'
import Prisme from './index'
import { Callout, filterSlashItems, moveBlock, PrismeEditor, PrRichTextEditor, SlashCommand } from './editor'
import { Callout as CalloutFromTiptapEntry } from './tiptap/callout'

describe('@oremis/prisme/editor', () => {
  it('PrismeEditor registers PrRichTextEditor globally', () => {
    const app = createApp({})
    app.use(PrismeEditor)

    expect(app.component('PrRichTextEditor')).toBe(PrRichTextEditor)
  })

  it('app.use(Prisme) alone does not register PrRichTextEditor', () => {
    const app = createApp({})
    app.use(Prisme)

    expect(app.component('PrRichTextEditor')).toBeUndefined()
  })

  it('combines with app.use(Prisme)', () => {
    const app = createApp({})
    app.use(Prisme).use(PrismeEditor)

    expect(app.component('PrButton')).toBeDefined()
    expect(app.component('PrRichTextEditor')).toBe(PrRichTextEditor)
  })

  it('exports the helpers of the blocks variant, for an app\'s own slash items', () => {
    expect(typeof filterSlashItems).toBe('function')
    expect(typeof moveBlock).toBe('function')
    expect(SlashCommand.name).toBe('prSlashCommand')
  })

  it('re-exports the same Callout node as @oremis/prisme/tiptap/callout', () => {
    expect(Callout).toBe(CalloutFromTiptapEntry)
  })
})
