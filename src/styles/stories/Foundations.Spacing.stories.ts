import type { Meta, StoryObj } from '@storybook/vue3-vite'
import './foundations.css'

const spaces = [
  ['Space 1', '--pr-space-1', '0.25rem'],
  ['Space 2', '--pr-space-2', '0.5rem'],
  ['Space 3', '--pr-space-3', '0.75rem'],
  ['Space 4', '--pr-space-4', '1rem'],
  ['Space 6', '--pr-space-6', '1.5rem'],
  ['Space 8', '--pr-space-8', '2rem'],
]

const meta = {
  title: 'Prisme/Foundations/Spacing',
  tags: ['autodocs'],
  render: () => ({
    setup() {
      return { spaces }
    },
    template: `
      <div class="foundation-page">
        <div>
          <h1>Spacing</h1>
          <p>Espacements bases sur des pas de 4px pour garder les composants compacts.</p>
        </div>
        <div class="foundation-type-sample">
          <div v-for="space in spaces" :key="space[1]" class="foundation-space-row">
            <strong>{{ space[0] }}</strong>
            <div class="foundation-space-bar" :style="{ width: 'var(' + space[1] + ')' }" />
            <span class="foundation-token__meta">{{ space[2] }}</span>
          </div>
        </div>
      </div>
    `,
  }),
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Spacing: Story = {}
