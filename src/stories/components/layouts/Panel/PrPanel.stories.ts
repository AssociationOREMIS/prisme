import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrContainer } from '../../../../components/layouts/Container'
import { PrPanel } from '../../../../components/layouts/Panel'
import { PrLinkList } from '../../../../components/molecules/LinkList'
import { devopsNotes } from '../../molecules/LinkList/demoItems'
import '../../../stories.css'

const meta = {
  title: 'Layout/Panel',
  component: PrPanel,
  tags: ['autodocs'],
  parameters: {
    prLayout: 'fullscreen',
  },
  args: {
    asideLabel: 'À propos de l\'équipe',
    asideTag: 'aside',
  },
} satisfies Meta<typeof PrPanel>

export default meta
type Story = StoryObj<typeof meta>

const heading = 'margin: 0 0 var(--pr-space-4); font-family: var(--pr-font-heading); color: var(--pr-color-heading);'

// A main column and a side column on a subtle background, under it below 1024px.
export const WithAside: Story = {
  render: (args) => ({
    components: { PrContainer, PrLinkList, PrPanel },
    setup: () => ({ args, devopsNotes }),
    template: `
      <PrContainer style="padding-block: var(--pr-space-6);">
        <PrPanel v-bind="args">
          <h2 style="${heading}">Dernières notes</h2>
          <PrLinkList :items="devopsNotes" />
          <template #aside>
            <h2 style="${heading} font-size: var(--pr-font-size-xl);">L'équipe</h2>
            <p style="margin: 0;">Camille MARTIN et Alex DURAND maintiennent les outils numériques de l'association.</p>
          </template>
        </PrPanel>
      </PrContainer>
    `,
  }),
}

export const MainOnly: Story = {
  render: () => ({
    components: { PrContainer, PrPanel },
    template: `
      <PrContainer style="padding-block: var(--pr-space-6);">
        <PrPanel><p style="margin: 0;">Un panneau sans colonne latérale.</p></PrPanel>
      </PrContainer>
    `,
  }),
}
