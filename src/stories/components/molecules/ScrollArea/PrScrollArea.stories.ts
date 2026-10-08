import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, waitFor } from 'storybook/test'
import { PrScrollArea } from '../../../../components/molecules/ScrollArea'
import '../../../stories.css'

const meta = {
  title: 'Layout/ScrollArea',
  component: PrScrollArea,
  tags: ['autodocs'],
  args: {
    maxHeight: '10rem',
  },
} satisfies Meta<typeof PrScrollArea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrScrollArea },
    setup() {
      return { args }
    },
    template: `
      <PrScrollArea v-bind="args">
        <p v-for="item in 12" :key="item" class="story-muted">Ligne {{ item }}</p>
      </PrScrollArea>
    `,
  }),
  // A scrollbar only where the content overflows: an always-visible horizontal one
  // fought the corner for its size (ResizeObserver loop error).
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(canvasElement.querySelector('[data-orientation="vertical"]')).not.toBeNull())
    await expect(canvasElement.querySelector('[data-orientation="horizontal"]')).toBeNull()
  },
}

export const WideContent: Story = {
  render: (args) => ({
    components: { PrScrollArea },
    setup() {
      return { args }
    },
    template: `
      <PrScrollArea v-bind="args" style="width: 16rem;">
        <p v-for="item in 12" :key="item" class="story-muted" style="white-space: nowrap;">Ligne {{ item }} avec un texte assez long pour deborder sur le cote</p>
      </PrScrollArea>
    `,
  }),
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(canvasElement.querySelector('[data-orientation="horizontal"]')).not.toBeNull())
    const vertical = canvasElement.querySelector<HTMLElement>('[data-orientation="vertical"]')!
    const horizontal = canvasElement.querySelector<HTMLElement>('[data-orientation="horizontal"]')!
    // The two scrollbars do not overlap in the bottom right corner.
    await expect(vertical.getBoundingClientRect().bottom).toBeLessThanOrEqual(horizontal.getBoundingClientRect().top + 0.5)
  },
}
