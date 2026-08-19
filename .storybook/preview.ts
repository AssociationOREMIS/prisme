import type { Preview } from '@storybook/vue3-vite'
import { themes } from 'storybook/theming'
import '../src/styles/prisme.css'
import './preview.css'
import type { PrResolvedTheme, PrTheme } from '../src/composables/usePrTheme'

const themeValues = ['light', 'dark', 'system']
const layoutValues = ['centered', 'fullscreen', 'padded'] as const

type StoryLayout = (typeof layoutValues)[number]

function isPrTheme(value: unknown): value is PrTheme {
  return typeof value === 'string' && themeValues.includes(value)
}

function resolveStoryTheme(value: PrTheme): PrResolvedTheme {
  if (value !== 'system') {
    return value
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveStoryLayout(value: unknown): StoryLayout {
  return typeof value === 'string' && layoutValues.includes(value as StoryLayout)
    ? (value as StoryLayout)
    : 'centered'
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
      const prStorybookTheme = resolveStoryTheme(isPrTheme(selectedTheme) ? selectedTheme : 'system')
      const prStorybookLayout = resolveStoryLayout(context.parameters.prLayout)

      return {
        setup() {
          return { prStorybookLayout, prStorybookTheme }
        },
        template: `
          <div class="pr-storybook-canvas" :data-pr-layout="prStorybookLayout" :data-pr-theme="prStorybookTheme">
            <div class="pr-storybook-surface" :data-pr-theme="prStorybookTheme">
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
