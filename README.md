# Prisme

Prisme est la bibliotheque UI Vue 3 officielle des applications web OREMIS.
Elle fournit des composants reutilisables, des tokens de design et des layouts
pour construire des interfaces coherentes dans l'ecosysteme OREMIS.

## Installation

```bash
npm install @oremis/prisme
```

```ts
import { PrButton, PrCard, PrInput } from '@oremis/prisme'
import '@oremis/prisme/styles.css'
```

## Developpement local

Installer les dependances :

```bash
npm install
```

Lancer l'application de developpement :

```bash
npm run dev
```

Lancer Storybook :

```bash
npm run storybook
```

## Validation

Avant de publier ou de pousser une modification importante :

```bash
npm run type-check
npm run test
npm run build
npm run build-storybook
npm pack --dry-run
```

## Composants

Les composants publics utilisent le prefixe `Pr` et sont exportes depuis
`@oremis/prisme`.

Principales familles disponibles :

- Actions : `PrButton`, `PrToggle`, `PrToggleGroup`, `PrCommand`
- Formulaires : `PrLabel`, `PrInput`, `PrTextarea`, `PrCheckbox`, `PrRadioGroup`, `PrSwitch`, `PrSelect`, `PrSlider`
- Feedback : `PrAlert`, `PrAlertDialog`, `PrProgress`, `PrSkeleton`, `PrSpinner`, `PrToast`
- Navigation : `PrAppShell`, `PrNavbar`, `PrSidebar`, `PrSidebarItem`, `PrSidebarSubItem`, `PrNavigationMenu`, `PrPagination`
- Donnees et contenu : `PrTable`, `PrDataTable`, `PrCard`, `PrListItem`, `PrTypography`
- Overlays : `PrDialog`, `PrSheet`, `PrPopover`, `PrDropdownMenu`, `PrHoverCard`, `PrTooltip`
- Date et affichage : `PrCalendar`, `PrDatePicker`, `PrCarousel`, `PrScrollArea`

Les composants sont documentes dans Storybook avec leurs etats principaux et
leurs variantes.

## Themes

Prisme gere nativement les themes `light`, `dark` et `system`. Sans choix
enregistre, `system` est utilise et suit la preference du navigateur via
`prefers-color-scheme`.

Le choix explicite de l'utilisateur est stocke dans `oremis-prisme-theme`.

```ts
import { usePrTheme } from '@oremis/prisme'

const { theme, resolvedTheme, setTheme, toggleTheme } = usePrTheme()

setTheme('system')
```

Pour eviter un flash de theme au chargement, injecter le script d'initialisation
avant le montage Vue :

```ts
import { getPrThemeInitScript } from '@oremis/prisme'
```

## Publication

Le package expose uniquement le dossier `dist` lors de la publication npm.
Construire la bibliotheque avant publication :

```bash
npm run build
npm pack --dry-run
```
