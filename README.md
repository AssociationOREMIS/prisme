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
