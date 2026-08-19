# Prisme

Prisme est la bibliotheque UI Vue 3 officielle des applications web OREMIS.

## Installation locale

```bash
npm install
```

## Developpement

```bash
npm run dev
npm run storybook
```

## Validation

```bash
npm run type-check
npm run test
npm run build
npm run build-storybook
npm pack --dry-run
```

## Usage

```ts
import {
  PrButton,
  PrDialog,
  PrSelect,
  PrTooltip,
  PrDataTable,
} from '@oremis/prisme'
import '@oremis/prisme/styles.css'
```

## Couverture composants

Prisme couvre progressivement les composants generiques d'IVAO Atmosphere avec
des implementations natives Vue 3, TypeScript, tokens Prisme et primitives Reka
UI lorsque le comportement clavier/focus le justifie.

Les composants publics utilisent tous le prefixe `Pr` et sont exportes depuis
`@oremis/prisme`. L'inventaire de parite est maintenu dans
[`docs/atmosphere-parity.md`](docs/atmosphere-parity.md).

Lots actuellement couverts :

- Forms : `PrLabel`, `PrTextarea`, `PrCheckbox`, `PrRadioGroup`, `PrSwitch`, `PrSelect`, `PrSlider`
- Feedback : `PrAlert`, `PrAlertDialog`, `PrProgress`, `PrSkeleton`, `PrToast`
- Overlays : `PrDialog`, `PrPopover`, `PrDropdownMenu`, `PrHoverCard`, `PrTooltip`, `PrSheet`
- Navigation / interaction : `PrAccordion`, `PrCollapsible`, `PrNavigationMenu`, `PrPagination`, `PrToggle`, `PrToggleGroup`, `PrCommand`
- Data / content : `PrTable`, `PrDataTable`, `PrCalendar`, `PrDatePicker`, `PrCarousel`, `PrScrollArea`, `PrTypography`, `PrListItem`

Les tables et `PrDataTable` utilisent un conteneur horizontal interne pour les
petits ecrans afin d'eviter un overflow global de page.

## Themes

Prisme gere nativement `light`, `dark` et `system`. Sans choix enregistre,
`system` est utilise et suit `prefers-color-scheme`. Le toggle utilisateur est
binaire comme Atmosphere : il bascule ensuite entre `light` et `dark`, et ce
choix explicite est stocke dans `oremis-prisme-theme`.

```ts
import { usePrTheme } from '@oremis/prisme'

const { theme, resolvedTheme, setTheme, toggleTheme } = usePrTheme()

setTheme('system')
```

Pour eviter le flash au chargement, injecter ce script avant le montage Vue :

```html
<script>
  (() => {
    const key = 'oremis-prisme-theme'
    const allowed = ['light', 'dark', 'system']
    let stored

    try {
      stored = localStorage.getItem(key)
    } catch {
      stored = null
    }

    const theme = allowed.includes(stored) ? stored : 'system'
    const resolved = theme === 'system'
      ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme

    document.documentElement.dataset.prTheme = resolved
    document.documentElement.style.colorScheme = resolved
  })()
</script>
```

Le meme snippet peut etre obtenu depuis le package :

```ts
import { getPrThemeInitScript } from '@oremis/prisme'
```
