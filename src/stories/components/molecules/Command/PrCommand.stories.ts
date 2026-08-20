import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrCommand } from '../../../../components/molecules/Command'
import '../../../stories.css'

const items = [
  { label: 'Creer un dossier', value: 'create', description: 'Nouvelle entree operationnelle' },
  { label: 'Importer', value: 'import', description: 'Ajouter depuis un fichier' },
  { label: 'Exporter', value: 'export', description: 'Telecharger les donnees' },
]

const meta = {
  title: 'Actions/Command',
  component: PrCommand,
  tags: ['autodocs'],
  args: {
    items,
    placeholder: 'Rechercher une action',
  },
} satisfies Meta<typeof PrCommand>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
