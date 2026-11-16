import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { LogOut } from '@lucide/vue'
import { expect, within } from 'storybook/test'
import { PrButton, PrNavbar, PrNavigationMenu, PrThemeToggle } from '../../../../index'
import '../../navigation.stories.css'

const meta = {
  title: 'Navigation/Navbar',
  component: PrNavbar,
  tags: ['autodocs'],
  parameters: {
    prLayout: 'fullscreen',
  },
  args: {
    title: 'Navbar Title',
  },
  render: (args) => ({
    components: { PrNavbar },
    setup() {
      return { args }
    },
    template: '<div class="nav-story-navbar-frame"><PrNavbar v-bind="args" /></div>',
  }),
} satisfies Meta<typeof PrNavbar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithChildren: Story = {
  render: () => ({
    components: { PrButton, PrNavbar },
    template: `
      <div class="nav-story-navbar-frame">
        <PrNavbar title="Navbar Title">
          <PrButton>Button</PrButton>
        </PrNavbar>
      </div>
    `,
  }),
}

export const IconOnly: Story = {
  args: {
    title: 'Navbar Title',
    logoVariant: 'icon-only',
  },
}

export const WithDiagonalDivider: Story = {
  args: {
    title: 'Navbar Title',
    diagonalDivider: true,
  },
}

export const IconOnlyWithDiagonalDivider: Story = {
  args: {
    title: 'Navbar Title',
    logoVariant: 'icon-only',
    diagonalDivider: true,
  },
}

export const WithMobileLogo: Story = {
  args: {
    title: 'Navbar Title',
    logoSrc: '/oremis-logo.svg',
    mobileLogoSrc: '/oremis-icon.svg',
  },
}

export const ActionsVisibleOnMobile: Story = {
  render: () => ({
    components: { PrButton, PrNavbar },
    template: `
      <div class="nav-story-navbar-frame" style="width: 390px;">
        <PrNavbar title="Navbar Title">
          <PrButton size="sm">Action</PrButton>
          <template #user>
            <span class="nav-story-avatar" aria-hidden="true">AD</span>
          </template>
        </PrNavbar>
      </div>
    `,
  }),
}

export const HideActionsOnMobile: Story = {
  args: {
    title: 'Navbar Title',
    hideActionsOnMobile: true,
  },
  render: (args) => ({
    components: { PrButton, PrNavbar },
    setup() {
      return { args }
    },
    template: `
      <div class="nav-story-navbar-frame" style="width: 390px;">
        <PrNavbar v-bind="args">
          <PrButton size="sm">Action</PrButton>
        </PrNavbar>
      </div>
    `,
  }),
}

export const WithChildrenAndDiagonalDivider: Story = {
  render: () => ({
    components: { PrButton, PrNavbar },
    template: `
      <div class="nav-story-navbar-frame">
        <PrNavbar title="Navbar Title" diagonal-divider>
          <PrButton>Button</PrButton>
        </PrNavbar>
      </div>
    `,
  }),
}

// The header of a public site: a light rounded bar floating above the page, the color logo
// (white in the dark theme), the main navigation right after the brand.
export const Floating: Story = {
  render: () => ({
    components: { PrButton, PrNavbar, PrNavigationMenu, PrThemeToggle },
    setup() {
      const nav = [
        { label: 'Accueil', href: '#', active: true },
        { label: 'Comprendre', href: '#comprendre', active: false },
        { label: "Parler à quelqu'un", href: '#parler', active: false },
      ]
      return { nav, LogOut }
    },
    template: `
      <PrNavbar variant="floating" title="SOS Harcèlement" home-href="#">
        <template #nav>
          <PrNavigationMenu :items="nav" variant="subtle" aria-label="Navigation principale" />
        </template>
        <template #user>
          <PrButton variant="danger" size="sm" :icon="LogOut">Quitter vite</PrButton>
          <PrThemeToggle />
        </template>
      </PrNavbar>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvasElement.querySelector('.pr-navbar--floating')).not.toBeNull()
    await expect(canvas.getByRole('navigation', { name: 'Navigation principale' })).toBeTruthy()
    await expect(canvas.getByRole('link', { name: 'Accueil' }).getAttribute('aria-current')).toBe('page')
  },
}
