import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrFooter } from '../../../../components/layouts/Footer'
import { footerColumns, footerLegalLinks, footerSocials } from './footerDemo'
import '../../../stories.css'

const meta = {
  title: 'Layout/Footer',
  component: PrFooter,
  tags: ['autodocs'],
  parameters: {
    prLayout: 'fullscreen',
  },
  args: {
    siteName: 'OREMIS DevOps',
    homeHref: '#accueil',
    description: 'Les notes de l\'équipe qui construit les outils d\'OREMIS, association contre le harcèlement scolaire.',
    columns: footerColumns,
    socials: footerSocials,
    legalLinks: footerLegalLinks,
  },
} satisfies Meta<typeof PrFooter>

export default meta
type Story = StoryObj<typeof meta>

// Brand, description and social links, then one named navigation per column; legal links at the
// bottom. The logo follows the theme (white logo in dark).
export const Default: Story = {}

export const Minimal: Story = {
  args: {
    siteName: undefined,
    homeHref: undefined,
    description: undefined,
    columns: [],
    socials: [],
    legalLinks: [{ label: 'Mentions légales', href: '#mentions-legales' }],
  },
}
