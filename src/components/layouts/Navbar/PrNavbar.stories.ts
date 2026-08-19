import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Bell } from '@lucide/vue'
import { PrButton, PrNavbar, PrThemeToggle } from '../../../index'
import '../navigation.stories.css'

const meta = {
  title: 'Prisme/Navigation/Navbar',
  component: PrNavbar,
  tags: ['autodocs'],
  args: {
    brandLabel: 'OREMIS',
  },
} satisfies Meta<typeof PrNavbar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrNavbar },
    setup() {
      return { args }
    },
    template: '<div style="height: var(--pr-navbar-height)"><PrNavbar v-bind="args" /></div>',
  }),
}

export const WithSlots: Story = {
  render: () => ({
    components: { Bell, PrButton, PrNavbar, PrThemeToggle },
    template: `
      <div style="height: var(--pr-navbar-height)">
        <PrNavbar>
          <template #brand>
            <span class="nav-story-brand" aria-hidden="true">O</span>
            <span class="nav-story-brand-text">OREMIS Admin</span>
          </template>
          <template #actions>
            <PrButton variant="ghost" size="sm"><Bell :size="16" aria-hidden="true" /> Alertes</PrButton>
            <PrButton variant="secondary" size="sm">Créer</PrButton>
            <PrThemeToggle />
          </template>
          <template #user>
            <span class="nav-story-avatar" aria-hidden="true">LM</span>
          </template>
        </PrNavbar>
      </div>
    `,
  }),
}
