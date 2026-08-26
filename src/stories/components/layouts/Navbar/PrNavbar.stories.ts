import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrButton, PrNavbar } from '../../../../index'
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
