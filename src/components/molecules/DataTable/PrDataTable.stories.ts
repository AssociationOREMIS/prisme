import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrDataTable } from './'
import '../../stories.css'

const columns = [
  { key: 'name', label: 'Nom', sortable: true },
  { key: 'status', label: 'Statut', sortable: true },
  { key: 'priority', label: 'Priorite' },
]

const rows = [
  { id: '1', name: 'Dossier Alpha', status: 'Actif', priority: 'Normale' },
  { id: '2', name: 'Dossier Bravo', status: 'En revue', priority: 'Haute' },
  { id: '3', name: 'Dossier Charlie', status: 'Archive', priority: 'Basse' },
]

const meta = {
  title: 'Data Display/DataTable',
  component: PrDataTable,
  tags: ['autodocs'],
  args: {
    columns,
    rows,
    selectable: true,
    pageSize: 2,
  },
} satisfies Meta<typeof PrDataTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
