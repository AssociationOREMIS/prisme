import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import { reactive } from 'vue'
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Circle,
  CircleCheck,
  CircleDashed,
  CircleOff,
  Timer,
} from '@lucide/vue'
import { PrBadge } from '../../../../components/atoms/Badge'
import { PrDataTable } from '../../../../components/molecules/DataTable'
import '../../../stories.css'

// Requests followed by volunteers: fictional people and situations.
const labels = [
  { value: 'harcelement', label: 'Harcèlement' },
  { value: 'handicap', label: 'Handicap' },
  { value: 'formation', label: 'Formation' },
]

const statuses = [
  { value: 'backlog', label: 'À qualifier', icon: CircleDashed },
  { value: 'todo', label: 'À traiter', icon: Circle },
  { value: 'in progress', label: 'En cours', icon: Timer },
  { value: 'done', label: 'Terminée', icon: CircleCheck },
  { value: 'canceled', label: 'Annulée', icon: CircleOff },
]

const priorities = [
  { value: 'low', label: 'Basse', icon: ArrowDown },
  { value: 'medium', label: 'Normale', icon: ArrowRight },
  { value: 'high', label: 'Haute', icon: ArrowUp },
]

const data = [
  { id: 'DEM-1042', title: 'Accompagner une élève de 5e après des moqueries répétées en récréation', status: 'in progress', label: 'harcelement', priority: 'high' },
  { id: 'DEM-1039', title: 'Préparer la rencontre avec l\'équipe pédagogique du collège Jean Moulin', status: 'todo', label: 'harcelement', priority: 'medium' },
  { id: 'DEM-1037', title: 'Trouver un aménagement d\'examen pour un élève dyslexique', status: 'in progress', label: 'handicap', priority: 'high' },
  { id: 'DEM-1031', title: 'Former trois nouveaux bénévoles de l\'antenne de Lyon', status: 'backlog', label: 'formation', priority: 'medium' },
  { id: 'DEM-1028', title: 'Relancer la famille pour le dossier MDPH', status: 'canceled', label: 'handicap', priority: 'low' },
  { id: 'DEM-1024', title: 'Intervention de sensibilisation en classe de CM2', status: 'done', label: 'harcelement', priority: 'medium' },
  { id: 'DEM-1019', title: 'Mettre en place un tutorat entre élèves pour la rentrée', status: 'done', label: 'handicap', priority: 'medium' },
  { id: 'DEM-1015', title: 'Répondre à un parent inquiet après un message sur un réseau social', status: 'in progress', label: 'harcelement', priority: 'high' },
  { id: 'DEM-1011', title: 'Mettre à jour le module de formation sur l\'écoute active', status: 'todo', label: 'formation', priority: 'low' },
  { id: 'DEM-1008', title: 'Organiser l\'accueil d\'un élève en fauteuil lors d\'une sortie scolaire', status: 'in progress', label: 'handicap', priority: 'high' },
  { id: 'DEM-1003', title: 'Bilan de fin d\'accompagnement avec Camille MARTIN', status: 'done', label: 'harcelement', priority: 'medium' },
  { id: 'DEM-0998', title: 'Réunion d\'équipe des bénévoles formateurs', status: 'backlog', label: 'formation', priority: 'low' },
]

const columns = [
  { key: 'id', label: 'Demande', sortable: true, hideable: false, width: '7rem' },
  { key: 'title', label: 'Objet', sortable: true, filterable: true, class: 'pr:min-w-[24rem]' },
  { key: 'status', label: 'Statut', sortable: true, width: '10rem' },
  { key: 'priority', label: 'Priorité', sortable: true, width: '9rem' },
]

const meta = {
  title: 'Data Display/DataTable',
  component: PrDataTable,
  tags: ['autodocs'],
  args: {
    columns,
    rows: data,
    selectable: true,
    pageSize: 10,
    filterKey: 'title',
    filterPlaceholder: 'Filtrer les demandes...',
    showSelectedRowsCount: true,
    rowActions: [{ label: 'Modifier' }, { label: 'Supprimer', tone: 'danger' as const }],
  },
} satisfies Meta<typeof PrDataTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrBadge, PrDataTable },
    setup() {
      return { args, labels, priorities, statuses }
    },
    template: `
      <PrDataTable v-bind="args">
        <template #cell-title="{ value, row }">
          <div class="pr:flex pr:items-center pr:gap-[var(--pr-space-2)]">
            <PrBadge variant="neutral">{{ labels.find((label) => label.value === row.label)?.label }}</PrBadge>
            <span class="pr:block pr:max-w-[32rem] pr:truncate pr:font-semibold">{{ value }}</span>
          </div>
        </template>

        <template #cell-status="{ value }">
          <div class="pr:flex pr:w-[8rem] pr:items-center">
            <component :is="statuses.find((status) => status.value === value)?.icon" class="pr:mr-[var(--pr-space-2)] pr:size-4 pr:text-[color:var(--pr-color-text-muted)]" aria-hidden="true" />
            <span>{{ statuses.find((status) => status.value === value)?.label }}</span>
          </div>
        </template>

        <template #cell-priority="{ value }">
          <div class="pr:flex pr:items-center">
            <component :is="priorities.find((priority) => priority.value === value)?.icon" class="pr:mr-[var(--pr-space-2)] pr:size-4 pr:text-[color:var(--pr-color-text-muted)]" aria-hidden="true" />
            <span>{{ priorities.find((priority) => priority.value === value)?.label }}</span>
          </div>
        </template>
      </PrDataTable>
    `,
  }),
}

export const Loading: Story = {
  args: {
    loading: true,
  },
  render: Default.render,
}

export const Empty: Story = {
  args: {
    rows: [],
  },
  render: Default.render,
}

export const ServerSide: Story = {
  args: {
    serverSide: true,
  },
  render: (args) => ({
    components: { PrDataTable },
    setup() {
      // Simulates a Laravel `Model::paginate()` endpoint: sorting, filtering
      // and pagination all happen "server-side" instead of in the browser.
      const state = reactive({
        rows: [] as typeof data,
        page: 1,
        pageSize: args.pageSize ?? 10,
        totalRows: 0,
        sort: null as { key: string, direction: 'asc' | 'desc' } | null,
        filter: '',
        isLoading: false,
      })

      async function fetchPage() {
        state.isLoading = true
        await new Promise((resolve) => setTimeout(resolve, 300))

        let rows = args.filterKey && state.filter
          ? data.filter((row) => String(row[args.filterKey as keyof typeof row]).toLocaleLowerCase().includes(state.filter.toLocaleLowerCase()))
          : [...data]

        if (state.sort) {
          const { key, direction } = state.sort
          rows = rows.sort((a, b) => {
            const result = String(a[key as keyof typeof a]).localeCompare(String(b[key as keyof typeof b]))
            return direction === 'asc' ? result : -result
          })
        }

        state.totalRows = rows.length
        const start = (state.page - 1) * state.pageSize
        state.rows = rows.slice(start, start + state.pageSize)
        state.isLoading = false
      }

      fetchPage()

      return {
        args,
        state,
        onPage: (page: number) => { state.page = page; fetchPage() },
        onPageSize: (pageSize: number) => { state.pageSize = pageSize; fetchPage() },
        onSort: (sort: typeof state.sort) => { state.sort = sort; fetchPage() },
        onFilter: (filter: string) => { state.filter = filter; fetchPage() },
      }
    },
    template: `
      <PrDataTable
        v-bind="args"
        :rows="state.rows"
        :total-rows="state.totalRows"
        :page="state.page"
        :page-size="state.pageSize"
        :sort="state.sort"
        :filter="state.filter"
        :loading="state.isLoading"
        @update:page="onPage"
        @update:page-size="onPageSize"
        @update:sort="onSort"
        @update:filter="onFilter"
      />
    `,
  }),
}

// A page size outside the offered options is added to them: the select shows it, not its placeholder.
// noinspection JSUnusedGlobalSymbols
export const PageSizeOutsideOptions: Story = {
  args: {
    pageSize: 25,
  },
  render: Default.render,
  play: async ({ canvasElement }) => {
    const select = within(canvasElement).getByRole('combobox', { name: 'Lignes par page' })
    await expect(select).toHaveTextContent('25')
    await expect(select).not.toHaveTextContent('Sélectionner')
  },
}
