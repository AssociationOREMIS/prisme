import type { PrButtonAction } from '../components/atoms/Button/actions'

/**
 * Every text Prisme writes itself: button and field labels, screen reader names, empty
 * states, error messages. French by default ([[prMessagesFr]]), replaced as a whole or in
 * part through `app.use(Prisme, { messages })`. A prop on the component (`closeLabel`,
 * `placeholder`...) still wins for that one instance.
 */
export interface PrMessages {
  /** BCP 47 tag for dates and numbers (month names, day names, file sizes). */
  locale: string
  common: {
    close: string
    loading: string
    select: string
    noResults: string
    back: string
  }
  /** Labels of `PrButton`'s `action` presets. */
  actions: Record<PrButtonAction, string>
  alertDialog: {
    title: string
    confirm: string
    cancel: string
  }
  calendar: {
    previousMonth: string
    nextMonth: string
  }
  carousel: {
    label: string
    previous: string
    next: string
    position: (current: number, total: number) => string
  }
  combobox: {
    typeToSearch: string
    typeAtLeast: (count: number) => string
    searching: string
    searchFailed: string
    remove: (label: string) => string
    clear: string
  }
  command: {
    placeholder: string
  }
  dataTable: {
    empty: string
    /** Placeholder of the search field, for one column (its label) or for every column. */
    filter: (column: string | undefined) => string
    selectPage: string
    selectRow: (label: string) => string
    actions: string
    columns: string
    selectedRows: (selected: number, total: number) => string
    rowsPerPage: string
    pageOf: (page: number, pageCount: number) => string
    view: string
    sortAscending: string
    sortDescending: string
    hideColumn: string
    firstPage: string
    previousPage: string
    nextPage: string
    lastPage: string
  }
  descriptionList: {
    empty: string
  }
  fileUpload: {
    drop: string
    choose: string
    uploadFailed: string
    tooLarge: (maxSize: string) => string
    typeNotAccepted: string
    tooMany: (maxFiles: number) => string
    uploading: (fileName: string) => string
    retry: (fileName: string) => string
    remove: (fileName: string) => string
    bytes: string
    kilobytes: string
    megabytes: string
  }
  navbar: {
    unknownRole: string
  }
  navigationMenu: {
    label: string
  }
  numberInput: {
    decrement: string
    increment: string
  }
  pagination: {
    label: string
    previous: string
    next: string
  }
  richTextEditor: {
    placeholder: string
    toolbar: string
    heading: string
    subheading: string
    bold: string
    italic: string
    subscript: string
    superscript: string
    link: string
    linkPrompt: string
    highlight: string
    textColor: string
    removeTextColor: string
    removeTextColorShort: string
    alignLeft: string
    alignCenter: string
    alignRight: string
    bulletList: string
    orderedList: string
    taskList: string
    blockquote: string
    codeBlock: string
    details: string
    calloutInfo: string
    calloutSuccess: string
    calloutWarning: string
    calloutDanger: string
    image: string
    youtube: string
    youtubePrompt: string
    table: string
    emoji: string
    undo: string
    redo: string
    counts: (characters: number, words: number) => string
    noUploadHandler: string
    uploadFailed: string
  }
  sidebar: {
    label: string
    collapse: string
    expand: string
    notifications: (count: number | undefined) => string
  }
  slider: {
    value: string
  }
  tagInput: {
    placeholder: string
    remove: (tag: string) => string
  }
  themeToggle: {
    toDark: string
    toLight: string
  }
  toast: {
    label: string
  }
  /** Default messages of `usePrForm`'s rules (`required()`, `minLength(2)`...). */
  validation: {
    required: string
    email: string
    minLength: (min: number) => string
    maxLength: (max: number) => string
    pattern: string
    min: (min: number) => string
    max: (max: number) => string
  }
}

export const prMessagesFr: PrMessages = {
  locale: 'fr-FR',
  common: {
    close: 'Fermer',
    loading: 'Chargement',
    select: 'Sélectionner',
    noResults: 'Aucun résultat',
    back: 'Retour',
  },
  actions: {
    view: 'Voir',
    edit: 'Modifier',
    delete: 'Supprimer',
    remove: 'Retirer',
    reject: 'Rejeter',
    approve: 'Valider',
    add: 'Ajouter',
    duplicate: 'Dupliquer',
    copy: 'Copier',
    download: 'Télécharger',
    upload: 'Importer',
    search: 'Rechercher',
    history: 'Historique',
    back: 'Retour',
    more: 'Plus d’actions',
  },
  alertDialog: {
    title: 'Confirmer cette action',
    confirm: 'Confirmer',
    cancel: 'Annuler',
  },
  calendar: {
    previousMonth: 'Mois précédent',
    nextMonth: 'Mois suivant',
  },
  carousel: {
    label: 'Carrousel',
    previous: 'Élément précédent',
    next: 'Élément suivant',
    position: (current, total) => `Élément ${current} sur ${total}`,
  },
  combobox: {
    typeToSearch: 'Tapez pour rechercher',
    typeAtLeast: (count) => `Tapez au moins ${count} caractères`,
    searching: 'Recherche...',
    searchFailed: 'La recherche a échoué, réessayez.',
    remove: (label) => `Retirer ${label}`,
    clear: 'Effacer la sélection',
  },
  command: {
    placeholder: 'Rechercher',
  },
  dataTable: {
    empty: 'Aucune donnée',
    filter: (column) => (column ? `Filtrer ${column.toLocaleLowerCase('fr-FR')}...` : 'Filtrer les lignes...'),
    selectPage: 'Sélectionner la page',
    selectRow: (label) => `Sélectionner ${label}`,
    actions: 'Actions',
    columns: 'Colonnes',
    selectedRows: (selected, total) => `${selected} sur ${total} ligne(s) sélectionnée(s).`,
    rowsPerPage: 'Lignes par page',
    pageOf: (page, pageCount) => `Page ${page} sur ${pageCount}`,
    view: 'Vue',
    sortAscending: 'Asc',
    sortDescending: 'Desc',
    hideColumn: 'Masquer',
    firstPage: 'Première page',
    previousPage: 'Page précédente',
    nextPage: 'Page suivante',
    lastPage: 'Dernière page',
  },
  descriptionList: {
    empty: 'Non renseigné',
  },
  fileUpload: {
    drop: 'Glisser-déposer ou',
    choose: 'choisir un fichier',
    uploadFailed: 'Échec de l\'envoi',
    tooLarge: (maxSize) => `Taille maximale dépassée (${maxSize})`,
    typeNotAccepted: 'Type de fichier non accepté',
    tooMany: (maxFiles) => `Nombre maximum de fichiers atteint (${maxFiles})`,
    uploading: (fileName) => `Envoi de ${fileName}`,
    retry: (fileName) => `Réessayer l'envoi de ${fileName}`,
    remove: (fileName) => `Supprimer ${fileName}`,
    bytes: 'o',
    kilobytes: 'Ko',
    megabytes: 'Mo',
  },
  navbar: {
    unknownRole: 'Rôle inconnu',
  },
  navigationMenu: {
    label: 'Navigation',
  },
  numberInput: {
    decrement: 'Décrémenter',
    increment: 'Incrémenter',
  },
  pagination: {
    label: 'Pagination',
    previous: 'Page précédente',
    next: 'Page suivante',
  },
  richTextEditor: {
    placeholder: 'Rédigez votre contenu…',
    toolbar: 'Mise en forme du contenu',
    heading: 'Titre',
    subheading: 'Sous-titre',
    bold: 'Gras',
    italic: 'Italique',
    subscript: 'Indice',
    superscript: 'Exposant',
    link: 'Lien',
    linkPrompt: 'URL du lien :',
    highlight: 'Surligner',
    textColor: 'Couleur du texte',
    removeTextColor: 'Retirer la couleur du texte',
    removeTextColorShort: 'Retirer la couleur',
    alignLeft: 'Aligner à gauche',
    alignCenter: 'Centrer',
    alignRight: 'Aligner à droite',
    bulletList: 'Liste à puces',
    orderedList: 'Liste numérotée',
    taskList: 'Liste à cocher',
    blockquote: 'Citation',
    codeBlock: 'Bloc de code',
    details: 'Section repliable',
    calloutInfo: 'Encadré info',
    calloutSuccess: 'Encadré succès',
    calloutWarning: 'Encadré avertissement',
    calloutDanger: 'Encadré danger',
    image: 'Insérer une image',
    youtube: 'Intégrer une vidéo YouTube',
    youtubePrompt: 'Collez le lien de la vidéo YouTube :',
    table: 'Insérer un tableau',
    emoji: 'Insérer un emoji',
    undo: 'Annuler',
    redo: 'Rétablir',
    counts: (characters, words) => `${characters} caractères · ${words} mots`,
    noUploadHandler: 'Aucun gestionnaire d\'envoi d\'image n\'est configuré pour cet éditeur.',
    uploadFailed: 'L\'envoi de l\'image a échoué. Réessayez avec un fichier JPG, PNG ou WebP de moins de 8 Mo.',
  },
  sidebar: {
    label: 'Navigation principale',
    collapse: 'Réduire la navigation',
    expand: 'Étendre la navigation',
    notifications: (count) => (count === undefined ? 'Notification' : `${count} notification${count > 1 ? 's' : ''}`),
  },
  slider: {
    value: 'Valeur',
  },
  tagInput: {
    placeholder: 'Ajouter...',
    remove: (tag) => `Supprimer ${tag}`,
  },
  themeToggle: {
    toDark: 'Passer en thème sombre',
    toLight: 'Passer en thème clair',
  },
  toast: {
    label: 'Notification',
  },
  validation: {
    required: 'Ce champ est requis',
    email: 'Adresse email invalide',
    minLength: (min) => `Minimum ${min} caractères`,
    maxLength: (max) => `Maximum ${max} caractères`,
    pattern: 'Format invalide',
    min: (min) => `Valeur minimale : ${min}`,
    max: (max) => `Valeur maximale : ${max}`,
  },
}
