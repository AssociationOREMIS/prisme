import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrTable } from './'
import '../../stories.css'

const meta = {
  title: 'Data Display/Table',
  component: PrTable,
  tags: ['autodocs'],
  args: {
    caption: 'Dossiers recents',
  },
} satisfies Meta<typeof PrTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrTable },
    setup() {
      return { args }
    },
    template: `
      <PrTable v-bind="args">
        <thead><tr><th>Nom</th><th>Statut</th><th>Priorite</th></tr></thead>
        <tbody>
          <tr><td>Dossier A</td><td>Actif</td><td>Normale</td></tr>
          <tr><td>Dossier B</td><td>En revue</td><td>Haute</td></tr>
        </tbody>
      </PrTable>
    `,
  }),
}
