# Backlog

Ce qui reste à faire ou à décider sur Prisme. Voir `TESTING.md` pour la checklist de validation manuelle.

## Bug critique corrigé le 2026-09-09 (noté a posteriori vu la gravité)

**`PrCheckbox`, `PrSwitch` et `PrToggle` étaient totalement non-contrôlables** : leur wiring interne passait `:checked`/`:default-checked` (ou `:pressed`/`:default-pressed`) aux composants reka-ui sous-jacents (`CheckboxRoot`, `SwitchRoot`, `Toggle`), mais ces trois primitives reka-ui utilisent en réalité `modelValue`/`update:modelValue` (et `defaultValue`), pas `checked`/`pressed`. Résultat : `:checked`/`@update:checked` atterrissaient dans les `$attrs` de la primitive (silencieusement absorbés, aucune erreur), qui tournait alors en mode **non contrôlé** — un clic faisait bien visuellement basculer l'état (`data-state`), mais aucun `update:checked`/`update:pressed` n'était jamais émis vers le parent, et changer la prop `checked` depuis le parent n'avait aucun effet visuel. Un `v-model:checked`/`v-model:pressed` — le pattern documenté dans le README — ne fonctionnait donc jamais réellement.

Trouvé en branchant `PrCheckbox` dans un vrai scénario contrôlé (`PrDataTable` `selectable`, page de test `/dev/selectable-datatable-test`) : la sélection ne se répercutait jamais côté parent malgré un clic visuellement "réussi". Confirmé aussi sur `PrSwitch`/`PrToggle` (même schéma reka-ui `modelValue`).

**Corrigé** dans `src/components/atoms/Checkbox/PrCheckbox.vue`, `src/components/atoms/Switch/PrSwitch.vue`, `src/components/atoms/Toggle/PrToggle.vue` : binding changé vers `:model-value`/`:default-value`/`@update:model-value` en interne, l'API publique de ces trois composants (`checked`/`pressed`, `update:checked`/`update:pressed`) reste inchangée. Vérifié : `npm run type-check` + 177 tests passent, et en navigateur réel — un header "select all" de `PrDataTable` (jamais cliqué lui-même) reflète correctement l'état `checked`/`indeterminate` calculé par le parent, et cliquer ce header propage bien `checked` à toutes les lignes (jamais cliquées individuellement) : contrôle externe confirmé dans les deux sens, pas seulement au clic direct.

Ce bug touchait potentiellement **tout usage contrôlé** de ces trois composants dans `forge` ou tout futur projet — à surveiller si un comportement de case à cocher/switch/toggle semblait "figé" avant cette date.

## `PrScrollArea` : le contenu débordant était coupé sans scroll possible

Trouvé le 2026-09-09 par l'utilisateur sur `/dev/components-smoke-test` ("semble pas fonctionner"). `ScrollAreaRoot` ne reçoit qu'un `max-height` (il grandit avec le contenu jusqu'à ce plafond, ce n'est pas une hauteur fixe) — `ScrollAreaViewport` était en `height: 100%`, un pourcentage de hauteur dans un parent dont la hauteur reste "auto" ne fait rien en CSS. Le viewport ne se limitait donc jamais vraiment, et une fois le contenu plus haut que `max-height`, c'est l'`overflow-hidden` du conteneur externe qui coupait la fin du contenu — sans aucun moyen de scroller pour la voir.

Corrigé (`src/components/molecules/ScrollArea/PrScrollArea.vue`) avec le pattern déjà utilisé par `PrDialog` pour le même problème : `flex flex-col` sur `ScrollAreaRoot`, `flex-1 min-h-0` sur `ScrollAreaViewport` (au lieu de `size-full`), et les scrollbars repositionnées en overlay `absolute` plutôt qu'en flux normal.

## Couverture de tests d'interaction

Le pattern `play` function (Storybook + `storybook/test`) a été introduit sur `PrDialog`, `PrSheet`, `PrTabs` et `PrCarousel` — jusqu'ici aucune story n'en avait, la suite ne faisait que vérifier l'absence d'erreur au rendu. Reste à étendre le même pattern aux autres composants interactifs qui n'en ont pas encore (`PrAccordion`, `PrCombobox`, `PrSelect`, `PrPopover`, `PrDropdownMenu`, `PrToggleGroup`, `PrCommand`, etc.), au fil de l'eau plutôt qu'en un seul lot.
