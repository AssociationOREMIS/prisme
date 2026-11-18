import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrCard } from '../../../../components/atoms/Card'
import { PrGrid } from '../../../../components/atoms/Grid'
import { PrSection } from '../../../../components/layouts/Section'
import fond from '../../../assets/site-public/fond-vagues.svg'
import '../../../stories.css'

const meta = {
  title: 'Layout/Section',
  component: PrSection,
  tags: ['autodocs'],
  parameters: {
    prLayout: 'fullscreen',
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['default', 'subtle', 'primary'] },
    width: { control: 'inline-radio', options: ['full', 'wide', 'narrow'] },
    spacing: { control: 'inline-radio', options: ['none', 'md', 'lg'] },
  },
  args: {
    label: 'Nos engagements',
    tone: 'subtle',
    width: 'wide',
    spacing: 'md',
    parallax: false,
    overlay: 70,
    underNavbar: false,
  },
} satisfies Meta<typeof PrSection>

export default meta
type Story = StoryObj<typeof meta>

const heading = 'margin: 0 0 var(--pr-space-4); font-family: var(--pr-font-heading); color: var(--pr-color-heading);'

// A band of the page, the whole width, its content in a container.
export const Default: Story = {
  render: args => ({
    components: { PrSection },
    setup: () => ({ args }),
    template: `
      <PrSection v-bind="args">
        <h2 style="${heading}">Conçu pour tout le monde</h2>
        <p style="margin: 0; max-width: 40rem;">Tout se passe en ligne : chacun peut participer, où qu'il soit.</p>
      </PrSection>
    `,
  }),
}

// An image under a dark veil: the content switches to the dark theme, cards included, and the
// image stays still while scrolling (parallax), except on touch screens and with reduced motion.
export const WithBackground: Story = {
  args: { background: fond, parallax: true, spacing: 'lg' },
  render: args => ({
    components: { PrCard, PrGrid, PrSection },
    setup: () => ({ args }),
    template: `
      <PrSection v-bind="args">
        <PrGrid min="16rem" :gap="6">
          <PrCard title="Lutter contre le harcèlement" :heading-level="2">Prévention et sensibilisation dans les écoles.</PrCard>
          <PrCard title="Une école inclusive" :heading-level="2">Chaque élève doit trouver sa place.</PrCard>
          <PrCard title="L'assemblée générale" :heading-level="2">Prenez part aux orientations de l'association.</PrCard>
        </PrGrid>
      </PrSection>
    `,
  }),
}
