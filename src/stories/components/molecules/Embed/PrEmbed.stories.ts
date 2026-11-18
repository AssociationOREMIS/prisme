import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { PrEmbed } from '../../../../components/molecules/Embed'
import '../../../stories.css'

const meta = {
  title: 'Molecules/Embed',
  component: PrEmbed,
  tags: ['autodocs'],
  args: {
    // A blank page stands in for the service: the stories make no request to a third party.
    src: 'about:blank',
    title: "Formulaire d'adhésion OREMIS",
    provider: 'HelloAsso',
    consent: true,
    height: '28rem',
    externalLink: false,
  },
} satisfies Meta<typeof PrEmbed>

export default meta
type Story = StoryObj<typeof meta>

// A third-party service (a payment form, a video) asks first: nothing is loaded from it before
// the click, so no cookie and no IP address reach it (GDPR).
export const WithConsent: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvasElement.querySelector('iframe')).toBeNull()
    await userEvent.click(canvas.getByRole('button', { name: 'Afficher le contenu de HelloAsso' }))
    await expect(canvasElement.querySelector('iframe')?.getAttribute('title')).toBe("Formulaire d'adhésion OREMIS")
  },
}

// Loaded straight away, for a service the privacy policy already covers.
export const Direct: Story = {
  args: { consent: false },
}

// A video keeps its shape at every width.
export const AspectRatio: Story = {
  args: { consent: true, provider: 'YouTube', title: 'Présentation de l\'association', aspectRatio: '16/9' },
}
