import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(dirname, '..')
const configFile = path.resolve(root, 'vite.config.ts')

/**
 * Every public entry point, keyed by its output path (without `.js`), matching the
 * `exports` map of package.json: `prisme`, `registry`, `editor`, `blade`, `components/<category>/<Name>`,
 * `composables/<name>` and `tiptap/<name>`.
 */
function entries() {
  const result = {
    prisme: path.resolve(root, 'src/index.ts'),
    registry: path.resolve(root, 'src/registry.ts'),
    editor: path.resolve(root, 'src/editor.ts'),
    blade: path.resolve(root, 'src/blade.ts'),
  }

  for (const category of ['atoms', 'molecules', 'layouts']) {
    const categoryDir = path.resolve(root, 'src/components', category)
    for (const dirent of fs.readdirSync(categoryDir, { withFileTypes: true })) {
      if (dirent.isDirectory()) result[`components/${category}/${dirent.name}`] = path.resolve(categoryDir, dirent.name, 'index.ts')
    }
  }

  for (const folder of ['composables', 'tiptap']) {
    const dir = path.resolve(root, 'src', folder)
    for (const dirent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!dirent.isFile() || !dirent.name.endsWith('.ts') || dirent.name.endsWith('.test.ts')) continue
      result[`${folder}/${dirent.name.replace(/\.ts$/, '')}`] = path.resolve(dir, dirent.name)
    }
  }

  return result
}

/**
 * One build for every entry, with `preserveModules`: each source module becomes one file,
 * shared by all the entries that import it. Building each component on its own (as before
 * 0.14) copied the modules it imports into its file, so two import paths gave two copies of
 * the same state (AppShell's injection key, usePrTheme's refs) and the shared code was
 * shipped dozens of times. Entry files keep fixed names for the `exports` map; every other
 * module goes under `internal/`, which is not exported.
 *
 * The editor entry stays apart from the main one by construction: `dist/prisme.js` only
 * imports the modules `src/index.ts` reaches, and `src/entries.test.ts` checks none of them
 * imports tiptap.
 */
/**
 * File name of a non-entry module. Vue SFCs come out as `PrButton.vue` and
 * `PrButton.vue?vue&type=script&setup=true&lang`: kept as is, an app's own Vue plugin takes
 * those `.vue` files for SFC sources and fails to compile them. They become `PrButton` and
 * `PrButton.script`.
 */
function internalName(name) {
  return name
    .replace(/\.vue\?vue&type=(\w+).*$/, '.$1')
    .replace(/\.vue$/, '')
    .replace(/[?&=]/g, '_')
}

async function buildLibrary() {
  await build({
    configFile,
    build: {
      emptyOutDir: true,
      lib: {
        entry: entries(),
        formats: ['es'],
        cssFileName: 'styles',
      },
      rollupOptions: {
        output: {
          preserveModules: true,
          preserveModulesRoot: path.resolve(root, 'src'),
          entryFileNames: chunk => (chunk.isEntry ? `${chunk.name}.js` : `internal/${internalName(chunk.name)}.js`),
        },
      },
    },
  })
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
 * `themes.css`, not in this file. A consumer importing ONLY
 * `./styles/editor-content.css` for a read-only render (its documented use)
 * would otherwise get a stylesheet whose custom properties are never defined.
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

/**
 * `dist/components/<category>/<Name>.js` (the entry) sits next to `<Name>/index.d.ts` (its
 * types, written by vue-tsc). TypeScript resolves `./atoms/Button` in the emitted .d.ts files
 * to the .js file first, finds no `Button.d.ts` beside it and falls back to `any`: every type
 * reached through the main entry was lost (TS7016 in apps checking libraries, silent `any`
 * with skipLibCheck). A one-line declaration beside each entry points it at its folder.
 */
function writeComponentEntryDeclarations() {
  for (const category of ['atoms', 'molecules', 'layouts']) {
    const categoryDir = path.resolve(root, 'src/components', category)
    for (const dirent of fs.readdirSync(categoryDir, { withFileTypes: true })) {
      if (!dirent.isDirectory()) continue
      fs.writeFileSync(
        path.resolve(root, 'dist/components', category, `${dirent.name}.d.ts`),
        `export * from './${dirent.name}/index'\n`,
      )
    }
  }
}

await buildLibrary()
writeComponentEntryDeclarations()
copyStaticStyles()
