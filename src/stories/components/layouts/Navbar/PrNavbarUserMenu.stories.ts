import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { History, LogOut, MapPin } from '@lucide/vue'
import { PrNavbar, PrNavbarUserMenu } from '../../../../index'
import '../../navigation.stories.css'

const meta = {
  title: 'Navigation/NavbarUserMenu',
  component: PrNavbarUserMenu,
  tags: ['autodocs'],
  parameters: {
    prLayout: 'fullscreen',
  },
  args: {
    name: 'Jean Dupont',
    identifier: 'CIB1234',
    email: 'jean.dupont@oremis.fr',
    roles: ['Bénévole', 'Coordinateur'],
  },
} satisfies Meta<typeof PrNavbarUserMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { History, LogOut, PrNavbar, PrNavbarUserMenu },
    setup() {
      return { args }
    },
    template: `
      <div class="nav-story-navbar-frame">
        <PrNavbar brand-label="OREMIS">
          <template #user>
            <PrNavbarUserMenu v-bind="args">
              <template #default="{ item, separator, itemClass, dangerItemClass, separatorClass }">
                <component :is="item" :class="itemClass">
                  <History :size="16" aria-hidden="true" />
                  Mes demandes
                </component>
                <component :is="separator" :class="separatorClass" />
                <component :is="item" :class="dangerItemClass">
                  <LogOut :size="16" aria-hidden="true" />
                  Déconnexion
                </component>
              </template>
            </PrNavbarUserMenu>
          </template>
        </PrNavbar>
      </div>
    `,
  }),
}

export const WithExtraItem: Story = {
  render: (args) => ({
    components: { History, LogOut, MapPin, PrNavbar, PrNavbarUserMenu },
    setup() {
      return { args }
    },
    template: `
      <div class="nav-story-navbar-frame">
        <PrNavbar brand-label="OREMIS">
          <template #user>
            <PrNavbarUserMenu v-bind="args">
              <template #default="{ item, separator, itemClass, dangerItemClass, separatorClass }">
                <component :is="item" :class="itemClass">
                  <MapPin :size="16" aria-hidden="true" />
                  Mes villes
                </component>
                <component :is="item" :class="itemClass">
                  <History :size="16" aria-hidden="true" />
                  Mes demandes
                </component>
                <component :is="separator" :class="separatorClass" />
                <component :is="item" :class="dangerItemClass">
                  <LogOut :size="16" aria-hidden="true" />
                  Déconnexion
                </component>
              </template>
            </PrNavbarUserMenu>
          </template>
        </PrNavbar>
      </div>
    `,
  }),
}

export const WithoutIdentifier: Story = {
  args: {
    identifier: undefined,
    roles: [],
  },
  render: (args) => ({
    components: { History, LogOut, PrNavbar, PrNavbarUserMenu },
    setup() {
      return { args }
    },
    template: `
      <div class="nav-story-navbar-frame">
        <PrNavbar brand-label="OREMIS">
          <template #user>
            <PrNavbarUserMenu v-bind="args">
              <template #default="{ item, dangerItemClass }">
                <component :is="item" :class="dangerItemClass">
                  <LogOut :size="16" aria-hidden="true" />
                  Déconnexion
                </component>
              </template>
            </PrNavbarUserMenu>
          </template>
        </PrNavbar>
      </div>
    `,
  }),
}
