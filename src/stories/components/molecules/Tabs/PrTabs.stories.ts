import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
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
