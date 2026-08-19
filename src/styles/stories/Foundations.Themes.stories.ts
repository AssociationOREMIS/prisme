import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Bell, CheckCircle2, Moon, Sun } from '@lucide/vue'
import {
  PrBadge,
  PrButton,
  PrCard,
  PrInput,
  PrThemeToggle,
} from '../../index'
import './foundations.css'

const themeTokens = [
  ['Background', '--pr-color-background'],
  ['Surface', '--pr-color-surface'],
  ['Surface subtle', '--pr-color-surface-subtle'],
  ['Border', '--pr-color-border'],
  ['Text', '--pr-color-text'],
  ['Text muted', '--pr-color-text-muted'],
  ['Primary', '--pr-color-primary'],
  ['Success', '--pr-color-success'],
  ['Warning', '--pr-color-warning'],
  ['Danger', '--pr-color-danger'],
  ['Info', '--pr-color-info'],
]

const meta = {
  title: 'Prisme/Foundations/Themes',
  tags: ['autodocs'],
  render: () => ({
    components: {
      Bell,
      CheckCircle2,
      Moon,
      PrBadge,
      PrButton,
      PrCard,
      PrInput,
      PrThemeToggle,
      Sun,
      ThemeSample,
    },
    setup() {
      return { themeTokens }
    },
    template: `
      <div class="foundation-page">
        <div>
          <h1>Themes</h1>
          <p>Comparaison des tokens semantiques et composants en light et dark.</p>
        </div>

        <div class="foundation-theme-grid">
          <section class="foundation-theme-panel" data-pr-theme="light">
            <header class="foundation-theme-header">
              <Sun :size="18" aria-hidden="true" />
              <div>
                <h2>Light</h2>
                <p>Theme clair par defaut pour les interfaces OREMIS.</p>
              </div>
            </header>

            <div class="foundation-theme-swatches">
              <article v-for="token in themeTokens" :key="'light-' + token[1]" class="foundation-token">
                <div class="foundation-swatch" :style="{ background: 'var(' + token[1] + ')' }" />
                <div class="foundation-token__body">
                  <span class="foundation-token__name">{{ token[0] }}</span>
                  <span class="foundation-token__meta">{{ token[1] }}</span>
                </div>
              </article>
            </div>

            <ThemeSample />
          </section>

          <section class="foundation-theme-panel" data-pr-theme="dark">
            <header class="foundation-theme-header">
              <Moon :size="18" aria-hidden="true" />
              <div>
                <h2>Dark</h2>
                <p>Fonds bleutes, surfaces separees et contrastes lisibles.</p>
              </div>
            </header>

            <div class="foundation-theme-swatches">
              <article v-for="token in themeTokens" :key="'dark-' + token[1]" class="foundation-token">
                <div class="foundation-swatch" :style="{ background: 'var(' + token[1] + ')' }" />
                <div class="foundation-token__body">
                  <span class="foundation-token__name">{{ token[0] }}</span>
                  <span class="foundation-token__meta">{{ token[1] }}</span>
                </div>
              </article>
            </div>

            <ThemeSample />
          </section>
        </div>
      </div>
    `,
  }),
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const ThemeSample = {
  components: {
    Bell,
    CheckCircle2,
    PrBadge,
    PrButton,
    PrCard,
    PrInput,
    PrThemeToggle,
  },
  template: `
    <div class="foundation-theme-sample">
      <div class="foundation-theme-actions">
        <PrButton size="sm">Enregistrer</PrButton>
        <PrButton variant="secondary" size="sm">Annuler</PrButton>
        <PrButton variant="ghost" size="sm"><Bell :size="16" aria-hidden="true" /> Alertes</PrButton>
      </div>

      <PrCard>
        <div class="story-card-content">
          <div class="foundation-theme-badges">
            <PrBadge variant="success">Actif</PrBadge>
            <PrBadge variant="warning">Attention</PrBadge>
            <PrBadge variant="danger">Erreur</PrBadge>
            <PrBadge variant="info">Info</PrBadge>
          </div>
          <h3>Surface applicative</h3>
          <p>Les composants consomment uniquement les tokens semantiques Prisme.</p>
          <PrInput label="Recherche" placeholder="Nom, identifiant ou e-mail" />
        </div>
      </PrCard>

      <div class="foundation-theme-row">
        <CheckCircle2 :size="18" aria-hidden="true" />
        <span>Theme toggle compact</span>
        <PrThemeToggle />
      </div>
    </div>
  `,
}

export const Themes: Story = {}
