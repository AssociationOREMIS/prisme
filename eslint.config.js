import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import vueA11y from 'eslint-plugin-vuejs-accessibility'
import storybook from 'eslint-plugin-storybook'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      'dist/',
      'storybook-static/',
      'coverage/',
      // Generated at build time, see scripts/generate-component-paths.mjs
      'src/components/paths.generated.ts',
      'src/components/loaders.generated.ts',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...vueA11y.configs['flat/recommended'],
  ...storybook.configs['flat/recommended'],

  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: { parser: tseslint.parser },
    },
  },

  {
    languageOptions: {
      globals: { ...globals.browser },
    },
    rules: {
      // Layout is not ESLint's job: these rules fight the one-line attributes used everywhere.
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/html-closing-bracket-newline': 'off',

      // A label works when it wraps its control or points to it, either one is enough.
      // Reka-ui renders the real control inside these components.
      'vuejs-accessibility/label-has-for': ['error', {
        required: { some: ['nesting', 'id'] },
        controlComponents: ['CheckboxRoot', 'SwitchRoot', 'RadioGroupItem'],
      }],
    },
  },

  {
    // Tests and stories declare small throwaway components inline.
    files: ['**/*.test.ts', '**/*.stories.ts'],
    rules: {
      'vue/one-component-per-file': 'off',
    },
  },

  {
    files: ['scripts/**', '*.config.{js,ts}', '.storybook/**'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
)
