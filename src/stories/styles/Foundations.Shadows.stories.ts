import type { Meta, StoryObj } from '@storybook/vue3-vite'
import './foundations.css'

const shadows = [
  ['XS', '--pr-shadow-xs'],
  ['SM', '--pr-shadow-sm'],
  ['MD', '--pr-shadow-md'],
]

const meta = {
  title: 'Foundations/Shadows',
  tags: ['autodocs'],
  render: () => ({
    setup() {
      return { shadows }
    },
    template: `
      <div class="foundation-page">
        <div>
          <h1>Shadows</h1>
          <p>Ombres faibles reservees a la separation fonctionnelle des surfaces.</p>
        </div>
        <div class="foundation-type-sample">
          <div v-for="shadow in shadows" :key="shadow[1]" class="foundation-shadow-row">
            <strong>{{ shadow[0] }}</strong>
            <div class="foundation-shadow-box" :style="{ boxShadow: 'var(' + shadow[1] + ')' }" />
            <span class="foundation-token__meta">{{ shadow[1] }}</span>
          </div>
        </div>
      </div>
    `,
  }),
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Shadows: Story = {}
