# Changelog

Toutes les evolutions notables de `@oremis/prisme`. Avant la 1.0, un changement cassant incremente la version mineure.

## 0.19.0 (2026-10-07)

### Changements visibles

- **Les formulaires ne rechargent plus la page** (`navigation: 'swap'`, par defaut), comme les liens depuis la 0.16 : la navbar et la sidebar restent en place, seul le contenu change. Rien a modifier dans les controleurs ni les vues : Prisme envoie les memes champs que le navigateur et affiche la page vers laquelle Laravel redirige.
  - Succes : la page suivante, avec son message flash.
  - Validation ratee : la meme page avec les erreurs et les anciennes valeurs, sans nouvelle entree dans l'historique, le defilement garde et le focus sur le premier champ en erreur.
  - Formulaire `GET` (recherche, filtres) : comme un lien vers son adresse.
  - Un double clic n'envoie le formulaire qu'une fois ; `aria-busy` pendant l'envoi.
  - Jamais renvoye deux fois : un export est telecharge sans quitter la page, une redirection vers un autre site ou une autre mise en page est suivie normalement, une page d'erreur (419, 500) est affichee telle quelle.
  - Le navigateur garde les formulaires deja geres par l'app (`@submit.prevent`, `onsubmit` refuse), ceux qui ont une `target`, vont vers un autre site ou un `logout`, et ceux marques `data-prisme-reload`.
  - A verifier dans une app : un script qui agit apres l'envoi d'un formulaire en comptant sur le rechargement de la page.

### Tests

- Envoi avec redirection (shell garde, message flash), validation ratee (meme page, historique, focus), formulaire `GET`, double clic, formulaires laisses au navigateur, export telecharge, page d'erreur 419. Verifie aussi dans Chromium sur un serveur qui repond comme Laravel.

## 0.18.1 (2026-10-07)

### Corrections

- **Navigation sans rechargement derriere Cloudflare** : chaque clic rechargeait toute la page en production. Cloudflare ajoute a chaque reponse un script toujours different (detection des bots, Rocket Loader), que Prisme prenait pour un script propre a la page suivante. Les scripts servis sous `/cdn-cgi/` sont maintenant ignores.

### Tests

- Les scripts injectes par Cloudflare, differents d'une reponse a l'autre, n'empechent plus la navigation sans rechargement.

## 0.18.0 (2026-10-07)

### Changements visibles

- **Les classes Tailwind de Prisme sont prefixees : `pr:flex`, `pr:sm:top-auto`...** (`prefix(pr)`). Prisme et les apps generaient les memes noms de classes (`.hidden`, `.flex`, `.top-0`...) et l'un ecrasait toujours l'autre : `hidden md:flex` sur un element de l'app ne fonctionnait pas, et en 0.17 en essai les notifications de Superviseur passaient en haut. Plus aucune collision : `hidden md:flex`, `hidden peer-checked:flex` fonctionnent. Les 180 stories, en clair et en sombre, rendent a l'identique.
  - A verifier dans une app : son propre HTML ne peut plus compter sur une classe generee par Prisme ; il doit etre couvert par le Tailwind de l'app (c'est le cas de Superviseur, data et Forge).
  - Les classes BEM (`pr-button`...) ne changent pas. Une classe ajoutee a un composant Prisme (`class="w-full"`) reste une classe de l'app.
  - data peut retirer ses contournements (`!`).

### Ajouts

- **`PrPageHeader`** : lien retour, titre `h1`, description et actions a droite.
- **`PrDescriptionList`** (et `PrDescriptionItem`) : paires libelle / valeur d'une fiche, valeurs riches (badge, lien), « Non renseigné » pour une valeur vide, deux colonnes ou une selon la largeur de la liste.
- **En-tete de `PrCard`** : `title`, `description`, slot `actions` a droite (dessous sur une carte etroite), `heading-level`.
- **Recherche cote serveur dans `PrCombobox`** : `search-url` depuis Blade ou `search` en Vue, avec delai de frappe, nombre minimal de caracteres, chargement, annulation de la requete precedente et messages d'etat annonces aux lecteurs d'ecran. Remplace les composants de recherche ecrits dans data.
- `scripts/prefix-classes.mjs` : liste les classes sans `pr:` oubliees dans un composant (`--write` les corrige).

### Tests

- Aucune classe Tailwind sans prefixe dans les styles de Prisme ; en-tetes de page et de carte (titres, actions a droite puis dessous) ; liste de description (deux colonnes, une colonne etroite, valeur vide) ; recherche serveur (minimum de caracteres, une requete pour une frappe rapide, valeur envoyee, `search-url` et collection Laravel).

## 0.17.0 (2026-10-07)

### Changements visibles

- `PrButton` sans `variant` reste `primary`, sauf avec `action` (`ghost`).

### Ajouts

- **`PrButton`** :
  - `action="view|edit|delete|..."` : icone, libelle et ton des actions courantes en une prop (`prButtonActions`, voir README) ;
  - `icon` : une icone Lucide avant le libelle ;
  - bouton a icone seule (`icon` sans texte) : carre, nomme par `label`, affiche aussi en infobulle ;
  - `tone="danger"` : `ghost` ou `secondary` en rouge, pour Supprimer / Retirer / Rejeter dans un tableau.
- **`unchecked-value`** sur `PrSwitch` et `PrCheckbox` : une case decochee envoie cette valeur (`"0"`), le serveur peut desactiver l'option. Les apps peuvent retirer leur champ cache.
- **`hide-label`** sur `PrInput` : libelle garde pour les lecteurs d'ecran seulement, pour un formulaire compact sur une ligne.
- **`PrCollapsible`** : `keep-mounted` garde le contenu ferme dans la page (les champs d'un formulaire gardent leur valeur et sont envoyes), `variant="compact"` sans cadre, avec un declencheur discret comme un lien.

### Corrections

- **Plus d'erreur « Transition was aborted because of invalid state » a l'envoi d'un formulaire.** Avec la navigation sans rechargement, Prisme n'active plus les transitions entre documents (ses transitions restent dans la page) ; sans elle, la transition est annulee avant de partir quand un formulaire est envoye.
- `PrRichTextEditor` n'importe plus une seconde fois ses styles : ils sont dans `styles.css`.

### Tests

- Les notifications restent en bas a droite quand l'app genere les memes classes que Prisme (`top-0`, `w-full`...). Actions et boutons a icone (infobulle, carre, ton), valeur decochee envoyee, libelle cache, contenu replie envoye, transitions apres un envoi de formulaire.

## 0.16.1 (2026-10-07)

### Corrections

- **`PrButton` ne coupe plus ses mots** dans une colonne etroite (« Gé / rer ») : `overflow-wrap: break-word` au lieu de `anywhere`, un mot ne se coupe que s'il ne tient vraiment pas. Le libelle passe toujours a la ligne entre deux mots sur un petit ecran. Les apps peuvent retirer leur `.pr-button { white-space: nowrap }`.
- **`PrDataTable`** : une taille de page absente de `pageSizeOptions` y est ajoutee (le select affichait « Sélectionner », qui debordait sur « Page 1 sur 1 ») ; le select et « Page x sur y » s'elargissent selon leur contenu ; le filtre s'etend jusqu'a 28rem au lieu de 16rem fixes.
- **Listes a puces et numerotees** dans `PrRichTextEditor` et `.pr-editor-content` : puces, numeros et retrait (seules les listes de taches etaient stylees). Les apps peuvent retirer leur regle provisoire.

### Tests

- Bouton dans une colonne de largeur minimale, taille de page hors options, styles des listes.

## 0.16.0 (2026-10-07)

### Changements visibles

- **Navigation sans rechargement par defaut** (`navigation: 'swap'` de `registerPrisme`), dans tous les navigateurs : un clic recupere la page suivante et seul `#app` est remplace. La navbar et la sidebar restent en place avec leur etat (sidebar repliee, defilement) et leurs props a jour (element actif) ; le contenu (`.pr-shell-grid__content`, sinon tout `#app`) est reconstruit ; titre, adresse, token CSRF, Precedent/Suivant, defilement, focus et annonce aux lecteurs d'ecran suivent. Le survol d'un lien precharge la page. Retour a un chargement normal pour une page qui apporte d'autres scripts ou styles (`@push('scripts')`), une reponse non HTML ou d'un autre site, et les liens `download`/`target`/`logout`/`data-prisme-reload`. Les formulaires gardent leur envoi normal.
  - A verifier dans une app : un script qui agit sur la page a son chargement (`DOMContentLoaded`) ne se relance pas a chaque page (voir README).
  - Pour revenir au chargement complet : `navigation: false` dans l'app, ou `localStorage.setItem('prisme:navigation', 'off')` dans un navigateur.
- **La page suivante est preparee** une fois l'app montee (voir README, « Navigation plus rapide entre les pages »), chaque option se coupe avec `false` :
  - `preload` (`'idle'` par defaut) : les composants charges a la demande sont telecharges pendant les temps morts, plus de squelette sur les pages suivantes ;
  - `transitions` (`true` par defaut) : navbar et sidebar immobiles, fondu du contenu ;
  - `measure` (`true` par defaut) : mesure `prisme:mount` dans l'onglet Performance des devtools (et `prisme:navigation` a chaque page sans rechargement) ;
  - `prefetch` (`'prerender'` par defaut) : sans la navigation sans rechargement, la page derriere un lien survole est prerendue (Speculation Rules, Chrome et Edge). Liens externes, `download`, `target`, adresses contenant `logout` et `data-no-prefetch` exclus.

### Tests

- Navigation sans rechargement : shell conserve avec son etat, contenu reconstruit (`<main>` ou autre element), bouton Precedent, liens laisses au navigateur, retour au chargement normal, annonce et focus, active par defaut et coupee par `localStorage`. Verifiee aussi dans Chromium (page d'essai avec les vrais composants) et dans Firefox sur Superviseur.
- Regles de prechargement et exclusions, transitions ajoutees seulement apres le montage, prechargement des composants pendant les temps morts (sans les `eager`, ni avec Save-Data, et apres l'ouverture d'une page prerendue), mesure du montage.

## 0.15.0 (2026-10-07)

### Ajouts

- **`@oremis/prisme/styles-scoped.css`** : la feuille de Prisme pour une page Bootstrap (ou autre). Aucune regle sur `html`, `body` ou les elements nus, et chaque classe utilitaire ne s'applique qu'aux elements Prisme et a leur contenu. `styles.css` definit des `.collapse`, `.container`, `.table`, `.border`... sans prefixe : `.collapse { visibility: collapse }` cachait la sidebar repliable de Bootstrap. Les composants s'ecrivent ensuite dans la page, sans shadow DOM (voir README).
- **`@oremis/prisme/fonts.css`** : Roboto auto-hebergee (`@fontsource/roboto`, desormais dependance de Prisme), en une ligne au lieu de quatre imports.
- **`PrButton` avec `href`** rend un vrai lien `<a>` style comme un bouton (desactive : sans `href`, `aria-disabled`).
- **`PrSelect` accepte une option vide** (`{ value: '' }`, « Aucun ») : reka-ui la refusait ; v-model et formulaire recoivent `''`.
- **`error` accepte le tableau de messages de Laravel** sur tous les champs (`string | string[]`, premier message affiche). Type `PrFieldError` exporte.
- `PrNavbar` : `hide-title-on-mobile` (garde seulement le logo sous 780 px). `PrNavbarUserMenu` : emplacement `header` pour des lignes supplementaires dans l'en-tete du menu.

### Corrections

- **`PrCheckbox` avec `default-checked` sans valeur** (usage Blade) restait decochee : le type importe de reka empechait Vue de reconnaitre un booleen.
- `PrPagination` change de page sans `v-model:page`.

### Tests

- Interactions de `PrCheckbox`, `PrSwitch`, `PrToggle`, `PrDatePicker` et `PrPagination`, avec et sans `v-model` ; option vide de `PrSelect` ; lien `PrButton` ; tableau d'erreurs.
- Tests unitaires de `usePrTheme` et de `getPrThemeInitScript` (le script avant Vue applique le meme theme), et de la transformation de `styles-scoped.css`.
- `TESTING.md` a jour.

## 0.14.0 (2026-10-07)

### Changements visibles

- **Les toasts `danger` restent affiches jusqu'a ce qu'on les ferme**, sauf `duration` explicite (5 s laissaient trop peu de temps pour lire une erreur, WCAG 2.2.1). Les autres variantes gardent 5 s par defaut.
- **Couleurs plus lisibles (WCAG AA).** Les apps verront ces teintes changer, sans rien a modifier :
  - texte secondaire (`--pr-color-text-muted`, `--pr-color-text-subtle`) plus fonce en clair et plus clair en sombre : 4,5:1 minimum, y compris sur les fonds gris et bleu clair (placeholders et sous-titres de la sidebar etaient a 2,5:1) ;
  - bordures des champs (`--pr-color-border-strong`) a 3:1 contre la surface (1,48:1 avant) ;
  - `--pr-color-success` et `--pr-color-danger` un cran plus fonces en clair, pour les badges et messages sur fond pale ;
  - badge `neutral` sur fond blanc ;
  - contour de focus bleu clair dans la navbar (2,35:1 avant).
- `PrSelect` accepte `aria-label` quand aucun libelle n'est affiche ; le choix du nombre de lignes de `PrDataTable` est nomme.

### Corrections

- **Types perdus depuis l'entree principale.** Depuis les premieres versions, TypeScript resolvait `./atoms/Button` vers le fichier `.js` sans declaration : les props importees depuis `@oremis/prisme` valaient `any` (erreur TS7016 sans `skipLibCheck`). Chaque entree de composant a maintenant sa declaration.
- `PrButton` en chargement garde son nom accessible (le texte etait retire pour les lecteurs d'ecran).
- `PrRichTextEditor` : le libelle, l'aide, l'erreur et l'etat obligatoire sont sur la zone editable elle-meme (la zone n'avait pas de nom).
- `PrFileUpload` : le champ fichier n'est plus imbrique dans la zone de depot ni dans l'ordre de tabulation ; la zone est nommee par le libelle.
- `PrCommand` sans resultat n'expose plus de `listbox` vide, et annonce le message.
- Accent retabli dans « ligne(s) sélectionnée(s) ».
- `aria-describedby` ne pointe plus vers l'aide quand l'erreur l'a remplacee (`PrInput`, `PrTextarea`, `PrSelect`, `PrCheckbox`, `PrSwitch`).
- `PrInput` et `PrTextarea` : sans `model-value`, un `value="{{ old('x') }}"` Blade remplit le champ (la valeur vide par defaut l'ecrasait).
- **Reflow** : `PrButton` passe a la ligne au lieu de deborder sur un ecran etroit ; pieds de `PrDialog`, `PrSheet` et `PrAlertDialog` qui passent a la ligne ; titres longs de dialog qui ne poussent plus la croix hors de l'ecran.
- **Animations reduites** : le reglage systeme s'applique a tous les elements Prisme (squelette, switch, onglets, sidebar...), et la barre de progression du toast est masquee.
- Cibles tactiles de 24 px pour les boutons de suppression de `PrTagInput`, `PrCombobox`, `PrFileUpload` et l'effacement de `PrCombobox`.
- `PrNavbar` est un `<header>` et le nom de l'app un paragraphe : plus de `<h1>` « OREMIS » sur chaque page ni de deux reperes « Navigation principale ».
- Sidebar : une entree desactivee ne navigue plus ; le bouton de repli n'annonce plus un etat « enfonce » contradictoire.
- `PrProgress` calcule le pourcentage par rapport a `max` et a un nom (`label` ou `aria-label`) ; les envois de `PrFileUpload` sont nommes.
- `PrStepper` : etapes de vrais boutons, chiffre lisible en theme sombre.
- `PrDataTable` : tri annonce (`aria-sort`), case de ligne nommee par la premiere colonne au lieu de l'identifiant, filtre nomme.
- `PrCommand` : champ de recherche nomme ; action de `PrToast` annoncee par son libelle.
- **`PrCalendar` accessible** : grille de dates ARIA (chaque jour nomme par sa date complete, jour choisi annonce et visible, aujourd'hui signale), navigation au clavier (fleches, Debut/Fin, Page precedente/suivante, Maj pour l'annee), un seul jour dans l'ordre de tabulation, focus visible.
- `PrToggleGroup` (choix unique) et `PrStepper` horizontal defilent sur un ecran etroit au lieu de deborder.
- Types publies de `PrNavbarUserMenu` simplifies (slot declare) : ils recopiaient tout le type de reka et echouaient selon la version de Vue/TypeScript de l'app.

### Ajouts

- **`registerPrisme`** (`@oremis/prisme/blade`) : enregistre sur une app Vue montee sur du Blade les composants passes en `eager`, et tous les autres a la demande (un petit fichier par composant), avec un squelette optionnel pendant le chargement. Remplace le script de generation et la liste « eager » que chaque app recopiait (forge, superviseur). Voir le README.
- `PrCalendar` accepte `default-value`.

### Performance et packaging

- **L'entree principale est enfin decoupable** : `import { PrButton } from '@oremis/prisme'` embarquait toute la librairie (413 kB), c'est 3 kB comme l'import par chemin.
- **Un seul build partage** (`preserveModules`) au lieu d'un build par composant : chaque module n'existe qu'une fois, l'etat partage aussi (AppShell et Sidebar, `usePrTheme`) quel que soit le chemin d'import. `reka-ui` et `@lucide/vue`, deja des dependances, ne sont plus recopies dans le paquet. Paquet : 590 kB a 112 kB.
- Dependances tiptap : versions en `^3.31.3` au lieu d'exactes, `@tiptap/core` declare.

### Tests

- Les tests Storybook echouent desormais sur toute violation d'accessibilite (axe, `a11y.test: 'error'`) : 163 stories passent.
- Un test calcule les contrastes des tokens, en clair et en sombre, pour qu'un changement de couleur ne puisse plus les degrader sans le voir.

## 0.13.1 (2026-10-07)

### Corrections

- **Champs utilises sans `v-model`** (formulaire Blade classique, avec seulement `name` et `default-value`) : `PrRadioGroup` restait fige sur sa valeur par defaut, `PrTagInput` n'affichait ni n'envoyait les tags, `PrCombobox` envoyait une valeur vide, les boutons +/- de `PrNumberInput` ne faisaient rien, l'element choisi de `PrToggleGroup` devenait invisible et `PrRichTextEditor` envoyait le texte d'origine au lieu du texte modifie. Chacun garde maintenant sa valeur en local, comme `PrSlider` ; un `v-model` reste prioritaire. `PrTagInput`, `PrCombobox`, `PrNumberInput`, `PrToggleGroup` et `PrFileUpload` acceptent un `default-value`.
- **`PrFileUpload` envoie enfin ses fichiers** dans un formulaire natif : les fichiers deposes ou ajoutes en plusieurs fois etaient perdus, et `required` bloquait l'envoi.
- `PrCombobox` en choix multiple avec `required` bloquait l'envoi une fois des options choisies.
- **`PrToast`** : la barre de progression s'arrete quand le toast est survole, a le focus ou que la fenetre est en arriere-plan, comme le minuteur de fermeture (avant, la barre se terminait et le toast restait affiche). La mise en page en 3 colonnes faisait passer la croix a la ligne avec une icone et une action, et repoussait un texte court vers la droite : elle est remplacee par un flex.
- `PrNumberInput` et `PrTagInput` (et leurs types) sont exportes par l'entree principale ; un test verifie desormais que tout composant enregistre l'est aussi.

### Accessibilite

- `PrRadioGroup` est nomme par son libelle (`aria-labelledby`) : un lecteur d'ecran annonce la question avant les options.
- Bouton `danger` en theme sombre : texte blanc sur rouge a 2,77:1, porte a 4,83:1 avec les nouveaux tokens `--pr-color-danger-solid` et `--pr-color-danger-solid-hover` (aussi utilises par les pastilles de la sidebar).
- `aria-describedby` ne pointe plus vers l'aide quand l'erreur l'a remplacee (`PrRadioGroup`, `PrTagInput`, `PrCombobox`, `PrNumberInput`, `PrToggleGroup`).
- Accents retablis dans les textes lus par les lecteurs d'ecran (« Page précédente », « Sélectionner », « Réduire la navigation », « Passer en thème sombre »...).

### Publication

- Merger `develop` dans `main` publie la version de `package.json` sur npm, puis cree le tag et la release GitHub (voir README, « Publier une version »). Les tests tournent sans droits, la publication dans un job a part.
- Nouveau workflow `ci.yml` : verification des types, tests et build sur chaque PR et sur `develop`.

## 0.13.0 (2026-09-30)

### Changements cassants

- **`PrRichTextEditor` quitte l'entree principale.** Il est desormais expose par `@oremis/prisme/editor`, avec le node tiptap `Callout` et un nouveau plugin `PrismeEditor`. En consequence :
  - `import { PrRichTextEditor } from '@oremis/prisme'` ne fonctionne plus ;
  - `app.use(Prisme)` n'enregistre plus `PrRichTextEditor` (`<pr-rich-text-editor>` en Blade) ;
  - `componentPaths` (`@oremis/prisme/registry`) ne liste plus `PrRichTextEditor`.

  Pourquoi : `dist/prisme.js` importait statiquement tiptap et lowlight, pourtant declares en `peerDependencies` optionnelles. Une app sans tiptap qui importait simplement `PrButton` depuis `@oremis/prisme` cassait au build et aux tests (`Cannot find package '@tiptap/extension-character-count'`). Un `import()` dynamique n'aurait pas suffi (les bundlers le resolvent aussi au build), et rendre tiptap obligatoire aurait impose ~20 paquets a toutes les apps. L'entree principale et `@oremis/prisme/registry` n'importent plus aucun paquet tiptap (verifie par `src/entries.test.ts`).

  Inchange : l'import par chemin `@oremis/prisme/components/molecules/RichTextEditor`, `@oremis/prisme/tiptap/callout`, `@oremis/prisme/styles/editor-content.css`, et les styles de l'editeur, toujours inclus dans `@oremis/prisme/styles.css`.

- **Styles de base sur `:host`.** Dans un shadow root, l'element hote recoit maintenant la police (`--pr-font-sans`), l'interligne et la couleur de texte de Prisme (comme `<html>`/`<body>` dans un document). Le texte des composants montes via `mountPrismeIsolated()` n'herite donc plus de la police/couleur de la page hote. Sans effet hors shadow DOM.

#### Migration

```diff
- import { PrRichTextEditor } from '@oremis/prisme'
+ import { PrRichTextEditor } from '@oremis/prisme/editor'
```

```diff
  import Prisme from '@oremis/prisme'
+ import { PrismeEditor } from '@oremis/prisme/editor'

- app.use(Prisme)
+ app.use(Prisme).use(PrismeEditor) // seulement si <pr-rich-text-editor> est utilise en Blade
```

### Corrections

- **`mountPrismeIsolated()` : les tokens s'appliquent dans le shadow root.** `tokens.css` et `themes.css` declaraient les tokens (`--pr-color-*`, `--pr-space-*`...) uniquement sur `:root`/`[data-pr-theme]`, qui ne correspondent a rien dans un shadow root : les composants montes n'avaient ni couleurs ni espacements (sauf s'ils les heritaient d'une page hote utilisant elle-meme Prisme). Ils sont maintenant aussi declares sur `:host`, `:host([data-pr-theme="dark"])` et `:host(:not([data-pr-theme]))` (theme systeme). Les contournements existants (`data-pr-theme` pose a la main, `replaceAll(':root', ':root,:host')`) restent compatibles mais deviennent inutiles.

### Ajouts

- `@oremis/prisme/editor` : `PrRichTextEditor`, `PrRichTextEditorProps`, `Callout`, `PrCalloutAttributes`, `PrCalloutVariant` et le plugin `PrismeEditor`.
- `mountPrismeIsolated()` : option `theme` (`'light'`, `'dark'` ou `'document'`), qui pose `data-pr-theme` sur l'element hote. `'document'` recopie `<html data-pr-theme>` et suit ses changements, le theme de `usePrTheme()` n'etant pas visible depuis le shadow root. Omise, l'attribut de l'hote n'est pas modifie (comportement actuel). Nouveau type `PrIsolatedTheme`.
- Story `Composables/mountPrismeIsolated`, dont les tests (Playwright) verifient que les tokens sont definis et appliques dans le shadow root, en clair et en sombre.

### Documentation

- README : Roboto auto-hebergee (`@fontsource/roboto`) au lieu de Google Fonts, qui transmet l'IP des visiteurs a Google (RGPD) ; police a charger dans le document hote avec `mountPrismeIsolated()`.
- README : `mountPrismeIsolated()`, option `theme`, surcharge de tokens dans le shadow root, et CSS des SFC du consommateur a passer via `styles` (non injecte dans le shadow root en build librairie).
