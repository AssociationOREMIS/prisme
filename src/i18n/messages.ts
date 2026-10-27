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
  appShell: {
    /** The skip link, first stop of the keyboard on every page (RGAA 12.7). */
    skipLink: string
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
    /** What screen readers call the carousel and each of its slides (`aria-roledescription`). */
    roleDescription: string
    slideRoleDescription: string
  }
  combobox: {
    typeToSearch: string
    typeAtLeast: (count: number) => string
    searching: string
    searchFailed: string
    remove: (label: string) => string
    clear: string
    /** Read to screen readers once a value is picked or removed in a multiple combobox. */
    selected: (label: string) => string
    removed: (label: string) => string
    /** Read to screen readers as the list of options changes. */
    results: (count: number) => string
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
    /** Name of a row's actions button, from the row's first visible column: « Actions pour Camille MARTIN ». */
    rowActions: (label: string) => string
    /** Read to screen readers once the rows have been filtered or loaded. */
    results: (count: number) => string
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
  errorSummary: {
    title: (count: number) => string
    item: (label: string, message: string) => string
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
    /** Shown under the drop zone, before the maximum size. */
    maxSize: (size: string) => string
    /** Shown next to a file once it has been sent. */
    uploaded: string
    /** Read to screen readers once a file has been sent, removed or refused. */
    uploadedFile: (fileName: string) => string
    removed: (fileName: string) => string
    rejected: (fileName: string, reason: string) => string
    bytes: string
    kilobytes: string
    megabytes: string
  }
  navbar: {
    unknownRole: string
    /** Added for screen readers to the brand link of `homeHref`. */
    home: string
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
    /** Name of a page's link or button (« Page 2 »), its visible text being the number alone. */
    page: (page: number) => string
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
    /** Live status while an image uploads, and once it is uploaded. */
    imageUploading: string
    imageUploaded: string
    /** Toolbar button that opens the alternative text and width of the selected image. */
    imageProperties: string
    /** Title of the panel asking for the image's alternative text. */
    imagePanelTitle: string
    imageAlt: string
    imageAltHint: string
    /** Checkbox for an image that brings no information: it is inserted with `alt=""`. */
    imageDecorative: string
    imageAltRequired: string
    imageWidth: string
    imageWidthSmall: string
    imageWidthMedium: string
    imageWidthFull: string
    imageInsert: string
    imageSave: string
    cancel: string
    /** Author-facing warning under the editor, e.g. "1 image sans texte alternatif". */
    imagesMissingAlt: (count: number) => string
    youtubeTitlePrompt: string
    /** `title` of a YouTube iframe whose author gave none. */
    youtubeDefaultTitle: string
    /** Accessible name of a task list checkbox, from the task's text. */
    taskCheckbox: (text: string) => string
    detailsExpand: string
    detailsCollapse: string
    /** Text prefix of each callout box, hidden visually, read by screen readers and without CSS. */
    calloutPrefixInfo: string
    calloutPrefixSuccess: string
    calloutPrefixWarning: string
    calloutPrefixDanger: string
    /** Name of an emoji of the emoji picker, from its tiptap shortcode (`white_check_mark`). */
    emojiName: (name: string) => string
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
  sortableList: {
    /** Name of the grip that moves an item, e.g. "Déplacer Les formes du harcèlement". */
    handle: (label: string) => string
    /** How to move an item with the keyboard, read by screen readers on the grip. */
    instructions: string
    grabbed: (label: string, position: number, total: number) => string
    /** `list`: the list's `aria-label`, given when the item has just changed lists. */
    moved: (position: number, total: number, list?: string) => string
    dropped: (label: string, position: number, total: number) => string
    cancelled: (label: string) => string
    empty: string
    /** The move buttons, for a single click or tap instead of a drag (`moveButtons`). */
    moveUp: (label: string) => string
    moveDown: (label: string) => string
  }
  stepper: {
    /** Name of the group of steps. */
    label: string
    /** Read to screen readers when the current step changes. */
    status: (current: number, total: number) => string
    /** Read before the step number on its button, e.g. "Étape 1 Identité". */
    step: string
  }
  tagInput: {
    placeholder: string
    remove: (tag: string) => string
    /** Read to screen readers once a tag is added or removed. */
    added: (tag: string) => string
    removed: (tag: string) => string
    /** Shown once `maxTags` is reached. */
    limit: (max: number) => string
  }
  themeToggle: {
    toDark: string
    toLight: string
  }
  toast: {
    label: string
    /** Name of the region holding the toasts; `{hotkey}` is the key that reaches it (F8). */
    region: string
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
  appShell: {
    skipLink: 'Aller au contenu',
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
    roleDescription: 'carrousel',
    slideRoleDescription: 'élément',
  },
  combobox: {
    typeToSearch: 'Tapez pour rechercher',
    typeAtLeast: (count) => `Tapez au moins ${count} caractères`,
    searching: 'Recherche...',
    searchFailed: 'La recherche a échoué, réessayez.',
    remove: (label) => `Retirer ${label}`,
    clear: 'Effacer la sélection',
    selected: (label) => `${label} sélectionné`,
    removed: (label) => `${label} retiré`,
    results: (count) => (count === 0 ? 'Aucun résultat' : `${count} résultat${count > 1 ? 's' : ''}`),
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
    rowActions: (label) => `Actions pour ${label}`,
    results: (count) => (count === 0 ? 'Aucun résultat' : `${count} résultat${count > 1 ? 's' : ''}`),
    columns: 'Colonnes',
    selectedRows: (selected, total) => `${selected} sur ${total} ligne(s) sélectionnée(s).`,
    rowsPerPage: 'Lignes par page',
    pageOf: (page, pageCount) => `Page ${page} sur ${pageCount}`,
    view: 'Vue',
    sortAscending: 'Croissant',
    sortDescending: 'Décroissant',
    hideColumn: 'Masquer',
    firstPage: 'Première page',
    previousPage: 'Page précédente',
    nextPage: 'Page suivante',
    lastPage: 'Dernière page',
  },
  descriptionList: {
    empty: 'Non renseigné',
  },
  errorSummary: {
    title: (count) => (count > 1 ? `Le formulaire contient ${count} erreurs` : 'Le formulaire contient une erreur'),
    item: (label, message) => `${label} : ${message}`,
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
    maxSize: (size) => `${size} maximum`,
    uploaded: 'Envoyé',
    uploadedFile: (fileName) => `${fileName} envoyé`,
    removed: (fileName) => `${fileName} supprimé`,
    rejected: (fileName, reason) => `${fileName} refusé : ${reason}`,
    bytes: 'o',
    kilobytes: 'Ko',
    megabytes: 'Mo',
  },
  navbar: {
    unknownRole: 'Rôle inconnu',
    home: 'accueil',
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
    page: (page) => `Page ${page}`,
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
    imageUploading: 'Envoi de l\'image en cours…',
    imageUploaded: 'Image envoyée.',
    imageProperties: 'Texte alternatif et taille de l\'image',
    imagePanelTitle: 'Description de l\'image',
    imageAlt: 'Texte alternatif',
    imageAltHint: 'Ce que l\'image apporte au contenu, en une phrase courte. Il est lu par les lecteurs d\'écran.',
    imageDecorative: 'Image décorative (elle n\'apporte aucune information)',
    imageAltRequired: 'Saisissez un texte alternatif, ou cochez « Image décorative ».',
    imageWidth: 'Largeur',
    imageWidthSmall: 'Petite',
    imageWidthMedium: 'Moyenne',
    imageWidthFull: 'Pleine largeur',
    imageInsert: 'Insérer l\'image',
    imageSave: 'Enregistrer',
    cancel: 'Annuler',
    imagesMissingAlt: (count) => (count > 1
      ? `${count} images sans texte alternatif : sélectionnez-les une à une puis utilisez le bouton « Texte alternatif et taille de l'image ».`
      : '1 image sans texte alternatif : sélectionnez-la puis utilisez le bouton « Texte alternatif et taille de l\'image ».'),
    youtubeTitlePrompt: 'Titre de la vidéo (lu par les lecteurs d\'écran) :',
    youtubeDefaultTitle: 'Vidéo YouTube',
    taskCheckbox: (text) => text || 'Tâche sans texte',
    detailsExpand: 'Déplier la section',
    detailsCollapse: 'Replier la section',
    calloutPrefixInfo: 'Information :',
    calloutPrefixSuccess: 'Succès :',
    calloutPrefixWarning: 'Attention :',
    calloutPrefixDanger: 'Danger :',
    emojiName: (name) => ({
      bulb: 'Ampoule',
      white_check_mark: 'Coche',
      warning: 'Avertissement',
      pushpin: 'Punaise',
      dart: 'Dans le mille',
      thumbsup: 'Pouce levé',
      fire: 'Feu',
      memo: 'Mémo',
      clock3: 'Horloge',
      date: 'Calendrier',
      sparkles: 'Étincelles',
      rocket: 'Fusée',
      mortar_board: 'Toque de diplômé',
      books: 'Livres',
      bell: 'Cloche',
      exclamation: 'Point d\'exclamation',
      question: 'Point d\'interrogation',
      clap: 'Applaudissements',
      raised_hands: 'Mains levées',
      speech_balloon: 'Bulle de dialogue',
      paperclip: 'Trombone',
      framed_picture: 'Cadre photo',
      tada: 'Fête',
      blush: 'Visage souriant',
    } as Record<string, string>)[name] ?? name.replaceAll('_', ' '),
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
  sortableList: {
    handle: (label) => `Déplacer ${label}`,
    instructions: 'Espace pour saisir, flèches haut et bas pour déplacer, Espace pour déposer, Échap pour annuler.',
    grabbed: (label, position, total) => `Déplacement de ${label}, position ${position} sur ${total}.`,
    moved: (position, total, list) => (list ? `${list}, position ${position} sur ${total}.` : `Position ${position} sur ${total}.`),
    dropped: (label, position, total) => `Déplacement terminé : ${label}, position ${position} sur ${total}.`,
    cancelled: (label) => `Déplacement annulé : ${label} reprend sa place.`,
    empty: 'Aucun élément.',
    moveUp: (label) => `Monter ${label}`,
    moveDown: (label) => `Descendre ${label}`,
  },
  stepper: {
    label: 'Étapes',
    status: (current, total) => `Étape ${current} sur ${total}`,
    step: 'Étape',
  },
  tagInput: {
    placeholder: 'Ajouter...',
    remove: (tag) => `Supprimer ${tag}`,
    added: (tag) => `${tag} ajouté`,
    removed: (tag) => `${tag} supprimé`,
    limit: (max) => `${max} maximum atteint`,
  },
  themeToggle: {
    toDark: 'Passer en thème sombre',
    toLight: 'Passer en thème clair',
  },
  toast: {
    label: 'Notification',
    region: 'Notifications, touche {hotkey}',
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
