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
            // Without an explicit override here, this inherits vite.config.ts's
            // `build.lib.cssFileName: 'styles'` — so any component whose SFC
            // imports a plain CSS file (e.g. PrRichTextEditor's
            // `editor-content.css`/`rich-text-editor.css`) would emit its own
            // `dist/styles.css` in THIS single-entry build and silently
            // clobber the full, correct one `buildMain()` already wrote
            // (tokens/reset/Tailwind utilities for every component). Giving
            // each entry its own css file name keeps it out of that shared
            // path; nothing currently references these per-component css
            // outputs (nor are they exported), they're a harmless side effect.
            cssFileName: outputName,
          },
        },
      })
    }
  }
}

/**
 * Composables get the same single-entry treatment as components: a consumer
 * that only needs `usePrForm` (e.g. a Blade/Vue "island" page with a form)
 * shouldn't have to pull in the whole component registry — and thus every
 * component in the library — just to import it from the main entry.
 */
async function buildComposableEntries() {
  const composablesDir = path.resolve(root, 'src/composables')

  for (const dirent of fs.readdirSync(composablesDir, { withFileTypes: true })) {
    if (!dirent.isFile() || !dirent.name.endsWith('.ts') || dirent.name.endsWith('.test.ts')) continue

    const name = dirent.name.replace(/\.ts$/, '')
    await build({
      configFile,
      logLevel: 'warn',
      build: {
        emptyOutDir: false,
        lib: {
          entry: path.resolve(composablesDir, dirent.name),
          formats: ['es'],
          fileName: () => `composables/${name}.js`,
          // See the matching comment in buildComponentEntries(): keeps this
          // entry from inheriting vite.config.ts's shared cssFileName and
          // clobbering dist/styles.css if a composable ever imports CSS.
          cssFileName: `composables/${name}`,
        },
      },
    })
  }
}

/**
 * Same single-entry treatment as composables: `src/tiptap/callout.ts` is a
 * plain (non-Vue) tiptap Node module, exposed under its own `./tiptap/*`
 * export so a consumer mounting its own tiptap editor (rather than using
 * `PrRichTextEditor`) can import just the `Callout` node.
 */
async function buildTiptapEntries() {
  const tiptapDir = path.resolve(root, 'src/tiptap')

  for (const dirent of fs.readdirSync(tiptapDir, { withFileTypes: true })) {
    if (!dirent.isFile() || !dirent.name.endsWith('.ts') || dirent.name.endsWith('.test.ts')) continue

    const name = dirent.name.replace(/\.ts$/, '')
    await build({
      configFile,
      logLevel: 'warn',
      build: {
        emptyOutDir: false,
        lib: {
          entry: path.resolve(tiptapDir, dirent.name),
          formats: ['es'],
          fileName: () => `tiptap/${name}.js`,
          // See the matching comment in buildComponentEntries().
          cssFileName: `tiptap/${name}`,
        },
      },
    })
  }
}

/**
 * Plain static assets that aren't a JS entry point — `editor-content.css` is
 * consumer-facing CSS (imported both by `PrRichTextEditor` and, standalone,
 * by a consumer's read-only render), so it's copied to `dist/styles/` rather
 * than run through a Vite lib build.
 *
 * It's PREPENDED with `tokens.css` + `themes.css` rather than plain-copied:
 * `editor-content.css`'s own rules are all `var(--pr-color-*)`/`var(--pr-space-*)`
 * references, and those custom properties are defined in `tokens.css`/
 * `themes.css`, not in this file. A consumer that imports the full
 * `@oremis/prisme/styles.css` (e.g. anything mounting `PrRichTextEditor`)
 * already gets them from there, so this went unnoticed — but a consumer
 * importing ONLY `./styles/editor-content.css` for a read-only render (its
 * documented, intended use — see the comment atop that file) got a
 * stylesheet whose custom properties were never defined anywhere, so every
 * `var(...)` was invalid and silently fell back to nothing (transparent
 * backgrounds, `currentcolor` borders). Concatenating them keeps this file
 * genuinely self-contained, matching what its own doc comment promises.
 */
function copyStaticStyles() {
  const outDir = path.resolve(root, 'dist/styles')
  fs.mkdirSync(outDir, { recursive: true })

  const tokens = fs.readFileSync(path.resolve(root, 'src/styles/tokens.css'), 'utf-8')
  const themes = fs.readFileSync(path.resolve(root, 'src/styles/themes.css'), 'utf-8')
  const editorContent = fs.readFileSync(path.resolve(root, 'src/styles/editor-content.css'), 'utf-8')

  fs.writeFileSync(
    path.resolve(outDir, 'editor-content.css'),
    `${tokens}\n${themes}\n${editorContent}`,
  )
}

await buildMain()
await buildComponentEntries()
await buildComposableEntries()
await buildTiptapEntries()
copyStaticStyles()
