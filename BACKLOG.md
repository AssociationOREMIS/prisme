# Backlog

Suites identifiées lors de l'audit du design system (2026-09-08), volontairement non traitées dans l'immédiat. Voir `TESTING.md` pour la checklist de validation de ce qui a déjà été corrigé.

## Corrigé depuis l'audit (2026-09-09, via l'app de test `forge`)

Ces bugs ont été trouvés en branchant réellement `PrDataTable`/`usePrForm`/`PrDialog`/`PrToast` dans une app Laravel (`/users` dans `forge`, voir `TESTING.md`) — pas via l'audit statique du 09-08.

- **Popovers invisibles dans une Dialog/AlertDialog/Sheet** : `PrSelect`, `PrCombobox`, `PrDropdownMenu`, `PrHoverCard`, `PrTooltip`, `PrPopover` étaient tous en `z-[70]`, sous le contenu des modales (`z-[80]`/`z-[90]`). Un `<PrSelect>` dans un formulaire affiché en `<PrDialog>` (cas très courant : modale d'édition) rendait son menu inutilisable. Corrigé en passant ces six composants à `z-[95]` (au-dessus des modales, sous `PrToast` à `z-[100]`).
- **`PrToast` : la barre de progression a un timer, mais rien ne le pause/reprend** : ajouté un prop `variant` (`info`/`success`/`warning`/`danger`, couleur icône + bordure + barre de progression) et une barre de progression CSS synchronisée sur `duration`.
- **Bundle : `usePrForm`/`fromLaravelErrors` forçaient à embarquer tout le registre de composants** : ces exports ne venaient que de l'entrée principale (`@oremis/prisme`), qui importe `componentRegistry` (tous les composants, ~380 Ko). Un consommateur qui ne veut qu'un formulaire (pas de DataTable, pas de Dialog...) payait quand même ce poids. Ajout d'un export dédié `@oremis/prisme/composables/*` (mirror du pattern `./components/*`) — le chunk d'une page consommatrice avec juste un formulaire est passé de ~386 Ko à ~10 Ko dans `forge`.

## Nouveau gotcha, pas un bug (à documenter au lecteur du README)

- **Wrapper `display:grid` sans `grid-template-columns` explicite autour d'un composant large (`PrDataTable`, formulaire avec beaucoup de champs)** : la piste implicite se dimensionne sur le contenu le plus large et déborde de son conteneur (CSS Grid blowout), même avec `min-width:0` sur le conteneur lui-même (qui ne protège que sa propre boîte, pas sa piste interne). `PrDataTable` et les autres composants Prisme utilisent volontairement `flex flex-col` en interne pour cette raison — les consommateurs devraient faire pareil pour empiler verticalement plusieurs composants Prisme, pas `grid` nu. À documenter dans le README plutôt qu'à "corriger" (ce n'est pas un bug Prisme).

## Investigué le 2026-09-09, pas de bug confirmé

- **`PrToast` qui paraissait "bloqué" (ne disparaît pas après `duration`) quand créé juste avant la fermeture d'une `PrDialog`** : soupçonné plus tôt dans la session suite à une observation dans `forge` (toast de succès après modification vs toast de suppression). Un contournement (fermer la Dialog *avant* de pousser le toast) avait été appliqué côté `forge`, puis retiré après investigation :
  - Code source de Reka UI (`ToastRoot.vue`, `ToastRootImpl.vue`, `ToastViewport.vue`) lu en détail : le mécanisme (`useVModel`, timer `startTimer`/`handleClose`, pause globale `isClosePausedRef` sur focus/hover du viewport) est cohérent et ne présente pas d'interaction évidente avec `PrDialog`.
  - Reproduit sans succès après de multiples tentatives : action isolée, séquence réaliste (annuler une suppression puis modifier 3 fois de suite), différentes tailles d'écran (desktop 1280px, mobile 390px), et contre le **build de production pur** (Vite dev/HMR désactivé).
  - Conclusion : très probablement un artefact du Hot Module Replacement de Vite pendant l'édition de code en direct au moment où le bug a été observé, pas un défaut réel de Prisme ni de `forge`. Le contournement dans `forge` a été retiré (`resources/js/pages/users/Index.vue`, ordre naturel restauré : pousser le toast puis fermer la modale).
  - À rouvrir seulement si le symptôme revient en dehors d'une session de développement avec HMR actif.

## Décisions produit à prendre avant implémentation

- **Harmonisation des APIs de contrôle booléen** : `modelValue` (Accordion), `checked`/`update:checked` (Checkbox, Switch), `pressed`/`update:pressed` (Toggle), `open`/`update:open` (Collapsible, Dialog, Sheet, Popover, Toast, AlertDialog, DropdownMenu). Un `v-model` nu ne marche que sur Accordion ; partout ailleurs il faut `v-model:checked`/`v-model:pressed`/`v-model:open`. Ajouter un alias `modelValue`/`update:modelValue` en plus du prop nommé est possible mais risque de désync entre deux sources de vérité — nécessite une vraie décision d'API, pas un fix ponctuel.
- **`PrFileUpload` : upload réel avec progress** : le composant ne fait que collecter des `File[]` côté client. Pas de state `uploading`/`progress`, pas de mapping des erreurs 422 par fichier (juste un `error` global). À concevoir si un cas d'usage Laravel concret (upload direct vs via un form classique) se présente.
- **`PrCommand` : accessibilité clavier** : pas de liaison ARIA combobox↔listbox (`aria-expanded`, `aria-controls`, `aria-activedescendant`), pas de navigation flèches (Tab requis pour parcourir les résultats). Refonte plus large qu'un correctif.
- **`usePrForm` : `isSubmitting`** : pas d'état de chargement exposé pendant `handleSubmit`. Feature à ajouter si le besoin se confirme (actuellement documentée comme absente dans `TESTING.md`). Contournement validé dans `forge` : un `ref` `isSubmitting` local géré par le consommateur, passé au prop `loading` de `PrButton`.

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

- [x] Valider les correctifs de la session du 09-08 en conditions réelles (app Laravel de test `forge`) — cf. `TESTING.md`. Fait le 2026-09-09 pour DataTable serverSide (forme wrappée), usePrForm (erreurs 422 à plat, pas de champ tableau dynamique testé), PrDialog/PrAlertDialog/PrToast en usage réel. Voir la nouvelle section "Corrigé depuis l'audit" ci-dessus pour ce que ça a fait remonter.
- [x] Investiguer le bug `PrToast` qui semblait bloqué s'il était créé pendant qu'une Dialog est encore ouverte — non reproduit après investigation, très probablement un artefact HMR (cf. "Investigué le 2026-09-09" ci-dessus). Contournement retiré de `forge`.
- [ ] Documenter dans le README le gotcha "grid blowout" (wrapper `display:grid` sans colonnes explicites autour d'un composant large) et recommander `flex flex-col` pour empiler des composants Prisme verticalement.
- [ ] Décider si une release `0.8.0` est justifiée vu le volume de correctifs (dont 2 corruptions de données silencieuses : `usePrForm.isDirty`/`reset`, décalage de date `PrCalendar`, plus les fixes z-index/composables/toast variant du 09-09).
- [ ] Revenir sur les items de ce backlog une fois la validation terminée.
