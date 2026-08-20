import type { Meta, StoryObj } from '@storybook/vue3-vite'
import {
  Bell,
  Building2,
  CalendarDays,
  FileText,
  FolderKanban,
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
  PrNavbar,
  PrSidebar,
  PrSidebarItem,
} from '../../../../index'
import '../../navigation.stories.css'

const meta = {
  title: 'Navigation/Sidebar',
  component: PrSidebar,
  tags: ['autodocs'],
  parameters: {
    prLayout: 'fullscreen',
  },
} satisfies Meta<typeof PrSidebar>

export default meta
type Story = StoryObj<typeof meta>

function createNavigationStorySetup(initialPath = '/') {
  const activePath = ref(initialPath)

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
    Building2,
    CalendarDays,
    FileText,
    FolderKanban,
    GraduationCap,
    House,
    Settings,
    Shield,
    ShieldCheck,
    SlidersHorizontal,
    Users,
    handleStoryNavigation,
    isActive,
  }
}

function shellStory(sidebar: string, content = defaultContent(), initialPath = '/') {
  return {
    components: {
      PrAppShell,
      PrBadge,
      PrButton,
      PrCard,
      PrNavbar,
      PrSidebar,
      PrSidebarItem,
    },
    setup() {
      return createNavigationStorySetup(initialPath)
    },
    template: `
      <div class="nav-story-shell" @click.capture="handleStoryNavigation">
        <PrAppShell>
          <template #navbar><PrNavbar brand-label="OREMIS" /></template>
          <template #sidebar>${sidebar}</template>
          ${content}
        </PrAppShell>
      </div>
    `,
  }
}

function defaultContent() {
  return `
    <div class="nav-story-content">
      <h1 class="nav-story-title">Contenu applicatif</h1>
      <p class="nav-story-muted">La sidebar garde uniquement des entrées de navigation.</p>
    </div>
  `
}

const defaultSidebar = `
  <PrSidebar>
    <PrSidebarItem :icon="House" label="Tableau de bord" href="/" :active="isActive('/')" />
    <PrSidebarItem :icon="Users" label="Membres" href="/members" :active="isActive('/members')" />
    <PrSidebarItem :icon="CalendarDays" label="Evénements" href="/events" :active="isActive('/events')" />
  </PrSidebar>
`

const describedSidebar = `
  <PrSidebar>
    <PrSidebarItem
      :icon="House"
      label="Tableau de bord"
      description="Vue générale de l'application"
      href="/"
      :active="isActive('/')"
    />
    <PrSidebarItem
      :icon="Users"
      label="Membres"
      description="Profils, qualifications et statuts"
      href="/members"
      :active="isActive('/members')"
    />
    <PrSidebarItem
      :icon="CalendarDays"
      label="Evénements"
      description="Sessions, présences et inscriptions"
      href="/events"
      :active="isActive('/events')"
    />
  </PrSidebar>
`

export const Default: Story = {
  render: () => shellStory(defaultSidebar),
}

export const WithDescriptions: Story = {
  render: () => shellStory(describedSidebar),
}

export const WithSubmenu: Story = {
  render: () => shellStory(`
    <PrSidebar>
      <PrSidebarItem :icon="House" label="Tableau de bord" description="Vue générale" href="/" :active="isActive('/')" />
      <PrSidebarItem :icon="Users" label="Membres" description="Profils et statuts" href="/members" :active="isActive('/members')" />
      <PrSidebarItem :icon="Shield" label="Utilisateurs" description="Comptes et permissions" href="/admin/users" :active="isActive('/admin/users')" />
      <PrSidebarItem
        :icon="Settings"
        label="Paramètres"
        description="Configuration"
        default-expanded
      >
        <PrSidebarItem
          :icon="SlidersHorizontal"
          label="Général"
          description="Configuration générale"
          href="/settings/general"
          :active="isActive('/settings/general')"
        />
        <PrSidebarItem
          :icon="ShieldCheck"
          label="Sécurité"
          description="Accès et authentification"
          href="/settings/security"
          :active="isActive('/settings/security')"
        />
        <PrSidebarItem
          :icon="Bell"
          label="Notifications"
          description="Préférences de notifications"
          href="/settings/notifications"
          :active="isActive('/settings/notifications')"
        />
      </PrSidebarItem>
    </PrSidebar>
  `, defaultContent(), '/settings/security'),
}

export const ActiveStates: Story = {
  render: () => shellStory(`
    <PrSidebar>
      <PrSidebarItem :icon="House" label="Tableau de bord" description="Vue générale" href="/" :active="isActive('/')" />
      <PrSidebarItem :icon="Users" label="Membres" description="Gestion des membres" href="/members" :active="isActive('/members')" />
      <PrSidebarItem :icon="CalendarDays" label="Evénements" description="Sessions à venir" href="/events" :active="isActive('/events')" />
      <PrSidebarItem :icon="Settings" label="Paramètres" description="Configuration" default-expanded>
        <PrSidebarItem :icon="SlidersHorizontal" label="Général" description="Configuration générale" href="/settings/general" :active="isActive('/settings/general')" />
        <PrSidebarItem :icon="ShieldCheck" label="Sécurité" description="Accès et authentification" href="/settings/security" :active="isActive('/settings/security')" />
      </PrSidebarItem>
    </PrSidebar>
  `, defaultContent(), '/members'),
}

export const Collapsed: Story = {
  render: () => ({
    components: {
      PrAppShell,
      PrNavbar,
      PrSidebar,
      PrSidebarItem,
    },
    setup() {
      return createNavigationStorySetup('/')
    },
    template: `
      <div class="nav-story-shell" @click.capture="handleStoryNavigation">
        <PrAppShell default-collapsed>
          <template #navbar><PrNavbar brand-label="OREMIS" /></template>
          <template #sidebar>
            <PrSidebar>
              <PrSidebarItem :icon="House" label="Tableau de bord" description="Vue générale" href="/" :active="isActive('/')" />
              <PrSidebarItem :icon="Users" label="Membres" description="Gestion des membres" href="/members" :active="isActive('/members')" />
              <PrSidebarItem :icon="CalendarDays" label="Evénements" description="Planning" href="/events" :active="isActive('/events')" />
              <PrSidebarItem :icon="Shield" label="Utilisateurs" description="Comptes et permissions" href="/admin/users" :active="isActive('/admin/users')" />
              <PrSidebarItem :icon="Settings" label="Paramètres" description="Configuration" default-expanded>
                <PrSidebarItem :icon="SlidersHorizontal" label="Général" description="Configuration générale" href="/settings/general" :active="isActive('/settings/general')" />
              </PrSidebarItem>
            </PrSidebar>
          </template>
          ${defaultContent()}
        </PrAppShell>
      </div>
    `,
  }),
}

export const CompleteExample: Story = {
  name: 'Complete example',
  render: () => shellStory(`
    <PrSidebar>
      <PrSidebarItem :icon="House" label="Tableau de bord" description="Vue générale de l'application" href="/" :active="isActive('/')" />
      <PrSidebarItem :icon="Users" label="Membres" description="Profils, qualifications et statuts" href="/members" :active="isActive('/members')" />
      <PrSidebarItem :icon="CalendarDays" label="Evénements" description="Sessions, présences et inscriptions" href="/events" :active="isActive('/events')" />
      <PrSidebarItem :icon="GraduationCap" label="Formations" description="Parcours et validations" href="/training" :active="isActive('/training')" />
      <PrSidebarItem :icon="FileText" label="Documents" description="Référentiel documentaire" href="/documents" :active="isActive('/documents')" />
      <PrSidebarItem :icon="Shield" label="Utilisateurs" description="Comptes et permissions" href="/admin/users" :active="isActive('/admin/users')" />
      <PrSidebarItem :icon="Building2" label="Organisation" description="Entités et responsabilités" href="/organization" :active="isActive('/organization')" />
      <PrSidebarItem :icon="Settings" label="Paramètres" description="Configuration" default-expanded>
        <PrSidebarItem :icon="SlidersHorizontal" label="Général" description="Configuration générale" href="/settings/general" :active="isActive('/settings/general')" />
        <PrSidebarItem :icon="ShieldCheck" label="Sécurité" description="Accès et authentification" href="/settings/security" :active="isActive('/settings/security')" />
        <PrSidebarItem :icon="Bell" label="Notifications" description="Préférences de notifications" href="/settings/notifications" :active="isActive('/settings/notifications')" />
      </PrSidebarItem>

      <template #footer>
        <PrSidebarItem :icon="FolderKanban" label="Projet Prisme" description="Version 0.1.0" href="/prisme" :active="isActive('/prisme')" />
      </template>
    </PrSidebar>
  `,
  `
    <div class="nav-story-content">
      <header class="nav-story-header">
        <div>
          <h1 class="nav-story-title">Tableau de bord</h1>
          <p class="nav-story-muted">Vue opérationnelle d'une application OREMIS.</p>
        </div>
        <PrBadge variant="success">En ligne</PrBadge>
      </header>

      <div class="nav-story-grid">
        <PrCard class="nav-story-card">
          <span class="nav-story-muted">Membres actifs</span>
          <strong>1 284</strong>
        </PrCard>
        <PrCard class="nav-story-card">
          <span class="nav-story-muted">Evénements ouverts</span>
          <strong>42</strong>
        </PrCard>
        <PrCard class="nav-story-card">
          <span class="nav-story-muted">Formations</span>
          <strong>18</strong>
        </PrCard>
      </div>

      <PrCard>
        <div class="story-card-content">
          <h3>Activité récente</h3>
          <p>Cette composition sert de référence visuelle pour ajuster le shell Prisme.</p>
          <PrButton size="sm">Voir le détail</PrButton>
        </div>
      </PrCard>
    </div>
  `),
}
