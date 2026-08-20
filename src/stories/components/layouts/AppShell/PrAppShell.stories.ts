import type { Meta, StoryObj } from '@storybook/vue3-vite'
import {
  Bell,
  CalendarDays,
  GraduationCap,
  House,
  Settings,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  Users,
} from '@lucide/vue'
import { ref } from 'vue'
import {
  PrAppShell,
  PrBadge,
  PrButton,
  PrCard,
  PrInput,
  PrNavbar,
  PrSidebar,
  PrSidebarItem,
  PrThemeToggle,
  usePrTheme,
} from '../../../../index'
import '../../navigation.stories.css'

const meta = {
  title: 'Layout/AppShell',
  component: PrAppShell,
  tags: ['autodocs'],
  parameters: {
    prLayout: 'fullscreen',
  },
} satisfies Meta<typeof PrAppShell>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: {
      Bell,
      PrAppShell,
      PrBadge,
      PrButton,
      PrCard,
      PrInput,
      PrNavbar,
      PrSidebar,
      PrSidebarItem,
      PrThemeToggle,
    },
    setup() {
      const activePath = ref('/')
      const { resolvedTheme } = usePrTheme()

      function isActive(path: string) {
        return activePath.value === path
      }

      function handleStoryNavigation(event: MouseEvent) {
        const target = event.target as Element | null
        const link = target?.closest('a[href]')
        const href = link?.getAttribute('href')

        if (!href?.startsWith('/')) {
          return
        }

        event.preventDefault()
        activePath.value = href
      }

      return {
        activePath,
        Bell,
        CalendarDays,
        GraduationCap,
        House,
        Settings,
        Shield,
        ShieldCheck,
        SlidersHorizontal,
        Users,
        handleStoryNavigation,
        isActive,
        resolvedTheme,
      }
    },
    template: `
      <div class="nav-story-shell" :data-pr-theme="resolvedTheme" @click.capture="handleStoryNavigation">
        <PrAppShell>
          <template #navbar>
            <PrNavbar>
              <template #actions>
                <PrThemeToggle />
              </template>
              <template #user>
                <span class="nav-story-avatar" aria-hidden="true">AD</span>
              </template>
            </PrNavbar>
          </template>

          <template #sidebar>
            <PrSidebar>
              <PrSidebarItem :icon="House" label="Tableau de bord" href="/" :active="isActive('/')" />
              <PrSidebarItem :icon="Users" label="Membres" href="/members" :active="isActive('/members')" />
              <PrSidebarItem :icon="CalendarDays" label="Evénements" href="/events" :active="isActive('/events')" />
              <PrSidebarItem :icon="GraduationCap" label="Formations" href="/training" :active="isActive('/training')" />

              <PrSidebarItem :icon="Shield" label="Utilisateurs" href="/admin/users" :active="isActive('/admin/users')" />
              <PrSidebarItem :icon="Settings" label="Paramètres" description="Configuration" default-expanded>
                <PrSidebarItem :icon="SlidersHorizontal" label="Général" description="Configuration générale" href="/settings/general" :active="isActive('/settings/general')" />
                <PrSidebarItem :icon="ShieldCheck" label="Sécurité" description="Accès et authentification" href="/settings/security" :active="isActive('/settings/security')" />
                <PrSidebarItem :icon="Bell" label="Notifications" description="Préférences de notifications" href="/settings/notifications" :active="isActive('/settings/notifications')" />
              </PrSidebarItem>
            </PrSidebar>
          </template>

          <div class="nav-story-content">
            <header class="nav-story-header">
              <div>
                <h1 class="nav-story-title">Tableau de bord</h1>
                <p class="nav-story-muted">Synthèse des opérations OREMIS.</p>
              </div>
              <PrBadge variant="success">Synchronisé</PrBadge>
            </header>

            <div class="nav-story-grid">
              <PrCard class="nav-story-card">
                <span class="nav-story-muted">Membres actifs</span>
                <strong>1 284</strong>
              </PrCard>
              <PrCard class="nav-story-card">
                <span class="nav-story-muted">Evénements</span>
                <strong>42</strong>
              </PrCard>
              <PrCard class="nav-story-card">
                <span class="nav-story-muted">Formations</span>
                <strong>18</strong>
              </PrCard>
            </div>

            <PrCard>
              <PrInput label="Recherche" placeholder="Nom, identifiant ou e-mail" />
            </PrCard>
          </div>
        </PrAppShell>
      </div>
    `,
  }),
}
