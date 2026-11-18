import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import { PrLink } from '../../../../components/atoms/Link'
import '../../../stories.css'

const meta = {
  title: 'Atoms/Link',
  component: PrLink,
  tags: ['autodocs'],
  args: {
    href: '#adherer',
  },
} satisfies Meta<typeof PrLink>

export default meta
type Story = StoryObj<typeof meta>

// The bare link the other components are built on: an <a>, or the app's RouterLink with `to`.
// Unstyled on purpose: it takes the classes of the component that uses it.
export const Default: Story = {
  render: args => ({
    components: { PrLink },
    setup: () => ({ args }),
    template: '<PrLink v-bind="args" style="color: var(--pr-color-primary);">Adhérer à OREMIS</PrLink>',
  }),
}

// A link of a navigation: `aria-current="page"` and `data-current` on the current page, to style it.
export const CurrentPage: Story = {
  args: { current: true },
  render: args => ({
    components: { PrLink },
    setup: () => ({ args }),
    template: `
      <PrLink v-bind="args" style="color: var(--pr-color-primary); text-decoration: underline; text-underline-offset: 6px;">
        Adhérer (page courante)
      </PrLink>
    `,
  }),
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link')
    await expect(link.getAttribute('aria-current')).toBe('page')
    await expect(link.dataset.current).toBe('true')
  },
}
