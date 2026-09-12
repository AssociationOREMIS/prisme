/// <reference types="vitest/config" />
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vite'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [tailwindcss(), vue()],
  resolve: {
    dedupe: ['vue'],
  },
  build: {
    copyPublicDir: false,
    lib: {
      entry: {
        prisme: path.resolve(dirname, 'src/index.ts'),
        registry: path.resolve(dirname, 'src/registry.ts'),
      },
      name: 'Prisme',
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
      cssFileName: 'styles',
    },
    rollupOptions: {
      // `vue` and every tiptap package `PrRichTextEditor`/`src/tiptap/callout.ts`
      // import are peerDependencies (see package.json), not bundled dependencies —
      // externalizing them keeps consumer apps that don't use the rich text
      // editor from paying for ~15 tiptap packages inside `dist/prisme.js`, and
      // (more importantly) avoids a second, non-deduped copy of ProseMirror
      // shipping inside Prisme's own bundle for apps that *do* already depend on
      // tiptap directly — two copies of `@tiptap/pm` in one page break tiptap's
      // internal `instanceof` checks.
      external: id => id === 'vue' || id.startsWith('@tiptap/') || id === 'lowlight' || id === 'tiptap-extension-resize-image',
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  optimizeDeps: {
    include: ['aria-query', 'lz-string', 'pretty-format', 'reka-ui'],
    exclude: ['@lucide/vue'],
  },
  test: {
    deps: {
      optimizer: {
        web: {
          include: ['aria-query', 'lz-string', 'pretty-format', 'reka-ui'],
          exclude: ['@lucide/vue'],
        },
      },
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'node',
          include: ['src/**/*.test.ts'],
        },
      },
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
        },
      },
    ],
  },
})
