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
import { PrCard } from '../../../../components/atoms/Card'
import { PrGrid } from '../../../../components/atoms/Grid'
import { PrImage } from '../../../../components/atoms/Image'
import { PrReveal } from '../../../../components/atoms/Reveal'
import { PrTypography } from '../../../../components/atoms/Typography'
import { PrSection } from '../../../../components/layouts/Section'
import { PrSplit } from '../../../../components/layouts/Split'
import { PrEmbed } from '../../../../components/molecules/Embed'
import { SiteFrame, site } from './siteDemo'
import '../../../stories.css'

const meta = {
  title: 'Modèles/Site public',
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

// The home page of a public site, built only from Prisme components: the hero on an image under
// the floating bar, its call to action; text and illustration sections sliding in as they scroll
// into view; cards on an image in parallax; the footer lined up on the sections. Every block
// shrinks to one column on a phone, where the bar keeps one line and opens a menu.
export const Accueil: Story = {
  render: () => ({
    components: { PrButton, PrCard, PrGrid, PrHero, PrImage, PrReveal, PrSection, PrSplit, PrStack, PrTypography, SiteFrame },
    setup: () => ({ site }),
    template: `
      <SiteFrame page="accueil">
        <PrHero
          title="Ensemble, construisons l'avenir"
          description="Agissez pour un monde inclusif et sécurisant pour tous. Votre adhésion soutient nos actions d'éducation, de prévention et d'accompagnement."
          :background="site.fond"
          parallax
          under-navbar
          align="center"
        >
          <template #actions>
            <PrButton variant="cta" size="lg" href="#adherer" pulse>Adhérer à OREMIS</PrButton>
          </template>
          <PrTypography variant="small">
            66 % de la cotisation est déductible de l'impôt : une adhésion de 15 € revient à 5,10 €.
          </PrTypography>
        </PrHero>

        <PrSection label="Qu'est-ce que l'adhésion ?">
          <PrSplit>
            <PrStack :gap="4">
              <PrTypography variant="h2">Qu'est-ce que l'adhésion ?</PrTypography>
              <PrTypography>
                Adhérer, c'est bien plus qu'un geste symbolique : vous rejoignez l'assemblée générale,
                l'organe souverain de l'association, où chaque voix compte.
              </PrTypography>
              <PrStack as="ul" :gap="2" style="margin: 0; padding-left: 1.25rem;">
                <li v-for="point in site.points" :key="point.title"><strong>{{ point.title }} :</strong> {{ point.text }}</li>
              </PrStack>
            </PrStack>
            <template #media>
              <PrReveal effect="fade-left">
                <PrImage :src="site.membre" alt="" :width="1000" :height="1000" max-width="22rem" align="center" />
              </PrReveal>
            </template>
          </PrSplit>
        </PrSection>

        <PrSection tone="subtle" label="Conçu pour tout le monde">
          <PrSplit reverse>
            <PrStack :gap="4">
              <PrTypography variant="h2">Conçu pour tout le monde</PrTypography>
              <PrTypography>
                Peu importe votre statut ou votre lieu de résidence : l'organisation est 100 % en ligne et
                l'assemblée générale se déroule à distance. Chacun peut être entendu, sans contrainte de distance.
              </PrTypography>
            </PrStack>
            <template #media>
              <PrReveal effect="fade-right">
                <PrImage :src="site.enLigne" alt="" :width="1000" :height="1000" max-width="22rem" align="center" />
              </PrReveal>
            </template>
          </PrSplit>
        </PrSection>

        <PrSection :background="site.fond" parallax spacing="lg" label="Ce que vous soutenez">
          <PrGrid min="18rem" :gap="6">
            <PrReveal v-for="(mission, index) in site.missions" :key="mission.title" :delay="index * 150">
              <PrCard style="height: 100%;">
                <PrStack :gap="3">
                  <PrImage v-if="mission.image" :src="mission.image" alt="" :width="1000" :height="1000" max-width="8rem" align="center" />
                  <PrTypography variant="h4" as="h2">{{ mission.title }}</PrTypography>
                  <PrTypography variant="subtle">{{ mission.text }}</PrTypography>
                </PrStack>
              </PrCard>
            </PrReveal>
          </PrGrid>
        </PrSection>
      </SiteFrame>
    `,
  }),
}

// A page holding a third-party form (here a payment platform): the form on the image under the
// bar, asking first before loading the service.
export const PageFormulaire: Story = {
  name: 'Page formulaire',
  render: () => ({
    components: { PrEmbed, PrHero, PrSection, PrStack, PrTypography, SiteFrame },
    setup: () => ({ site }),
    template: `
      <SiteFrame page="adherer">
        <PrSection :background="site.fond" parallax under-navbar width="wide" label="Adhérer à OREMIS">
          <PrStack :gap="6">
            <PrTypography variant="h1">Adhérer à OREMIS</PrTypography>
            <PrEmbed
              src="about:blank"
              title="Formulaire d'adhésion OREMIS"
              provider="HelloAsso"
              consent
              height="44rem"
            />
          </PrStack>
        </PrSection>
      </SiteFrame>
    `,
  }),
}
