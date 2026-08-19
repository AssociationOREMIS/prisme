import type { Meta, StoryObj } from '@storybook/vue3-vite'
import './foundations.css'

const primitiveTokens = [
  ['Blue 50', '--pr-blue-50', '#eff8ff'],
  ['Blue 500', '--pr-blue-500', '#0077b6'],
  ['Blue 900', '--pr-blue-900', '#0d2c99'],
  ['Green 400', '--pr-green-400', '#31c48d'],
  ['Yellow 400', '--pr-yellow-400', '#ebb223'],
  ['Neutral 50', '--pr-neutral-50', '#f8fafc'],
  ['Neutral 500', '--pr-neutral-500', '#64748b'],
  ['Neutral 900', '--pr-neutral-900', '#0f172a'],
]

const semanticTokens = [
  ['Background', '--pr-color-background'],
  ['Surface', '--pr-color-surface'],
  ['Border', '--pr-color-border'],
  ['Text', '--pr-color-text'],
  ['Text muted', '--pr-color-text-muted'],
  ['Primary', '--pr-color-primary'],
  ['Success', '--pr-color-success'],
  ['Warning', '--pr-color-warning'],
  ['Danger', '--pr-color-danger'],
  ['Info', '--pr-color-info'],
]

const meta = {
  title: 'Prisme/Foundations/Colors',
  tags: ['autodocs'],
  render: () => ({
    setup() {
      return { primitiveTokens, semanticTokens }
    },
    template: `
      <div class="foundation-page">
        <div>
          <h1>Colors</h1>
          <p>Primitives OREMIS modernisees et tokens semantiques consommes par les composants.</p>
        </div>

        <section>
          <h2>Primitives</h2>
          <div class="foundation-grid">
            <article v-for="token in primitiveTokens" :key="token[1]" class="foundation-token">
              <div class="foundation-swatch" :style="{ background: token[2] }" />
              <div class="foundation-token__body">
                <span class="foundation-token__name">{{ token[0] }}</span>
                <span class="foundation-token__meta">{{ token[1] }}</span>
                <span class="foundation-token__meta">{{ token[2] }}</span>
              </div>
            </article>
          </div>
        </section>

        <section>
          <h2>Semantics</h2>
          <div class="foundation-grid">
            <article v-for="token in semanticTokens" :key="token[1]" class="foundation-token">
              <div class="foundation-swatch" :style="{ background: 'var(' + token[1] + ')' }" />
              <div class="foundation-token__body">
                <span class="foundation-token__name">{{ token[0] }}</span>
                <span class="foundation-token__meta">{{ token[1] }}</span>
                <span class="foundation-token__meta">var({{ token[1] }})</span>
              </div>
            </article>
          </div>
        </section>
      </div>
    `,
  }),
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Colors: Story = {}
