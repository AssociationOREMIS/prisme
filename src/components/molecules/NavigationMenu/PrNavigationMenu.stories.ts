import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrNavigationMenu } from './'
import '../../stories.css'

const items = [
  { label: 'Vue generale', href: '#overview', active: true },
  { label: 'Activite', href: '#activity' },
  { label: 'Parametres', href: '#settings' },
]

const meta = {
  title: 'Navigation/NavigationMenu',
  component: PrNavigationMenu,
  tags: ['autodocs'],
  args: {
    items,
  },
} satisfies Meta<typeof PrNavigationMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
