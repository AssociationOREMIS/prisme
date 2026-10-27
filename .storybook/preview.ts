import type { Preview } from '@storybook/vue3-vite'
import { themes } from 'storybook/theming'
import '../src/styles/fonts.css'
import '../src/styles/prisme.css'
import './preview.css'
import type { PrTheme } from '../src/composables/usePrTheme'
import { usePrTheme } from '../src/composables/usePrTheme'

const themeValues = ['light', 'dark', 'system']
const layoutValues = ['centered', 'fullscreen', 'padded'] as const

type StoryLayout = (typeof layoutValues)[number]

// The browser tests run every story twice, in the light and in the dark theme (vite.config.ts
// defines __PRISME_TEST_THEME__ for the dark run): contrast failures of the dark theme went unseen
// while only the default theme, light in a headless browser, was checked.
declare const __PRISME_TEST_THEME__: PrTheme | undefined
const forcedTheme: PrTheme | undefined = typeof __PRISME_TEST_THEME__ === 'undefined' ? undefined : __PRISME_TEST_THEME__

/**
 * Rules axe runs on every story (tags written out, so an axe upgrade does not silently change
 * them): WCAG 2.0, 2.1 and 2.2 A/AA, which brings `target-size` (2.5.8), and the best practices.
 * Rules about a whole page are left out: a story is a fragment, without the <main>, <h1> or
 * unique landmarks of the page it will sit in.
 */
const axeTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']
const pageLevelRules = [
  'landmark-one-main',
  'page-has-heading-one',
  'landmark-complementary-is-top-level',
  'landmark-no-duplicate-banner',
  'landmark-no-duplicate-contentinfo',
  'landmark-no-duplicate-main',
  'landmark-unique',
  'landmark-banner-is-top-level',
  'landmark-contentinfo-is-top-level',
  'landmark-main-is-top-level',
  'region',
]

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
      const selectedTheme = forcedTheme ?? context.globals.prTheme
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
      test: 'error',
      options: {
        runOnly: { type: 'tag', values: axeTags },
        rules: Object.fromEntries(pageLevelRules.map((id) => [id, { enabled: false }])),
      },
    },
  },
}

export default preview
