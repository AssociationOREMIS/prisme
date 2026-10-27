import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { ref } from 'vue'
import { PrTabs } from '../../../../components/molecules/Tabs'
import '../../../stories.css'

const tabs = [
  { value: 'overview', label: 'Vue d\'ensemble' },
  { value: 'activity', label: 'Activité' },
  { value: 'documents', label: 'Documents' },
  { value: 'settings', label: 'Paramètres', disabled: true },
]

const meta = {
  title: 'Navigation/Tabs',
  component: PrTabs,
  tags: ['autodocs'],
  args: {
    tabs,
    orientation: 'horizontal',
  },
} satisfies Meta<typeof PrTabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrTabs },
    setup() {
      const active = ref('overview')
      return { args, active }
    },
    template: `
      <PrTabs v-model="active" v-bind="args">
        <template #overview><p style="padding: 1rem 0; margin: 0; color: var(--pr-color-text-muted)">Contenu de la vue d'ensemble.</p></template>
        <template #activity><p style="padding: 1rem 0; margin: 0; color: var(--pr-color-text-muted)">Historique des activités récentes.</p></template>
        <template #documents><p style="padding: 1rem 0; margin: 0; color: var(--pr-color-text-muted)">Liste des documents associés.</p></template>
        <template #settings><p style="padding: 1rem 0; margin: 0; color: var(--pr-color-text-muted)">Paramètres du dossier.</p></template>
      </PrTabs>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const overviewTab = canvas.getByRole('tab', { name: 'Vue d\'ensemble' })
    await expect(overviewTab).toHaveAttribute('aria-selected', 'true')
    await expect(canvas.getByText('Contenu de la vue d\'ensemble.')).toBeVisible()

    await userEvent.click(canvas.getByRole('tab', { name: 'Activité' }))
    await expect(canvas.getByRole('tab', { name: 'Activité' })).toHaveAttribute('aria-selected', 'true')
    await expect(overviewTab).toHaveAttribute('aria-selected', 'false')
    await expect(canvas.getByText('Historique des activités récentes.')).toBeVisible()

    // A disabled tab must not steal the active state on click.
    await userEvent.click(canvas.getByRole('tab', { name: 'Paramètres' }))
    await expect(canvas.getByRole('tab', { name: 'Activité' })).toHaveAttribute('aria-selected', 'true')
  },
}

export const Vertical: Story = {
  render: () => ({
    components: { PrTabs },
    setup() {
      const active = ref('overview')
      return { active, tabs }
    },
    template: `
      <PrTabs v-model="active" :tabs="tabs" orientation="vertical" style="min-height: 10rem">
        <template #overview><p style="padding: 0 1rem; margin: 0; color: var(--pr-color-text-muted)">Contenu de la vue d'ensemble.</p></template>
        <template #activity><p style="padding: 0 1rem; margin: 0; color: var(--pr-color-text-muted)">Historique des activités récentes.</p></template>
        <template #documents><p style="padding: 0 1rem; margin: 0; color: var(--pr-color-text-muted)">Liste des documents associés.</p></template>
        <template #settings><p style="padding: 0 1rem; margin: 0; color: var(--pr-color-text-muted)">Paramètres du dossier.</p></template>
      </PrTabs>
    `,
  }),
}

export const Playground: Story = {
  render: (args) => ({
    components: { PrTabs },
    setup() {
      const active = ref('overview')
      return { args, active }
    },
    template: `
      <PrTabs v-model="active" v-bind="args">
        <template #overview><p style="padding: 1rem 0; margin: 0; color: var(--pr-color-text-muted)">Contenu de la vue d'ensemble.</p></template>
        <template #activity><p style="padding: 1rem 0; margin: 0; color: var(--pr-color-text-muted)">Historique des activités récentes.</p></template>
        <template #documents><p style="padding: 1rem 0; margin: 0; color: var(--pr-color-text-muted)">Liste des documents associés.</p></template>
        <template #settings><p style="padding: 1rem 0; margin: 0; color: var(--pr-color-text-muted)">Paramètres du dossier.</p></template>
      </PrTabs>
    `,
  }),
}

// The active tab is underlined, not only colored (its indicator stayed 0 px wide), and a tab
// list can be named.
export const ActiveIndicator: Story = {
  render: (args) => ({
    components: { PrTabs },
    setup() {
      return { args }
    },
    template: `
      <PrTabs v-bind="args" aria-label="Sections du dossier" default-value="activity">
        <template #overview>Vue d'ensemble</template>
        <template #activity>Activité</template>
        <template #documents>Documents</template>
      </PrTabs>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('tablist', { name: 'Sections du dossier' })).toBeTruthy()
    const active = canvas.getByRole('tab', { name: 'Activité' })
    // reka measures the active tab after mounting, then sizes the indicator.
    await waitFor(() => {
      const indicator = canvasElement.querySelector<HTMLElement>('.pr-tabs__indicator')
      expect(indicator).not.toBeNull()
      expect(Math.round(indicator!.getBoundingClientRect().width)).toBe(Math.round(active.getBoundingClientRect().width))
      expect(Math.round(indicator!.getBoundingClientRect().left)).toBe(Math.round(active.getBoundingClientRect().left))
    })
    // No grey browser button face behind the tab (1.93:1 in the dark theme).
    await expect(getComputedStyle(active).backgroundColor).toBe('rgba(0, 0, 0, 0)')
  },
}
