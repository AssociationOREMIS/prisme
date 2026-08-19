<script setup lang="ts">
import {
  CalendarDays,
  Bell,
  GraduationCap,
  House,
  Settings,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  Users,
} from '@lucide/vue'
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
} from './index'
</script>

<template>
  <PrAppShell>
    <template #navbar>
      <PrNavbar>
        <template #brand>
          <span class="playground__brand-mark" aria-hidden="true">O</span>
          <span class="playground__brand-text">OREMIS Prisme</span>
        </template>

        <template #actions>
          <PrButton variant="ghost" size="sm">Aide</PrButton>
          <PrButton variant="secondary" size="sm">Nouveau</PrButton>
          <PrThemeToggle />
        </template>

        <template #user>
          <span class="playground__avatar" aria-hidden="true">LM</span>
        </template>
      </PrNavbar>
    </template>

    <template #sidebar>
      <PrSidebar>
        <PrSidebarItem
          :icon="House"
          label="Tableau de bord"
          description="Vue générale"
          href="/"
          active
        />
        <PrSidebarItem
          :icon="Users"
          label="Membres"
          description="Gestion des membres"
          href="/members"
        />
        <PrSidebarItem
          :icon="CalendarDays"
          label="Evenements"
          description="Planning et inscriptions"
          href="/events"
        />
        <PrSidebarItem
          :icon="GraduationCap"
          label="Formations"
          description="Parcours et validations"
          href="/training"
        />

        <PrSidebarItem
          :icon="Shield"
          label="Utilisateurs"
          description="Comptes et permissions"
          href="/admin/users"
        />

        <PrSidebarItem
          :icon="Settings"
          label="Parametres"
          description="Configuration"
          default-expanded
        >
          <PrSidebarItem
            :icon="SlidersHorizontal"
            label="General"
            description="Configuration generale"
            href="/settings/general"
          />
          <PrSidebarItem
            :icon="ShieldCheck"
            label="Securite"
            description="Acces et authentification"
            href="/settings/security"
          />
          <PrSidebarItem
            :icon="Bell"
            label="Notifications"
            description="Preferences de notifications"
            href="/settings/notifications"
          />
        </PrSidebarItem>
      </PrSidebar>
    </template>

    <div class="playground">
      <header class="playground__header">
        <div>
          <p class="playground__eyebrow">Tableau de bord</p>
          <h1 class="playground__title">Vue d'ensemble</h1>
        </div>
        <PrBadge variant="success">Operationnel</PrBadge>
      </header>

      <section class="playground__grid">
        <PrCard>
          <h2 class="playground__card-title">Recherche rapide</h2>
          <div class="playground__form">
            <PrInput label="Membre" placeholder="Nom, identifiant ou e-mail" />
            <PrButton>Rechercher</PrButton>
          </div>
        </PrCard>

        <PrCard>
          <h2 class="playground__card-title">Activite</h2>
          <p class="playground__description">
            Shell applicatif Prisme avec navbar fixe, sidebar retractable et contenu
            fluide.
          </p>
        </PrCard>
      </section>
    </div>
  </PrAppShell>
</template>
