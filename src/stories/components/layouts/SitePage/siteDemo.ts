import { defineComponent } from 'vue'
import { HandHeart, School, ShieldCheck, Vote } from '@lucide/vue'
import { PrButton } from '../../../../components/atoms/Button'
import { PrNavbar } from '../../../../components/layouts/Navbar'
import { PrFooter } from '../../../../components/layouts/Footer'
import { PrNavigationMenu } from '../../../../components/molecules/NavigationMenu'
import { PrThemeToggle } from '../../../../components/molecules/ThemeToggle'
import { usePrTheme } from '../../../../composables/usePrTheme'
import { PrIconFacebook, PrIconInstagram, PrIconLinkedin } from '../../../../icons/brand'
import fond from '../../../assets/site-public/fond-vagues.svg'
import bullying from '../../../assets/site-public/bullying.svg'
import inclusivity from '../../../assets/site-public/inclusivity.svg'
import membre from '../../../assets/site-public/membre_obnl.svg'
import enLigne from '../../../assets/site-public/online_obnl.svg'

/** Demo content of the public site model: a membership site of the association. */
export const site = {
  fond,
  membre,
  enLigne,
  missions: [
    { image: bullying, icon: ShieldCheck, title: 'Lutter contre le harcèlement', text: "Physique, verbal ou en ligne : prévention et sensibilisation pour protéger les élèves." },
    { image: inclusivity, icon: School, title: 'Promouvoir une école inclusive', text: "Chaque élève, quelles que soient ses particularités, doit trouver sa place à l'école." },
    { image: undefined, icon: Vote, title: "Participer à l'assemblée générale", text: "Prenez part aux orientations de l'association et à son avenir." },
  ],
  points: [
    { title: 'Participer aux décisions majeures', text: "votre voix compte lors de l'assemblée générale." },
    { title: 'Soutenir des actions concrètes', text: 'des solutions durables contre le harcèlement scolaire.' },
    { title: 'Accéder à des moments réservés', text: 'événements, formations et échanges entre adhérents.' },
  ],
  HandHeart,
}

const nav = (page: 'accueil' | 'adherer') => [
  { label: 'Accueil', href: '#accueil', active: page === 'accueil' },
  { label: 'Adhérer', href: '#adherer', active: page === 'adherer' },
  { label: 'Nous contacter', href: '#contact', active: false },
]

/**
 * The frame of every page of the model: the charte brand theme (it follows the light or dark
 * theme), the floating bar with its mobile menu, the page, and the footer lined up on the sections.
 */
export const SiteFrame = defineComponent({
  components: { PrButton, PrFooter, PrNavbar, PrNavigationMenu, PrThemeToggle },
  props: { page: { type: String as () => 'accueil' | 'adherer', required: true } },
  setup(props) {
    const { resolvedTheme } = usePrTheme()
    return {
      resolvedTheme,
      items: nav(props.page),
      columns: [
        { title: 'Adhésion', links: [{ label: 'Accueil', href: '#accueil' }, { label: 'Adhérer', href: '#adherer' }, { label: 'Je deviens bénévole', href: '#benevole' }] },
        { title: 'Contact', links: [{ label: 'Nous écrire', href: '#contact' }, { label: "Le site de l'association", href: '#oremis' }] },
      ],
      socials: [
        { label: 'Facebook', href: '#facebook', icon: PrIconFacebook },
        { label: 'Instagram', href: '#instagram', icon: PrIconInstagram },
        { label: 'LinkedIn', href: '#linkedin', icon: PrIconLinkedin },
      ],
      legal: [
        { label: 'Mentions légales', href: '#mentions-legales' },
        { label: 'Données personnelles', href: '#donnees' },
        { label: 'Accessibilité : partiellement conforme', href: '#accessibilite' },
      ],
    }
  },
  template: `
    <div data-pr-brand="charte" :data-pr-theme="resolvedTheme" style="background: var(--pr-color-background); color: var(--pr-color-text);">
      <a class="pr-skip-link" href="#contenu">Aller au contenu</a>
      <PrNavbar variant="floating" title="Adhésion" home-href="#accueil" width="wide">
        <template #nav>
          <PrNavigationMenu :items="items" variant="subtle" aria-label="Navigation principale" />
        </template>
        <template #actions>
          <PrButton variant="ghost" href="#benevole">Je deviens bénévole</PrButton>
        </template>
        <template #user>
          <PrThemeToggle />
        </template>
      </PrNavbar>
      <main id="contenu" tabindex="-1">
        <slot />
      </main>
      <PrFooter
        site-name="Adhésion"
        home-href="#accueil"
        width="wide"
        flush
        description="Association OREMIS. Ensemble pour une école plus inclusive et bienveillante."
        :columns="columns"
        :socials="socials"
        :legal-links="legal"
      />
    </div>
  `,
})
