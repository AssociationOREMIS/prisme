# Changelog

Toutes les evolutions notables de `@oremis/prisme`. Avant la 1.0, un changement cassant incremente la version mineure.

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
