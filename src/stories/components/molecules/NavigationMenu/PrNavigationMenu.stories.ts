import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrNavigationMenu } from '../../../../components/molecules/NavigationMenu'
import '../../../stories.css'

const items = [
  { label: 'Vue generale', href: '#overview', active: true },
  { label: 'Activite', href: '#activity' },
  { label: 'Parametres', href: '#settings' },
]

const meta = {
  title: 'Navigation/NavigationMenu',
  component: PrNavigationMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Une liste plate de liens de navigation avec detection d\'etat actif — pas le pattern reka-ui `NavigationMenu` complet (sous-menus imbriques ouverts par un declencheur). Pour un vrai flyout, voir `PrDropdownMenu` ; pour une navigation a deux niveaux, voir `PrSidebarItem`/`PrSidebarSubItem`.',
      },
    },
  },
  args: {
    items,
  },
} satisfies Meta<typeof PrNavigationMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
