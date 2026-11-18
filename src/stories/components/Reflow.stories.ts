import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, waitFor, within } from 'storybook/test'
import { PrBadge } from '../../components/atoms/Badge'
import { PrButton } from '../../components/atoms/Button'
import { PrCard } from '../../components/atoms/Card'
import { PrCheckbox } from '../../components/atoms/Checkbox'
import { PrSlider } from '../../components/atoms/Slider'
import { PrSwitch } from '../../components/atoms/Switch'
import { PrTable } from '../../components/atoms/Table'
import { PrPageHeader } from '../../components/layouts/PageHeader'
import { PrDataTable } from '../../components/molecules/DataTable'
import { PrDescriptionItem, PrDescriptionList } from '../../components/molecules/DescriptionList'
import { PrPagination } from '../../components/molecules/Pagination'
import { PrRadioGroup } from '../../components/molecules/RadioGroup'
import { PrStepper } from '../../components/molecules/Stepper'
import { PrTabs } from '../../components/molecules/Tabs'
import './../stories.css'

// WCAG 1.4.10 (Reflow): the components of a page laid out in a 320 px wide column, the width of a
// small phone or of a desktop page zoomed to 400 %. Nothing may stick out of the column or make
// the page scroll sideways: a wide table scrolls inside its own container, never the page.
const meta = {
  title: 'Foundations/Reflow',
} satisfies Meta

type Story = StoryObj<typeof meta>

// noinspection JSUnusedGlobalSymbols
export default meta

const rows = [
  { id: 'DEM-1042', title: 'Accompagner une élève de 5e après des moqueries répétées en récréation', status: 'En cours' },
  { id: 'DEM-1039', title: 'Préparer la rencontre avec l\'équipe pédagogique du collège Jean Moulin', status: 'À traiter' },
]

const columns = [
  { key: 'id', label: 'Demande', sortable: true, width: '7rem' },
  { key: 'title', label: 'Objet', sortable: true, class: 'pr:min-w-[24rem]' },
  { key: 'status', label: 'Statut', sortable: true, width: '10rem' },
]

/** Elements sticking out of `column` on the right or the left, outside any scroll container. */
function overflowing(column: HTMLElement): string[] {
  const box = column.getBoundingClientRect()
  const clipped = (element: Element) => {
    for (let parent = element.parentElement; parent && parent !== column; parent = parent.parentElement) {
      if (getComputedStyle(parent).overflowX !== 'visible') return true
    }
    return false
  }
  return Array.from(column.querySelectorAll<HTMLElement>('*'))
    .filter((element) => {
      const rect = element.getBoundingClientRect()
      return rect.width > 1 && (rect.right > box.right + 1 || rect.left < box.left - 1) && !clipped(element)
    })
    .map(element => `${element.tagName.toLowerCase()}.${String(element.className).split(' ')[0]}`)
}

// noinspection JSUnusedGlobalSymbols
export const NarrowColumn: Story = {
  render: () => ({
    components: { PrBadge, PrButton, PrCard, PrCheckbox, PrDataTable, PrDescriptionItem, PrDescriptionList, PrPageHeader, PrPagination, PrRadioGroup, PrSlider, PrStepper, PrSwitch, PrTable, PrTabs },
    setup: () => ({
      rows,
      columns,
      steps: [{ label: 'Informations' }, { label: 'Documents' }, { label: 'Validation' }, { label: 'Confirmation' }],
      tabs: [{ value: 'profil', label: 'Profil' }, { value: 'formations', label: 'Formations' }, { value: 'sanctions', label: 'Sanctions' }, { value: 'notes', label: 'Notes internes' }],
    }),
    template: `
      <div data-testid="column" style="box-sizing: border-box; display: grid; gap: 1.5rem; width: 320px; max-width: 100%;">
        <PrPageHeader title="Camille MARTIN" description="Bénévole depuis le 12 septembre 2024, antenne de Lyon." back-href="#benevoles" back-label="Retour aux bénévoles">
          <template #actions>
            <PrButton action="edit" variant="secondary">Modifier</PrButton>
            <PrButton action="add">Nouvelle sanction</PrButton>
          </template>
        </PrPageHeader>
        <PrTabs :tabs="tabs" default-value="profil" aria-label="Fiche du bénévole" />
        <PrCard title="Sanctions en cours" description="Suspensions et avertissements actifs de ce bénévole.">
          <template #actions>
            <PrButton action="add" variant="secondary" size="sm">Ajouter</PrButton>
          </template>
          <PrDescriptionList>
            <PrDescriptionItem label="Décidée par"><a href="#alex">Alex DURAND</a></PrDescriptionItem>
            <PrDescriptionItem label="Statut"><PrBadge variant="warning">En cours</PrBadge></PrDescriptionItem>
          </PrDescriptionList>
        </PrCard>
        <PrDataTable caption="Demandes d'accompagnement" :columns="columns" :rows="rows" selectable :row-actions="[{ label: 'Modifier' }]" />
        <PrTable caption="Demandes" caption-hidden>
          <thead><tr><th>Demande</th><th>Objet</th><th>Statut</th></tr></thead>
          <tbody><tr><td>DEM-1042</td><td>Accompagner une élève de 5e après des moqueries répétées</td><td>En cours</td></tr></tbody>
        </PrTable>
        <PrStepper :model-value="1" :steps="steps" aria-label="Inscription" />
        <PrPagination :page-count="20" :page="10" />
        <div data-testid="controls" style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: center;">
          <PrCheckbox aria-label="Sélectionner Camille MARTIN" />
          <PrSwitch aria-label="Disponible" />
          <PrRadioGroup label="Antenne" :options="[{ value: 'lyon', label: 'Lyon' }]" default-value="lyon" />
          <PrSlider label="Priorité" :default-value="40" style="width: 8rem;" />
        </div>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const column = canvas.getByTestId('column')

    // The page itself never scrolls sideways (a visually hidden text of a table used to escape its
    // scroll container and widen the page by hundreds of pixels).
    await waitFor(() => expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth))
    await expect(overflowing(column)).toEqual([])

    // The wide table scrolls inside its own container.
    const scroll = canvasElement.querySelector<HTMLElement>('.pr-data-table__scroll')!
    await expect(scroll.scrollWidth).toBeGreaterThan(scroll.clientWidth)

    // WCAG 2.5.8: the small controls take a tap anywhere in a 24 x 24 px square centred on them
    // (or in their own box when it is larger).
    const controls = canvas.getByTestId('controls')
    // elementFromPoint only sees the viewport.
    controls.scrollIntoView({ block: 'center' })
    const missed: string[] = []
    for (const selector of ['.pr-checkbox__control', '.pr-switch__control', '.pr-radio-group__item', '.pr-slider__thumb']) {
      const target = controls.querySelector<HTMLElement>(selector)!
      const rect = target.getBoundingClientRect()
      const halfWidth = Math.max(11.5, rect.width / 2 - 0.5)
      const halfHeight = Math.max(11.5, rect.height / 2 - 0.5)
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        const hit = document.elementFromPoint(x + dx * halfWidth, y + dy * halfHeight)
        if (!hit || (hit !== target && !target.contains(hit))) missed.push(`${selector} (${dx}, ${dy}): ${hit?.className}`)
      }
    }
    await expect(missed).toEqual([])
  },
}
