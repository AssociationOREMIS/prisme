import type { PrLinkListItem } from '../../../../components/molecules/LinkList'

/** Updates of the « OREMIS DevOps » demo site, shared by the LinkList and site page stories. */
export const devopsNotes: PrLinkListItem[] = [
  {
    id: 'sauvegardes',
    title: 'Les sauvegardes passent à une copie par nuit',
    href: '#notes/sauvegardes',
    description: 'Les bases de données des outils sont copiées chaque nuit sur un second serveur, et une restauration est testée chaque mois.',
    tags: [{ label: 'Infrastructure', variant: 'primary' }, { label: 'Lecture 4 min', variant: 'plain' }],
    meta: ['12 novembre 2026', 'Camille MARTIN'],
  },
  {
    id: 'accessibilite',
    title: 'Audit d\'accessibilité de l\'espace bénévoles',
    href: '#notes/accessibilite',
    description: 'Contrastes, navigation au clavier et lecteurs d\'écran : ce que nous avons corrigé et ce qui reste à faire.',
    tags: [{ label: 'Accessibilité', variant: 'success' }, { label: 'Lecture 6 min', variant: 'plain' }],
    meta: ['5 novembre 2026', 'Alex DURAND'],
  },
  {
    id: 'maintenance',
    title: 'Maintenance prévue le samedi 21 novembre',
    href: '#notes/maintenance',
    description: 'Les outils seront indisponibles de 8 h à 10 h pour la mise à jour des serveurs.',
    tags: [{ label: 'Maintenance', variant: 'warning' }],
    meta: ['2 novembre 2026', 'Camille MARTIN'],
  },
]
