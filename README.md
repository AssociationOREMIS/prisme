# Prisme

Prisme est la bibliotheque UI Vue 3 officielle des applications web OREMIS.

Elle fournit des composants, des styles et des tokens de design pour construire des interfaces coherentes dans l'ecosysteme OREMIS.

## Requirements

1. Node 24 ou plus recent.
2. Vue 3.5 ou plus recent.
3. Un navigateur moderne compatible avec Tailwind CSS v4.

## Usage

1. Installez le package.

```bash
npm install @oremis/prisme
```

2. Importez les styles.

```ts
import '@oremis/prisme/styles.css'
```

3. Utilisez les composants.

```vue
<script setup lang="ts">
import { PrButton } from '@oremis/prisme'
</script>

<template>
  <PrButton>Continuer</PrButton>
</template>
```

4. Consultez la documentation Storybook.

```text
https://associationoremis.github.io/prisme/
```

### Composants controles (v-model)

Chaque composant a etat ouvert/coche reprend le nom de prop de la primitive [reka-ui](https://reka-ui.com) qu'il enveloppe, plutot que d'imposer une convention `modelValue` uniforme. Un `v-model` nu ne fonctionne donc que sur `PrAccordion` :

| Composant(s) | Prop | v-model |
| --- | --- | --- |
| `PrAccordion` | `modelValue` | `v-model="valeur"` |
| `PrCheckbox`, `PrSwitch` | `checked` | `v-model:checked="valeur"` |
| `PrToggle` | `pressed` | `v-model:pressed="valeur"` |
| `PrCollapsible`, `PrDialog`, `PrSheet`, `PrPopover`, `PrToast`, `PrAlertDialog`, `PrDropdownMenu` | `open` | `v-model:open="valeur"` |

Chacun de ces composants accepte aussi un `default-xxx` (`defaultValue`, `defaultChecked`, `defaultPressed`, `defaultOpen`) pour un usage non controle, sans avoir a gerer l'etat cote consommateur.

### `PrRichTextEditor`

Editeur de texte riche (Vue 3 + [tiptap](https://tiptap.dev)), avec titres, listes, tableaux, images, video YouTube, blocs de code colores, sections repliables et encadres `Callout` (info/succes/avertissement/danger).

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PrRichTextEditor } from '@oremis/prisme'

const content = ref('<p>Contenu initial</p>')

async function uploadImage(file: File, onProgress?: (percent: number) => void) {
  const body = new FormData()
  body.append('file', file)

  const response = await fetch('/upload', { method: 'POST', body })
  // Adaptez selon votre backend : pas de progression reelle possible avec
  // `fetch`, un client HTTP capable de suivre l'upload (axios, XHR) permet
  // d'appeler `onProgress(percent)` pendant l'envoi.
  onProgress?.(100)

  const { url } = await response.json()
  return url
}
</script>

<template>
  <PrRichTextEditor v-model="content" label="Contenu" :upload-image="uploadImage" />
</template>
```

Ses dependances tiptap (`@tiptap/*`, `lowlight`, `tiptap-extension-resize-image`) sont des `peerDependencies` optionnelles — installez-les explicitement dans l'application consommatrice (memes versions que celles listees dans `package.json#peerDependencies` de Prisme) :

```bash
npm install @tiptap/vue-3@3.31.3 @tiptap/starter-kit@3.31.3 @tiptap/extension-link@3.31.3 # ... voir peerDependencies
```

Le node tiptap `Callout` utilise par l'editeur est aussi exporte separement, pour une app qui monterait son propre editeur tiptap sans passer par `PrRichTextEditor` :

```ts
import { Callout } from '@oremis/prisme/tiptap/callout'
```

Le rendu du contenu (tableaux, `Callout`, blocs de code, sections repliables) est stylise par `@oremis/prisme/styles/editor-content.css`, importable seul par une vue de lecture seule qui n'a pas besoin du reste de Prisme :

```ts
import '@oremis/prisme/styles/editor-content.css'
```

```html
<div class="pr-editor-content" v-html="content" />
```

Comme `PrCombobox`/`PrTagInput`, le contenu de l'editeur n'est pas un `<textarea>` natif : pour une soumission de formulaire native (`<form method="POST">` sans JS de soumission), passez un `name` — un `<input type="hidden">` synchronise avec `modelValue` est rendu automatiquement.

```vue
<PrRichTextEditor v-model="content" name="body" />
```

### Empiler plusieurs composants Prisme verticalement

`PrDataTable` et les autres composants larges (formulaires avec beaucoup de champs) utilisent `flex flex-col` en interne, pas `display: grid`. Un wrapper consommateur en `display: grid` sans `grid-template-columns` explicite autour d'un tel composant produit un debordement (CSS Grid blowout) : la piste implicite se dimensionne sur le contenu le plus large, meme si le conteneur a `min-width: 0` (qui ne protege que sa propre boite, pas sa piste interne).

Pour empiler plusieurs composants Prisme verticalement (DataTable, formulaire, etc.), utilisez `flex flex-col` (ou `display: block`) plutot qu'une grille nue :

```html
<!-- A eviter : grille sans colonnes explicites -->
<div class="grid">
  <PrDataTable ... />
</div>

<!-- Recommande -->
<div class="flex flex-col">
  <PrDataTable ... />
</div>
```

## Laravel Blade

Dans une application Laravel avec Vite, Prisme peut etre monte dans une vue Blade via une petite application Vue.

1. Installez le package dans l'application Laravel.

```bash
npm install @oremis/prisme
```

2. Importez les styles et montez Vue dans `resources/js/app.ts`.

```ts
import { createApp } from 'vue'
import { PrButton } from '@oremis/prisme'
import '@oremis/prisme/styles.css'

const element = document.getElementById('prisme-app')

if (element) {
  createApp({
    components: { PrButton },
    template: '<PrButton>{{ label }}</PrButton>',
    data: () => ({
      label: element.dataset.label ?? 'Continuer',
    }),
  }).mount(element)
}
```

3. Ajoutez le point de montage dans une vue Blade.

```blade
@vite('resources/js/app.ts')

<div id="prisme-app" data-label="Enregistrer"></div>
```

Pour plusieurs composants ou des ecrans plus complets, creez un composant Vue dedie puis montez-le depuis `app.ts`.

### Enregistrement global avec `app.use(Prisme)`

Vous pouvez aussi ecrire les composants Prisme directement dans le Blade, tant qu'ils sont dans le noeud monte par Vue. Dans ce cas, installez le plugin Prisme avec `app.use(Prisme)` : il enregistre globalement tous les composants publics de la bibliotheque, utilisables ensuite en HTML/Blade sous leur forme kebab-case.

```ts
import { createApp } from 'vue'
import Prisme from '@oremis/prisme'
import '@oremis/prisme/styles.css'

const app = createApp({})

app.use(Prisme)

app.mount('#prisme-app')
```

```blade
@vite('resources/js/app.ts')

<div id="prisme-app">
    <pr-button>Enregistrer</pr-button>
    <pr-badge>Actif</pr-badge>
    <pr-input placeholder="Nom"></pr-input>
    <pr-data-table></pr-data-table>
</div>
```

### `app.use(Prisme)` ou imports nommes ?

- `app.use(Prisme)` enregistre en une seule fois tous les composants Prisme comme composants globaux de l'application. C'est le plus adapte quand les composants sont utilises directement dans du HTML/Blade (pas de `<script setup>` pour les declarer), au prix d'inclure l'integralite de la bibliotheque dans le bundle.
- `import { PrButton } from '@oremis/prisme'` importe uniquement les composants reellement utilises et beneficie du tree-shaking. C'est le choix recommande dans des composants Vue (SFC) ou seule une partie de Prisme est necessaire.

Les deux approches sont interchangeables et peuvent cohabiter dans la meme application.

### Eviter le flash de theme (FOUC) en Blade

Dans une SPA, `usePrTheme()` applique le theme des le montage de Vue. En Blade, le HTML est deja affiche par le navigateur avant que le bundle Vue ne s'execute : sans intervention, la page s'affiche brievement dans le theme par defaut avant de basculer vers le theme reellement choisi (sombre par ex.).

Pour l'eviter, il faut qu'un `<script>` **synchrone, non-module**, s'execute dans le `<head>` du layout Blade avant le premier paint — donc avant meme `@vite(...)`, dont les scripts sont charges en `type="module"` (differe par le navigateur). `getPrThemeInitScript()` fournit justement ce script : une chaine de JS vanilla, sans dependance, qui lit la preference stockee et pose `data-pr-theme`/`color-scheme` sur `<html>` immediatement.

Le plus simple est de l'ecrire une fois dans un fichier statique servi tel quel (pas de build Vite dessus), a partir d'un petit script Node execute a la racine du projet :

```js
// scripts/write-theme-init-script.mjs
import { writeFileSync } from 'node:fs'
import { getPrThemeInitScript } from '@oremis/prisme'

writeFileSync('public/prisme-theme-init.js', getPrThemeInitScript())
```

```blade
<head>
    <script src="{{ asset('prisme-theme-init.js') }}"></script>
    @vite(['resources/css/app.css', 'resources/js/app.ts'])
</head>
```

Sans cette etape, `getPrThemeInitScript()` — bien que fournie a cet effet — n'a aucun effet : le flash de theme qu'elle est censee eviter se produira quand meme, puisque `usePrTheme()`/`setPrTheme()` ne s'executent qu'apres l'hydratation du bundle Vue, donc apres le premier paint.

## Development

```bash
npm install
npm run storybook
```

Build de la librairie :

```bash
npm run build
```

Build du Storybook statique :

```bash
npm run build-storybook
```

## License

Prisme est distribue sous licence MIT. Voir [LICENSE](./LICENSE).
