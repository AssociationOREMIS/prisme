import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { PrButton, PrNavbarMenu, PrNavigationMenu, PrThemeToggle } from '../../../../index'
import '../../navigation.stories.css'

const meta = {
  title: 'Navigation/NavbarMenu',
  component: PrNavbarMenu,
  tags: ['autodocs'],
  args: {
    side: 'right',
  },
} satisfies Meta<typeof PrNavbarMenu>

export default meta
type Story = StoryObj<typeof meta>

const nav = [
  { label: 'Accueil', href: '#', active: true },
  { label: 'Adhérer', href: '#adherer', active: false },
  { label: 'Nous contacter', href: '#contact', active: false },
]

// The menu of a phone, used by PrNavbar below 780 px, also usable on its own: a button that opens
// a side panel. The navigation inside goes vertical; following a link closes the panel.
export const Default: Story = {
  render: args => ({
    components: { PrButton, PrNavbarMenu, PrNavigationMenu, PrThemeToggle },
    setup: () => ({ args, nav }),
    template: `
      <PrNavbarMenu v-bind="args">
        <PrNavigationMenu :items="nav" variant="subtle" aria-label="Navigation principale" />
        <PrButton href="#benevole">Je deviens bénévole</PrButton>
      </PrNavbarMenu>
    `,
  }),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Menu' }))
    const dialog = await screen.findByRole('dialog', { name: 'Menu' })
    const navigation = within(dialog).getByRole('navigation', { name: 'Navigation principale' })
    await expect(navigation.classList.contains('pr-navigation-menu--vertical')).toBe(true)
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}
