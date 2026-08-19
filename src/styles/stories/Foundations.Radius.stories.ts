import type { Meta, StoryObj } from '@storybook/vue3-vite'
import './foundations.css'

const radii = [
  ['XS', '--pr-radius-xs'],
  ['SM', '--pr-radius-sm'],
  ['MD', '--pr-radius-md'],
  ['LG', '--pr-radius-lg'],
]

const meta = {
  title: 'Foundations/Radius',
  tags: ['autodocs'],
  render: () => ({
    setup() {
      return { radii }
    },
    template: `
      <div class="foundation-page">
        <div>
          <h1>Radius</h1>
          <p>Des arrondis discrets, adaptes aux outils professionnels.</p>
        </div>
        <div class="foundation-type-sample">
          <div v-for="radius in radii" :key="radius[1]" class="foundation-radius-row">
            <strong>{{ radius[0] }}</strong>
            <div class="foundation-radius-box" :style="{ borderRadius: 'var(' + radius[1] + ')' }" />
            <span class="foundation-token__meta">{{ radius[1] }}</span>
          </div>
        </div>
      </div>
    `,
  }),
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Radius: Story = {}
