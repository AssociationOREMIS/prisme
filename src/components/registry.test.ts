import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import * as editorEntry from '../editor'
import * as mainEntry from '../index'
import { componentRegistry } from './registry'

// A new component is a folder under src/components plus two hand-written lines: one in
// registry.ts (app.use(Prisme), registerPrisme, Blade tags) and one in src/index.ts (named
// imports). Nothing failed when one was forgotten, and PrTagInput/PrNumberInput once shipped
// unreachable from Blade. These tests list the components from the folders themselves.

const componentsDir = path.dirname(fileURLToPath(import.meta.url))

// Lives in the `@oremis/prisme/editor` entry, away from the main one (see registry.ts).
const EDITOR_COMPONENTS = ['PrRichTextEditor']

/** Every `export { default as PrXxx }` of every component folder's index.ts. */
function publicComponents(): string[] {
  const names: string[] = []

  for (const category of ['atoms', 'molecules', 'layouts']) {
    for (const folder of fs.readdirSync(path.join(componentsDir, category))) {
      const index = path.join(componentsDir, category, folder, 'index.ts')
      if (!fs.existsSync(index)) continue
      for (const [, name] of fs.readFileSync(index, 'utf8').matchAll(/export \{ default as (Pr\w+) \}/g)) {
        names.push(name)
      }
    }
  }

  return names.sort()
}

describe('component registration', () => {
  const components = publicComponents()

  it('finds the components', () => {
    expect(components.length).toBeGreaterThan(50)
  })

  it('registers every component for app.use(Prisme) and Blade', () => {
    const missing = components.filter(name => !EDITOR_COMPONENTS.includes(name) && !(name in componentRegistry))

    expect(missing).toEqual([])
  })

  it('exports every component by name from its entry', () => {
    const missing = components.filter(name => !(name in (EDITOR_COMPONENTS.includes(name) ? editorEntry : mainEntry)))

    expect(missing).toEqual([])
  })
})
