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

Vous pouvez aussi ecrire les composants directement dans le Blade, tant qu'ils sont dans le noeud monte par Vue. En HTML, utilisez le format kebab-case :

```ts
import { createApp } from 'vue'
import { PrButton } from '@oremis/prisme'
import '@oremis/prisme/styles.css'

const app = createApp({})

app.component('PrButton', PrButton)
app.mount('#prisme-app')
```

```blade
@vite('resources/js/app.ts')

<div id="prisme-app">
    <pr-button>Enregistrer</pr-button>
</div>
```

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
