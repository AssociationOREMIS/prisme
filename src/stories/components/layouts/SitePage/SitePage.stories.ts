import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { BookOpen, GitBranch, Rss, ShieldCheck, Wrench } from '@lucide/vue'
import { PrButton } from '../../../../components/atoms/Button'
import { PrStack } from '../../../../components/atoms/Stack'
import { PrBand } from '../../../../components/layouts/Band'
import { PrContainer } from '../../../../components/layouts/Container'
import { PrFooter } from '../../../../components/layouts/Footer'
import { PrHero } from '../../../../components/layouts/Hero'
import { PrPanel } from '../../../../components/layouts/Panel'
import { PrFeature } from '../../../../components/molecules/Feature'
import { PrLinkList } from '../../../../components/molecules/LinkList'
import { devopsNotes } from '../../molecules/LinkList/demoItems'
import { footerColumns, footerLegalLinks, footerSocials } from '../Footer/footerDemo'
import '../../../stories.css'

const meta = {
  title: 'Layout/Site public',
  tags: ['autodocs'],
  parameters: {
    prLayout: 'fullscreen',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const heading = 'margin: 0; font-family: var(--pr-font-heading); color: var(--pr-color-heading);'

// The public-site building blocks together: a full-width container, the hero, a highlighted band
// with an aside, a panel (feed and side column) and the footer.
export const DevOps: Story = {
  render: () => ({
    components: { PrBand, PrButton, PrContainer, PrFeature, PrFooter, PrHero, PrLinkList, PrPanel, PrStack },
    setup: () => ({
      BookOpen,
      GitBranch,
      Rss,
      ShieldCheck,
      Wrench,
      devopsNotes,
      footerColumns,
      footerLegalLinks,
      footerSocials,
    }),
    template: `
      <div>
        <PrContainer as="main" style="display: grid; gap: var(--pr-space-10); padding-bottom: var(--pr-space-12);">
          <PrHero title="OREMIS DevOps" description="Les notes de l'équipe qui construit les outils d'OREMIS.">
            <template #actions>
              <PrButton size="lg" :icon="Rss" href="#notes">Lire les notes</PrButton>
              <PrButton size="lg" variant="secondary" :icon="GitBranch" href="#projets">Voir les projets</PrButton>
            </template>
          </PrHero>

          <PrBand label="Notre démarche">
            <PrStack :gap="4">
              <h2 style="${heading}">Des outils au service des bénévoles</h2>
              <p style="margin: 0; max-width: 40rem;">
                L'équipe construit et entretient les outils numériques de l'association : l'espace bénévoles,
                la plateforme de formation et la ligne d'écoute. Chaque choix est guidé par la sécurité des
                données des élèves et par l'accessibilité.
              </p>
              <PrStack direction="horizontal" :gap="3" wrap>
                <PrButton href="#contribuer">Contribuer</PrButton>
                <PrButton variant="secondary" href="#contact">Nous écrire</PrButton>
              </PrStack>
            </PrStack>
            <template #aside>
              <PrStack :gap="3">
                <PrFeature :icon="ShieldCheck" title="Données protégées" description="Hébergées en France, sauvegardées chaque nuit." />
                <PrFeature :icon="Wrench" title="Outils libres" description="Le code est ouvert et documenté." />
                <PrFeature :icon="BookOpen" title="Tutoriels" description="Des guides illustrés pour chaque outil." />
              </PrStack>
            </template>
          </PrBand>

          <PrPanel aside-label="L'équipe">
            <PrStack :gap="5">
              <h2 id="notes" style="${heading}">Dernières notes</h2>
              <PrLinkList :items="devopsNotes" />
            </PrStack>
            <template #aside>
              <PrStack :gap="3">
                <h2 style="${heading} font-size: var(--pr-font-size-xl);">L'équipe</h2>
                <p style="margin: 0;">
                  Camille MARTIN coordonne l'infrastructure, Alex DURAND l'accessibilité et la formation
                  des bénévoles aux outils.
                </p>
                <PrButton variant="secondary" href="#equipe">Rencontrer l'équipe</PrButton>
              </PrStack>
            </template>
          </PrPanel>
        </PrContainer>

        <PrFooter
          site-name="OREMIS DevOps"
          home-href="#accueil"
          description="Les notes de l'équipe qui construit les outils d'OREMIS, association contre le harcèlement scolaire."
          :columns="footerColumns"
          :socials="footerSocials"
          :legal-links="footerLegalLinks"
        />
      </div>
    `,
  }),
}
