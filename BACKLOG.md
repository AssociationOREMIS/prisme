# Backlog

Suites identifiées lors de l'audit du design system (2026-09-08), volontairement non traitées dans l'immédiat. Voir `TESTING.md` pour la checklist de validation de ce qui a déjà été corrigé.

## Décisions produit à prendre avant implémentation

- **Harmonisation des APIs de contrôle booléen** : `modelValue` (Accordion), `checked`/`update:checked` (Checkbox, Switch), `pressed`/`update:pressed` (Toggle), `open`/`update:open` (Collapsible, Dialog, Sheet, Popover, Toast, AlertDialog, DropdownMenu). Un `v-model` nu ne marche que sur Accordion ; partout ailleurs il faut `v-model:checked`/`v-model:pressed`/`v-model:open`. Ajouter un alias `modelValue`/`update:modelValue` en plus du prop nommé est possible mais risque de désync entre deux sources de vérité — nécessite une vraie décision d'API, pas un fix ponctuel.
- **`PrFileUpload` : upload réel avec progress** : le composant ne fait que collecter des `File[]` côté client. Pas de state `uploading`/`progress`, pas de mapping des erreurs 422 par fichier (juste un `error` global). À concevoir si un cas d'usage Laravel concret (upload direct vs via un form classique) se présente.
- **`PrCommand` : accessibilité clavier** : pas de liaison ARIA combobox↔listbox (`aria-expanded`, `aria-controls`, `aria-activedescendant`), pas de navigation flèches (Tab requis pour parcourir les résultats). Refonte plus large qu'un correctif.
- **`usePrForm` : `isSubmitting`** : pas d'état de chargement exposé pendant `handleSubmit`. Feature à ajouter si le besoin se confirme (actuellement documentée comme absente dans `TESTING.md`).

## Stories manquantes (cosmétique, à faire au fil de l'eau)

- Accordion : `type="multiple"`, item `disabled`.
- Collapsible : `disabled`, `open` contrôlé.
- RadioGroup : état `error`.
- DatePicker : `error`, `disabled`, `min`/`max`.
- ToggleGroup : `type="multiple"`, `disabled`, `error`/`hint`.
- Command : item `disabled`, état "aucun résultat".
- DropdownMenu : slot `checkboxItem` (existe dans le composant, jamais montré).
- Dialog : contenu long/scrollable.
- Typography : la story `TableStory` n'utilise pas réellement `PrTypography` (rend un `<table>` HTML brut) ; pas de story pour la variante `code`.

## Autres points relevés dans l'audit, non traités

- `PrScrollArea` : simple `overflow-auto`, n'utilise pas les primitives reka-ui `ScrollArea` (pas de scrollbar stylée cross-navigateur).
- `PrNavigationMenu` : composant plat (liens seuls), pas de sous-menus/triggers malgré un nom qui évoque le pattern reka-ui `NavigationMenu` complet — à clarifier dans la doc ou à étoffer selon le besoin réel.
- `PrCarousel` : pas de `aria-live` sur le changement de slide, pas de navigation clavier flèches.
- `PrPagination` : n'accepte que `page`/`pageCount`, pas de `pageSize`/`totalRows` — un consommateur doit calculer `pageCount` lui-même à partir de `fromLaravelPaginator`. Pourrait exposer une API plus proche de celle de `DataTable`.
- Couverture de tests globale encore faible en dehors des composables/utils purs (28 tests unitaires + 133 tests Storybook, mais aucun test d'interaction/comportement sur les composants visuels type Dialog, Sheet, Tabs, etc. — la suite Storybook ne fait que vérifier que les stories rendent sans erreur, pas leur comportement).

## Suivi

- [ ] Valider les correctifs de cette session en conditions réelles (app Laravel de test) — cf. `TESTING.md`.
- [ ] Décider si une release `0.8.0` est justifiée vu le volume de correctifs (dont 2 corruptions de données silencieuses : `usePrForm.isDirty`/`reset`, décalage de date `PrCalendar`).
- [ ] Revenir sur les items de ce backlog une fois la validation terminée.
