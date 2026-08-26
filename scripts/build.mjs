import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(dirname, '..')
const configFile = path.resolve(root, 'vite.config.ts')

/**
 * The main `prisme`/`registry` bundle is a normal multi-entry build (they
 * share nothing, so Rollup can't merge one into the other).
 */
async function buildMain() {
  await build({ configFile, build: { emptyOutDir: true } })
}

/**
 * Each component gets its own single-entry build so it comes out as one
 * fully self-contained file at a predictable path. Building them alongside
 * the main bundle in one multi-entry Rollup build would let Rollup merge a
 * component's entry into a shared chunk with a content-hashed name whenever
 * another component imports it internally — which breaks the fixed
 * `./components/*` export paths in package.json.
 */
async function buildComponentEntries() {
  const categories = ['atoms', 'molecules', 'layouts']

  for (const category of categories) {
    const categoryDir = path.resolve(root, 'src/components', category)
    for (const dirent of fs.readdirSync(categoryDir, { withFileTypes: true })) {
      if (!dirent.isDirectory()) continue

      const outputName = `components/${category}/${dirent.name}`
      await build({
        configFile,
        logLevel: 'warn',
        build: {
          emptyOutDir: false,
          lib: {
            entry: path.resolve(categoryDir, dirent.name, 'index.ts'),
            formats: ['es'],
            fileName: () => `${outputName}.js`,
          },
        },
      })
    }
  }
}

await buildMain()
await buildComponentEntries()
