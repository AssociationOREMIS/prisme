import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { PrVisuallyHidden } from '../../../../components/atoms/VisuallyHidden'
import '../../../stories.css'

const meta = {
  title: 'Accessibility/VisuallyHidden',
  component: PrVisuallyHidden,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Un texte lu par les lecteurs d\'écran mais invisible à l\'écran. Avec `focusable`, il réapparaît quand il (ou un lien qu\'il contient) reçoit le focus : un lien d\'évitement.',
      },
    },
  },
} satisfies Meta<typeof PrVisuallyHidden>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { PrVisuallyHidden },
    template: `
      <p style="margin: 0;">
        <a href="tel:3018">3018<PrVisuallyHidden> (appel gratuit et anonyme)</PrVisuallyHidden></a>
      </p>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('link', { name: '3018 (appel gratuit et anonyme)' })).toBeVisible()
  },
}

export const SkipLink: Story = {
  render: () => ({
    components: { PrVisuallyHidden },
    template: `
      <div class="story-column">
        <PrVisuallyHidden focusable>
          <a href="#formulaire" style="display: inline-block; padding: var(--pr-space-2) var(--pr-space-3); color: var(--pr-color-primary); font-weight: 700;">Aller au formulaire</a>
        </PrVisuallyHidden>
        <p style="margin: 0; color: var(--pr-color-text-muted);">Appuyez sur Tab : le lien d'évitement apparaît.</p>
        <p id="formulaire" style="margin: 0;">Formulaire</p>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const link = canvas.getByRole('link', { name: 'Aller au formulaire' })
    const wrapper = link.closest('.pr-visually-hidden') as HTMLElement
    await expect(wrapper.getBoundingClientRect().width).toBeLessThanOrEqual(1)

    await userEvent.tab()
    await expect(link).toHaveFocus()
    await expect(wrapper.getBoundingClientRect().width).toBeGreaterThan(1)
  },
}
