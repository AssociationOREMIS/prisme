import type { Preview } from '@storybook/vue3-vite'
import '../src/styles/prisme.css'
import { setPrTheme, type PrTheme } from '../src/composables/usePrTheme'

const themeValues = ['light', 'dark', 'system']

function isPrTheme(value: unknown): value is PrTheme {
  return typeof value === 'string' && themeValues.includes(value)
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
      setPrTheme(isPrTheme(selectedTheme) ? selectedTheme : 'system')
      return {
        template: '<story />',
      }
    },
  ],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;
