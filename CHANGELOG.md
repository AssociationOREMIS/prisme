# Changelog

Toutes les evolutions notables de `@oremis/prisme`. Avant la 1.0, un changement cassant incremente la version mineure.

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
