# Changelog

Toutes les evolutions notables de `@oremis/prisme`. Avant la 1.0, un changement cassant incremente la version mineure.

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
