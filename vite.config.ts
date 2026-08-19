/// <reference types="vitest/config" />
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vite'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue()],
  resolve: {
    dedupe: ['vue'],
  },
  build: {
    copyPublicDir: false,
    lib: {
      entry: path.resolve(dirname, 'src/index.ts'),
      name: 'Prisme',
      formats: ['es'],
      fileName: () => 'prisme.js',
      cssFileName: 'styles',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  optimizeDeps: {
    include: ['aria-query', 'lz-string', 'pretty-format'],
    exclude: ['@lucide/vue'],
  },
  test: {
    deps: {
      optimizer: {
        web: {
          include: ['aria-query', 'lz-string', 'pretty-format'],
          exclude: ['@lucide/vue'],
        },
      },
    },
    projects: [
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
