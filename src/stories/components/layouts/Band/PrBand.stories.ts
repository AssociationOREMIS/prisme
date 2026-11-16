import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { HeartHandshake, Users } from '@lucide/vue'
import { PrButton } from '../../../../components/atoms/Button'
import { PrContainer } from '../../../../components/layouts/Container'
import { PrBand } from '../../../../components/layouts/Band'
import { PrFeature } from '../../../../components/molecules/Feature'
import '../../../stories.css'

const meta = {
  title: 'Layout/Band',
  component: PrBand,
  tags: ['autodocs'],
  parameters: {
    prLayout: 'fullscreen',
  },
  argTypes: {
    tone: { control: 'select', options: ['primary', 'subtle', 'surface'] },
  },
  args: {
    tone: 'primary',
    as: 'section',
    label: 'Nous rejoindre',
  },
} satisfies Meta<typeof PrBand>

export default meta
type Story = StoryObj<typeof meta>

const text = `
  <h2 style="margin: 0 0 var(--pr-space-3); font-family: var(--pr-font-heading); color: var(--pr-color-heading);">Rejoignez les bénévoles</h2>
  <p style="margin: 0 0 var(--pr-space-4);">Une heure par semaine suffit pour écouter un élève ou animer un atelier.</p>
  <PrButton href="#benevolat">Devenir bénévole</PrButton>
`

export const Default: Story = {
  render: (args) => ({
    components: { PrBand, PrButton, PrContainer },
    setup: () => ({ args }),
    template: `<PrContainer style="padding-block: var(--pr-space-6);"><PrBand v-bind="args">${text}</PrBand></PrContainer>`,
  }),
}

// A right column from 1024px, under the text below.
export const WithAside: Story = {
  render: (args) => ({
    components: { PrBand, PrButton, PrContainer, PrFeature },
    setup: () => ({ args, HeartHandshake, Users }),
    template: `
      <PrContainer style="padding-block: var(--pr-space-6);">
        <PrBand v-bind="args">
          ${text}
          <template #aside>
            <div style="display: grid; gap: var(--pr-space-3);">
              <PrFeature :icon="Users" title="320 bénévoles" description="Dans toute la France." />
              <PrFeature :icon="HeartHandshake" title="Formés et suivis" description="Par l'équipe d'Alex DURAND." />
            </div>
          </template>
        </PrBand>
      </PrContainer>
    `,
  }),
}

export const Tones: Story = {
  render: () => ({
    components: { PrBand, PrContainer },
    template: `
      <PrContainer style="display: grid; gap: var(--pr-space-4); padding-block: var(--pr-space-6);">
        <PrBand tone="primary" as="div">primary : fond primaire doux et sa bordure.</PrBand>
        <PrBand tone="subtle" as="div">subtle : la surface atténuée.</PrBand>
        <PrBand tone="surface" as="div">surface : la surface avec une bordure.</PrBand>
      </PrContainer>
    `,
  }),
}
