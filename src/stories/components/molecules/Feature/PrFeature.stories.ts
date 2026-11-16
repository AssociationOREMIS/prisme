import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Accessibility, LifeBuoy, ShieldCheck } from '@lucide/vue'
import { PrGrid } from '../../../../components/atoms/Grid'
import { PrFeature } from '../../../../components/molecules/Feature'
import '../../../stories.css'

const meta = {
  title: 'Data Display/Feature',
  component: PrFeature,
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'select', options: ['surface', 'plain'] },
    headingLevel: { control: 'select', options: [undefined, 2, 3, 4] },
  },
  args: {
    icon: ShieldCheck,
    title: 'Des outils sûrs',
    description: 'Les données des élèves restent en France et sont sauvegardées chaque nuit.',
    tone: 'surface',
  },
} satisfies Meta<typeof PrFeature>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrFeature },
    setup: () => ({ args }),
    template: '<PrFeature v-bind="args" style="max-width: 26rem;" />',
  }),
}

// Plain tiles in a grid, titles as h3 under a section title.
export const PlainGrid: Story = {
  render: () => ({
    components: { PrFeature, PrGrid },
    setup: () => ({ Accessibility, LifeBuoy, ShieldCheck }),
    template: `
      <section aria-labelledby="engagements" style="width: 100%;">
        <h2 id="engagements" style="margin: 0 0 var(--pr-space-4); font-family: var(--pr-font-heading); color: var(--pr-color-heading);">Nos engagements</h2>
        <PrGrid as="ul" min="16rem" :gap="6" style="margin: 0; padding: 0; list-style: none;">
          <PrFeature as="li" tone="plain" :heading-level="3" :icon="ShieldCheck" title="Sécurité" description="Des données protégées et sauvegardées." />
          <PrFeature as="li" tone="plain" :heading-level="3" :icon="Accessibility" title="Accessibilité" description="Des outils utilisables par tous les bénévoles." />
          <PrFeature as="li" tone="plain" :heading-level="3" :icon="LifeBuoy" title="Assistance" description="Une équipe qui répond sous 48 heures." />
        </PrGrid>
      </section>
    `,
  }),
}
