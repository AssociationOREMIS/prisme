# Prisme

Prisme est la bibliotheque UI Vue 3 officielle des applications web OREMIS.

Elle fournit des composants, des styles et des tokens de design pour construire des interfaces coherentes dans l'ecosysteme OREMIS.

## Requirements

1. Node 24 ou plus recent.
2. Vue 3.5 ou plus recent.
3. Un navigateur moderne compatible avec Tailwind CSS v4.

## Typographie

Le token `--pr-font-sans` (utilisé par tous les composants via `reset.css`) declare `Roboto` en premier, pour rester coherent avec les applications OREMIS existantes (`data`, `formation`). Importez `@oremis/prisme/fonts.css` pour la charger : sans cela, les navigateurs retombent silencieusement sur la police systeme (`ui-sans-serif`/`system-ui`).

Auto-hebergez Roboto plutot que de la charger depuis Google Fonts : avec un `<link>` vers `fonts.googleapis.com`, le navigateur de chaque visiteur transmet son adresse IP a Google, ce qui a deja ete sanctionne en Europe au titre du RGPD (sans consentement prealable). Pour une association dont le public peut etre vulnerable, ce n'est pas acceptable. `@oremis/prisme/fonts.css` s'appuie sur [`@fontsource/roboto`](https://fontsource.org/fonts/roboto) (installe avec Prisme) : les fichiers de police sont servis par votre application.

```ts
// Avant styles.css. Prisme fournit Roboto (@fontsource/roboto) : le bundler de l'app sert les fichiers.
import '@oremis/prisme/fonts.css'
import '@oremis/prisme/styles.css'
```

Avec `mountPrismeIsolated()`, chargez la police dans le document hote (import ci-dessus dans l'entree JS de la page), pas dans l'option `styles` : les navigateurs Chromium ignorent les `@font-face` declares a l'interieur d'un shadow root. Une fois declaree dans la page, la police est utilisable dans le shadow DOM.

## Usage

1. Installez le package.

```bash
npm install @oremis/prisme
```

2. Importez les styles.

```ts
import '@oremis/prisme/styles.css'
```

3. Utilisez les composants. L'entree principale ne depend pas de tiptap : seul `PrRichTextEditor` en a besoin, et il est expose par une entree dediee (voir plus bas).

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

Il est expose par l'entree dediee `@oremis/prisme/editor`, pas par l'entree principale ni par `app.use(Prisme)` : il importe tiptap et lowlight, et les garder hors de l'entree principale permet aux apps qui n'utilisent pas l'editeur d'importer `@oremis/prisme` sans installer ces paquets. Ses styles, eux, restent dans `@oremis/prisme/styles.css`.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PrRichTextEditor } from '@oremis/prisme/editor'

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

Ses dependances tiptap (`@tiptap/*`, `lowlight`, `tiptap-extension-resize-image`) sont des `peerDependencies` optionnelles : installez-les explicitement dans l'application consommatrice (memes versions que celles listees dans `package.json#peerDependencies` de Prisme) :

```bash
npm install @tiptap/vue-3@3.31.3 @tiptap/starter-kit@3.31.3 @tiptap/extension-link@3.31.3 # ... voir peerDependencies
```

Le node tiptap `Callout` utilise par l'editeur est aussi exporte separement, pour une app qui monterait son propre editeur tiptap sans passer par `PrRichTextEditor` :

```ts
import { Callout } from '@oremis/prisme/editor' // ou '@oremis/prisme/tiptap/callout'
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

### Boutons d'action (`action`)

Pour les actions courantes, `action` regle l'icone, le libelle et le ton en une prop : un bouton discret (`ghost`), carre avec seulement l'icone, dont le libelle est le nom accessible et l'infobulle.

```blade
<pr-button action="view" size="sm" href="{{ route('users.show', $user) }}"></pr-button>
<pr-button action="edit" size="sm" href="{{ route('users.edit', $user) }}"></pr-button>
<pr-button action="delete" size="sm" @click="confirmDelete"></pr-button>
<pr-button action="add" variant="primary">Ajouter un benevole</pr-button>
```

Actions disponibles (`prButtonActions`) : `view`, `edit`, `delete`, `remove`, `reject`, `approve`, `add`, `duplicate`, `copy`, `download`, `upload`, `search`, `history`, `back`, `more`. `delete`, `remove` et `reject` sont rouges (`tone="danger"`). `label`, `icon`, `tone` et `variant` remplacent ceux de l'action ; un texte dans le bouton s'affiche apres l'icone. Sans `action`, `icon` ajoute une icone Lucide et `label` nomme un bouton qui n'a qu'une icone.

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

`app.use(Prisme)` n'enregistre pas `PrRichTextEditor` (voir plus haut). Pour utiliser `<pr-rich-text-editor>` en Blade, ajoutez le plugin `PrismeEditor` de l'entree dediee (tiptap doit alors etre installe) :

```ts
import Prisme from '@oremis/prisme'
import { PrismeEditor } from '@oremis/prisme/editor'

app.use(Prisme).use(PrismeEditor)
```

### Chargement a la demande avec `registerPrisme` (recommande pour Blade)

`app.use(Prisme)` met toute la bibliotheque dans le bundle de chaque page. `registerPrisme` (entree `@oremis/prisme/blade`) enregistre les composants presents sur toutes les pages tels quels, et tous les autres a la demande : chaque composant devient un petit fichier charge seulement quand une page l'utilise. Plus besoin de script qui genere la liste des composants dans l'application.

```ts
import { createApp } from 'vue'
import { PrButton, PrNavbar, PrSidebar } from '@oremis/prisme'
import { registerPrisme } from '@oremis/prisme/blade'
import '@oremis/prisme/styles.css'

const app = createApp({})

registerPrisme(app, {
  // Sur toutes les pages : affiches des le premier rendu, sans apparaitre apres coup.
  eager: { PrButton, PrNavbar, PrSidebar },
  // Optionnel : un squelette pendant le chargement d'un composant (au-dela de `delay`, 150 ms par defaut).
  loading: (name) => (name === 'PrSelect' ? SelectSkeleton : undefined),
})

app.mount('#app')
```

Montez Vue sur un noeud qui porte `v-cloak` et cachez-le avec `[v-cloak] { display: none }` pour eviter de voir les balises brutes avant le montage. Tout texte saisi par quelqu'un doit etre place dans un element `v-pre` : Vue compile toute la page, et `{{ ... }}` dans une note serait sinon evalue.

#### Navigation plus rapide entre les pages

En Blade, chaque clic recharge toute la page et Vue la recompile avant de l'afficher. Une fois monte, `registerPrisme` prepare donc la page suivante, sans rien a ajouter dans l'application :

- **`prefetch`** (`'prerender'` par defaut) : quand le pointeur reste sur un lien, le navigateur charge deja la page, et avec `'prerender'` monte meme Vue en arriere-plan : au clic, elle s'affiche tout de suite. `'prefetch'` telecharge seulement le HTML, `false` desactive. Chrome et Edge uniquement (Speculation Rules), les autres navigateurs l'ignorent. Avec la navigation sans rechargement (par defaut, voir plus bas), le survol precharge la page dans tous les navigateurs, sans Speculation Rules.
- **`preload`** (`'idle'` par defaut) : quand la page n'a plus rien a faire, les composants charges a la demande sont telecharges un par un, pour que les pages suivantes les trouvent en cache, sans squelette. Desactive avec Save-Data.
- **`transitions`** (`true` par defaut) : la navbar et la sidebar restent immobiles, seul le contenu fait un fondu (View Transitions entre documents). Uniquement quand la nouvelle page est deja montee, et jamais avec « reduire les animations ».
- **`measure`** (`true` par defaut) : la mesure `prisme:mount` (du debut de la navigation au montage de Vue) apparait dans l'onglet Performance des devtools et en `console.debug` (niveau « Verbose »).

Ne sont jamais precharges : les liens vers un autre site, ceux qui ont `download` ou une `target`, ceux dont l'adresse contient `logout`, et ceux qui portent `data-no-prefetch`. Le prechargement envoie une vraie requete GET : un lien qui modifie quelque chose en GET (a eviter) doit porter `data-no-prefetch`.

#### Navigation sans rechargement (`navigation: 'swap'`, par defaut)

Par defaut, un clic sur un lien ne recharge plus la page, dans tous les navigateurs. Prisme recupere la page suivante (le serveur renvoie toujours sa page Blade complete) et remplace seulement le contenu de `#app` : la navbar et la sidebar restent en place avec leur etat (sidebar repliee, defilement), leurs props sont mises a jour (element actif, badges), et le contenu (`.pr-shell-grid__content`, sinon tout `#app`) est reconstruit. Le titre, l'adresse, le token CSRF, les boutons Precedent/Suivant et le defilement suivent ; le focus passe au contenu et les lecteurs d'ecran entendent le titre de la nouvelle page. Le survol d'un lien precharge la page (sans Speculation Rules, inutiles ici).

Rien a changer dans les controleurs ni dans les vues. La page se recharge normalement :

- si la page suivante apporte un script ou une feuille de style que la page actuelle n'a pas (`@push('scripts')`, carte, editeur...) ;
- si la reponse n'est pas du HTML (un export), vient d'un autre site (session expiree renvoyee au SSO) ou n'arrive pas ;
- pour les liens `download`, `target`, `logout`, ou marques `data-prisme-reload` (sur le lien ou un parent).

Les formulaires gardent leur envoi normal.

Un script de l'app qui agit sur la page a son chargement (`DOMContentLoaded`, `querySelector` apres le montage) ne se relance pas quand la page change : chargez-le avec `@push('scripts')` (la page se recharge alors normalement) ou marquez ses liens `data-prisme-reload`.

`navigation: false` coupe la navigation sans rechargement pour une app. Pour comparer ou ecarter une cause dans son propre navigateur, dans la console : `localStorage.setItem('prisme:navigation', 'off')` puis recharger (`localStorage.removeItem('prisme:navigation')` pour revenir).

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

### Isoler Prisme dans une page qui utilise un autre framework CSS (Bootstrap, etc.)

`@oremis/prisme/styles.css` inclut un reset Tailwind non prefixe (`.flex`, `.p-4`, `.hidden`, `.grid`, etc. sans espace de nom). Importe normalement (import global ou `@vite(...)`) dans une page Blade qui charge deja un autre framework CSS non-Tailwind (Bootstrap par exemple), ce reset s'applique a toute la page, pas seulement au composant monte : il peut silencieusement casser l'apparence ou le comportement d'elements totalement sans rapport ailleurs sur la meme page. Incident reel : la sidebar d'une app consommatrice s'est retrouvee bloquee en position repliee des qu'un composant Prisme etait monte sur la meme page.

Deux solutions, selon le besoin.

**1. `@oremis/prisme/styles-scoped.css` (le plus simple).** La meme feuille, mais qui ne touche jamais la page hote : aucune regle sur `html`, `body` ou les elements nus, et chaque classe utilitaire ne s'applique qu'aux elements Prisme et a leur contenu (`.collapse`, `.container`, `.table`... de Bootstrap restent intacts). Les composants s'ecrivent ensuite normalement dans la page, sans shadow DOM.

```ts
import '@oremis/prisme/styles-scoped.css' // au lieu de styles.css
```

Limite : les styles de la page hote (par exemple le `label` ou le `button` de Bootstrap) peuvent encore atteindre l'interieur des composants. Pour un composant complexe (editeur de texte riche), preferez la solution 2.

**2. Shadow DOM.** Montez le composant dans un shadow DOM plutot que dans le document courant, avec `mountPrismeIsolated()` : le style de Prisme reste alors entierement confine a l'interieur, sans jamais pouvoir affecter le reste de la page (et inversement, le CSS de l'hote ne peut pas polluer l'interieur du composant).

```ts
import { mountPrismeIsolated } from '@oremis/prisme'
import prismeStyles from '@oremis/prisme/styles.css?inline' // Vite: recupere le CSS en chaine, sans l'injecter dans <head>
import MyPrismeComponent from './MyPrismeComponent.vue'

const host = document.getElementById('prisme-app')

if (host) {
  mountPrismeIsolated(MyPrismeComponent, host, { styles: prismeStyles })
}
```

`mountPrismeIsolated()` renvoie `{ app, shadowRoot, unmount }` si vous avez besoin d'aller plus loin (demonter le composant, inspecter le shadow root, etc.).

#### Theme

Dans le shadow root, les tokens (`--pr-color-*`, `--pr-space-*`...) sont declares sur `:host`, c'est-a-dire l'element `host` passe a `mountPrismeIsolated()`. Le `data-pr-theme` que `usePrTheme()` pose sur `<html>` n'y est pas visible : c'est l'attribut `data-pr-theme` de l'element hote qui choisit le theme. L'option `theme` le pose pour vous :

| `theme` | Effet |
| --- | --- |
| `'light'` / `'dark'` | Theme fixe, quel que soit celui de la page hote. |
| `'document'` | Recopie `<html data-pr-theme>` et suit ses changements (theme de la page Prisme hote, `PrThemeToggle`). Sans cet attribut sur `<html>`, suit la preference du systeme. |
| omise | L'attribut de l'element hote n'est pas touche. Sans attribut, le composant suit la preference du systeme (`prefers-color-scheme`). |

```ts
// Page Bootstrap sans mode sombre : forcer le theme clair.
mountPrismeIsolated(MyPrismeComponent, host, { styles: prismeStyles, theme: 'light' })
```

Pour surcharger un token dans le shadow root, ajoutez la regle dans `styles`, apres le CSS de Prisme, sur `:host` pour le theme clair et `:host([data-pr-theme="dark"])` pour le sombre (plus specifique, il l'emporte sur une simple regle `:host`).

#### Styles de vos propres composants

Seul le CSS passe dans `styles` est injecte dans le shadow root. En build librairie/embed (Vite `build.lib`), les blocs `<style>` de vos propres SFC sont extraits dans une feuille separee, injectee (ou non) dans `<head>`, jamais dans le shadow root : ils n'y ont aucun effet. Mettez ce CSS dans un fichier importe en `?inline` et concatenez-le a celui de Prisme, comme le fait OREMIS Chat :

```ts
import prismeStyles from '@oremis/prisme/styles.css?inline'
import launcherStyles from './launcher.css?inline'

mountPrismeIsolated(ChatLauncher, host, {
  styles: `${prismeStyles}\n${launcherStyles}`,
  theme: 'light',
})
```

La police se charge, elle, dans le document hote (voir [Typographie](#typographie)).

Attention avec `PrRichTextEditor` (et tout autre composant qui accepte un prop `name` pour rendre un `<input>` cache destine a une soumission de formulaire native) : un element place dans un shadow DOM n'est pas inclus dans la soumission native du `<form>` ancetre. Ne passez pas `name` dans ce cas : gardez un vrai `<input type="hidden">` dans le DOM normal (hors du shadow root), et synchronisez-le vous-meme via `v-model`/un callback plutot que de compter sur l'auto-rendu du composant.

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

### Classes Tailwind des composants : prefixe `pr:`

Depuis la 0.18, les classes Tailwind des composants portent le prefixe `pr:` (`pr:flex`, `pr:sm:top-auto`, `pr:data-[state=open]:bg-[...]`), configure par `prefix(pr)` dans `src/styles/prisme.css`. Prisme ne genere donc aucune classe du meme nom que celles d'une app (`.hidden`, `.top-0`...) : aucune ne peut ecraser l'autre. Les classes BEM (`pr-button`, `pr-data-table__filter`) restent sans prefixe. Une classe sans `pr:` dans un composant n'est pas generee : `node scripts/prefix-classes.mjs` liste celles qui auraient ete oubliees (`--write` les corrige).

## Publier une version

On travaille sur `develop`. Pour publier :

1. Sur `develop`, un commit `chore(release): X.Y.Z` qui change `version` dans `package.json` (et `package-lock.json`, via `npm version X.Y.Z --no-git-tag-version`) et renomme la section `## Non publie` de `CHANGELOG.md` en `## X.Y.Z (AAAA-MM-JJ)`. Sans cette section, la publication echoue.
2. PR de `develop` vers `main`, puis merge.
3. Le workflow `npm-publish.yml` teste, construit et publie `X.Y.Z` sur npm, puis cree le tag `vX.Y.Z` et une release GitHub avec la section du changelog.

Un merge qui ne change pas la version ne publie rien. Ne creez pas le tag a la main : le workflow s'en charge. Une version de test (`1.0.0-beta.1`) est publiee sous le tag npm `next`, pas `latest`. Le workflow `ci.yml` lance les memes verifications sur chaque PR et sur `develop`.

## License

Prisme est distribue sous licence MIT. Voir [LICENSE](./LICENSE).
