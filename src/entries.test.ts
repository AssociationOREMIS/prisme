import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const srcDir = path.dirname(fileURLToPath(import.meta.url))

// Optional peerDependencies (see package.json#peerDependenciesMeta) that only
// `@oremis/prisme/editor` may pull in.
const EDITOR_ONLY_PACKAGE = /^(@tiptap\/|lowlight$|tiptap-extension-resize-image$)/

// Every `import ... from '...'`, `export ... from '...'`, side-effect
// `import '...'` and dynamic `import('...')`: bundlers resolve all of them at
// build time, so a dynamic import would still make the package mandatory.
const SPECIFIER_RE = /(?:\bfrom\s*|\bimport\s*\(?\s*)['"]([^'"]+)['"]/g

function resolveLocal(fromFile: string, specifier: string): string | undefined {
  const base = path.resolve(path.dirname(fromFile), specifier)
  return [base, `${base}.ts`, path.join(base, 'index.ts')].find(
    candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile(),
  )
}

/** Bare package specifiers reachable from `entry` through its relative imports. */
function collectPackages(entry: string): Set<string> {
  const packages = new Set<string>()
  const visited = new Set<string>()
  const queue = [path.resolve(srcDir, entry)]

  while (queue.length > 0) {
    const file = queue.pop()!
    if (visited.has(file)) continue
    visited.add(file)
    if (!/\.(ts|vue)$/.test(file)) continue

    for (const [, specifier] of fs.readFileSync(file, 'utf8').matchAll(SPECIFIER_RE)) {
      if (!specifier.startsWith('.')) {
        packages.add(specifier)
        continue
      }
      const resolved = resolveLocal(file, specifier)
      if (resolved) queue.push(resolved)
    }
  }

  return packages
}

describe('package entry points', () => {
  it('keeps tiptap and lowlight out of the main entry (and of app.use(Prisme))', () => {
    const editorOnly = [...collectPackages('index.ts')].filter(name => EDITOR_ONLY_PACKAGE.test(name))

    expect(editorOnly).toEqual([])
  })

  it('keeps tiptap and lowlight out of the registry entry', () => {
    const editorOnly = [...collectPackages('registry.ts')].filter(name => EDITOR_ONLY_PACKAGE.test(name))

    expect(editorOnly).toEqual([])
  })

  it('sanity check: detects tiptap in the editor entry', () => {
    const packages = [...collectPackages('editor.ts')]

    expect(packages).toContain('@tiptap/vue-3')
    expect(packages).toContain('lowlight')
  })
})
