import type { Preview } from '@storybook/vue3-vite'
import { themes } from 'storybook/theming'
import '../src/styles/prisme.css'
import './preview.css'
import type { PrTheme } from '../src/composables/usePrTheme'
import { usePrTheme } from '../src/composables/usePrTheme'

const themeValues = ['light', 'dark', 'system']
const layoutValues = ['centered', 'fullscreen', 'padded'] as const

type StoryLayout = (typeof layoutValues)[number]

function isPrTheme(value: unknown): value is PrTheme {
  return typeof value === 'string' && themeValues.includes(value)
}

function resolveStoryLayout(value: unknown): StoryLayout {
  return typeof value === 'string' && layoutValues.includes(value as StoryLayout)
    ? (value as StoryLayout)
    : 'padded'
}

const preview: Preview = {
  globalTypes: {
    prTheme: {
      name: 'Theme',
      description: 'Prisme color theme',
      defaultValue: 'system',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'system', title: 'System' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (_story, context) => {
      const selectedTheme = context.globals.prTheme
      const prStorybookLayout = resolveStoryLayout(context.parameters.prLayout)

      return {
        setup() {
          // Drive the wrapper's theme from usePrTheme()'s own reactive state
          // (the same module-level singleton every PrThemeToggle/story uses),
          // instead of a static snapshot — so a story-side toggle click and
          // the toolbar's Theme control both update the same visible state.
          const { resolvedTheme, setTheme } = usePrTheme()
          if (isPrTheme(selectedTheme)) setTheme(selectedTheme)
          return { prStorybookLayout, resolvedTheme }
        },
        template: `
          <div class="pr-storybook-canvas" :data-pr-layout="prStorybookLayout" :data-pr-theme="resolvedTheme">
            <div class="pr-storybook-surface" :data-pr-theme="resolvedTheme">
              <story />
            </div>
          </div>
        `,
      }
    },
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      theme: themes.dark,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
}

export default preview
