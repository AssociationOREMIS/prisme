import { PrIconDiscord, PrIconInstagram, PrIconLinkedin, PrIconYoutube } from '../../../../icons/brand'
import type { PrFooterColumn, PrFooterLink, PrFooterSocial } from '../../../../components/layouts/Footer'

/** Demo content of the OREMIS footer, shared by the Footer and site page stories. */
export const footerColumns: PrFooterColumn[] = [
  {
    title: 'Association',
    links: [
      { label: 'Nos missions', href: '#missions' },
      { label: 'Devenir bénévole', href: '#benevolat' },
      { label: 'Faire un don', href: '#don' },
    ],
  },
  {
    title: 'Outils',
    links: [
      { label: 'Espace bénévoles', href: '#espace' },
      { label: 'Formation', href: '#formation' },
      { label: 'État des services', href: '#etat' },
    ],
  },
  {
    title: 'Aide',
    links: [
      { label: 'Nous contacter', href: '#contact' },
      { label: 'Questions fréquentes', href: '#faq' },
    ],
  },
]

export const footerSocials: PrFooterSocial[] = [
  { label: 'Discord', href: '#discord', icon: PrIconDiscord },
  { label: 'Instagram', href: '#instagram', icon: PrIconInstagram },
  { label: 'LinkedIn', href: '#linkedin', icon: PrIconLinkedin },
  { label: 'YouTube', href: '#youtube', icon: PrIconYoutube },
]

export const footerLegalLinks: PrFooterLink[] = [
  { label: 'Mentions légales', href: '#mentions-legales' },
  { label: 'Données personnelles', href: '#donnees' },
  { label: 'Accessibilité : partiellement conforme', href: '#accessibilite' },
]
