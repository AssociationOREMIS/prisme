# Checklist de tests manuels

Ce document liste ce qui doit être vérifié manuellement (ou via une app Laravel de test) avant de considérer les correctifs récents comme validés. La suite automatisée (`npm test`, 28 tests unitaires + 133 tests Storybook) couvre la logique pure ; elle ne couvre pas le rendu réel dans un navigateur, la soumission de formulaire native, ni l'intégration Blade.

## DataTable — mode `serverSide`

- [x] Brancher `PrDataTable` en `serverSide` sur un vrai endpoint Laravel `Model::paginate()` **forme wrappée en API Resource `{ data, meta }`** via `fromLaravelPaginator`. Validé le 2026-09-09 dans `forge` (`/users`, 51 lignes réelles, pagination sur 6 pages). — La **forme brute** (non wrappée) n'a volontairement pas été rebranchée séparément (voir `forge`'s `UserController::data()`, qui n'utilise que la forme wrappée, jugée plus idiomatique côté Laravel) : reste non testée en conditions réelles.
- [x] Changer de page, de tri (colonnes Nom/Email/Statut) et de filtre (par nom) : chaque action déclenche bien un rechargement avec les bons résultats. Validé fonctionnellement dans `forge`. — Le débounce 300ms du filtre et le fait qu'une seule requête réseau parte par action n'ont pas été vérifiés précisément (pas d'inspection de l'onglet réseau).
- [ ] Vérifier l'état `isLoading` pendant le fetch (skeleton rows) — pas observé spécifiquement (transitoire, pas capturé).
- [ ] Vérifier que la sélection de lignes (`selectedRows`) se comporte correctement quand on change de page côté serveur — non testé (`forge` n'utilise pas `selectable` sur son DataTable).
- [ ] Réduire `totalRows` côté serveur pendant qu'on est sur une page qui n'existe plus (ex: suppression en masse) : vérifier que le composant retombe bien sur la dernière page valide et émet `update:page` — non testé.

## usePrForm

- [ ] Formulaire avec un champ tableau dynamique (ajout/suppression de lignes) : vérifier que `isDirty` ne reste plus bloqué à `true` en permanence, et que `reset()` restaure bien l'état initial sans le corrompre après plusieurs cycles. — Non testé : le champ tableau de `forge` (`availabilities`, via `PrToggleGroup type="multiple"`) est un tableau de valeurs scalaires, pas un tableau de lignes ajoutées/supprimées dynamiquement — scénario différent de celui visé ici.
- [ ] Simuler une réponse 422 Laravel avec des clés imbriquées (`items.0.name`, `items.1.email`) sur un schéma qui déclare `items.name` — non testé (le formulaire `forge` n'a pas de champ imbriqué de ce type).
- [ ] Simuler une réponse 422 avec une clé qui ne correspond à aucun champ du schéma : vérifier que le message apparaît dans `generalErrors` — le rendu (`PrAlert` affichant `generalErrors`) est bien câblé et fonctionnel dans `forge`, mais le scénario précis (clé 422 non déclarée dans le schéma) n'a pas été spécifiquement déclenché en conditions réelles.
- [x] Vérifier qu'il n'y a **pas** d'état `isSubmitting` intégré : le bouton de soumission doit être désactivé manuellement par l'app consommatrice pendant `handleSubmit`. Confirmé — `forge` gère un `ref isSubmitting` local passé au prop `loading` de `PrButton`. (Cf. BACKLOG.md — feature manquante, pas un bug.)

## PrDialog / PrAlertDialog / PrToast (nouveau, testé le 2026-09-09 via `forge`)

- [x] `PrSelect` (ou tout popover) à l'intérieur d'une `PrDialog` : le menu déroulant s'ouvre bien au-dessus de la modale et reste cliquable. Cassé avant le fix z-index de cette session (cf. `BACKLOG.md`), validé après sur mobile (360px) et desktop.
- [x] `PrDialog` utilisée comme modale d'édition (formulaire pré-rempli, boutons dans le slot `footer`, fermeture via la croix/Annuler/Escape) : fonctionne correctement, y compris en responsive.
- [x] `PrAlertDialog` pour une confirmation de suppression : attention, ses boutons `confirm`/`cancel` ferment la modale eux-mêmes (`AlertDialogAction`/`AlertDialogCancel` de Reka UI) en émettant `update:open(false)` **en même temps** que `@confirm`/`@cancel` — un consommateur qui vide sa donnée "cible" dans le handler `update:open` va la perdre avant que `@confirm` ne s'exécute (bug reproduit et corrigé côté `forge` : séparer l'état visuel de la modale de la donnée métier, ne vider cette dernière qu'après l'action réellement effectuée).
- [x] `PrToast` avec `variant` (`success`/`danger`) et barre de progression : rendu correct, couleurs conformes.
- [x] `PrToast` (`duration` par défaut) créé pendant qu'une `PrDialog` est encore ouverte, juste avant sa fermeture : disparaît bien après `duration`, y compris en séquence réaliste (plusieurs modifications à la suite) et contre le build de production. Un soupçon de bug ici plus tôt dans la session ne s'est pas confirmé — cf. `BACKLOG.md` § "Investigué le 2026-09-09".

## PrCalendar — fuseau horaire

- [ ] Sélectionner une date en fin de journée locale (23h+, via un environnement système en `Europe/Paris` ou toute zone UTC+) et vérifier que la valeur émise correspond bien au jour cliqué (pas de décalage de -1 jour côté backend).
- [ ] Ouvrir le calendrier avec une `modelValue` déjà définie (ex: `2026-01-01`) et vérifier que le mois affiché au premier rendu est le bon, sans décalage.

## Soumission de formulaire native (sans JS, `<form method="POST">` Blade classique)

Testé le 2026-09-09 via une page de test dédiée dans `forge` (`/dev/native-form-test`, route + contrôleur + vue Blade + îlot Vue séparés, aucune interférence avec la démo `/users`) : formulaire `<form method="POST">` **réel**, sans `usePrForm`, sans axios, sans `@submit.prevent`, piloté par un navigateur Playwright réel (remplissage de chaque composant, clic sur le bouton `submit`, lecture du payload JSON reçu côté Laravel via `$request->all()`).

- [x] `PrCheckbox` / `PrSwitch` : plusieurs cases avec `name="options[]"` et des `value` distincts → vérifié, Laravel reçoit `options: ["a", "b"]`. `PrSwitch` avec `name="newsletter"` reçu comme `"on"`.
- [x] `PrTagInput` avec `name="tags[]"` : ajout de deux tags via l'UI (saisie + Entrée), Laravel reçoit `tags: ["benevolat", "logistique"]` (pas le texte de saisie en cours, uniquement les tags validés).
- [x] `PrCombobox` en mode simple et en mode `multiple`, avec `name` renseigné : simple → `country: "fr"` ; multiple → `skills: ["accueil", "communication"]`. Les deux modes utilisent des inputs cachés gérés par Prisme lui-même (pas par reka-ui), avec le même `name` répété par valeur pour le mode multiple.
- [x] `PrToggleGroup` en `type="single"` et `type="multiple"`, avec `name` renseigné : single → `plan: "yearly"` ; multiple → `days: ["mon", "fri"]`. Point notable (pas un bug) : en `type="multiple"`, l'input caché généré par reka-ui indexe le nom (`days[0]`, `days[1]`, recalculé à chaque changement de sélection) plutôt que de répéter `days[]` — au global équivalent côté PHP (tableau séquentiel identique), mais une convention différente de celle de `PrCombobox`/`PrTagInput`/`PrCheckbox` qui répètent le même `name`. À garder en tête si un jour on inspecte le payload brut (hors `$request->input()`).
- [x] `PrDatePicker` avec `name` renseigné : date sélectionnée (`2026-12-25`) reçue telle quelle côté serveur.
- [x] `PrInput` / `PrNumberInput` / `PrTextarea` : `autocomplete`, `maxlength`, `pattern`, `inputmode` et `data-*` custom vérifiés via l'inspecteur DOM (évaluation JS dans la page) — tous atterrissent bien sur l'élément natif (`<input>`/`<textarea>`), pas sur le `<div>` englobant. Bonus : le `pattern="[a-z]+"` a effectivement bloqué la soumission native du navigateur sur une valeur non conforme (`bénévole`), confirmant que la validation HTML5 fonctionne de bout en bout. `PrTagInput` non re-testé spécifiquement sur ce point (pas d'attribut custom passé dans ce test), mais son `<input>` de saisie a `v-bind="$attrs"` donc le même mécanisme s'applique.
- [x] Bug trouvé et corrigé au passage (sans lien direct avec la checklist, découvert en préparant ce test) : `PrTagInput` et `PrNumberInput` existaient et étaient buildés (`@oremis/prisme/components/atoms/TagInput`, `.../NumberInput`) mais étaient absents de `src/components/registry.ts` — invisibles à `app.use(Prisme)` (enregistrement global) et à `componentPaths`/`paths.generated.ts`. Ajoutés au registre. Voir `BACKLOG.md`.

Page de test conservée dans `forge` (`resources/views/dev/native-form-test.blade.php`, `resources/js/pages/native-form-test.js` + `native-form-test/Index.vue`, route `dev.native-form-test`) — pas commitée, utile comme page de régression manuelle pour un futur upgrade de Prisme. À supprimer si jugée inutile à terme.

## Accessibilité (lecteur d'écran)

- [ ] `PrAlert` en variante `danger`/`warning` : vérifier qu'un lecteur d'écran (NVDA/VoiceOver) interrompt et annonce immédiatement le message (role="alert").
- [ ] `PrSlider` avec `label` : cliquer sur le label et vérifier que le focus va bien sur le curseur ; vérifier que le lecteur d'écran annonce le label fourni (pas "Valeur" en dur) quand on focus le curseur.
- [ ] `PrThemeToggle` avec une prop `label` custom : vérifier que le lecteur d'écran annonce ce label plutôt que le message dynamique par défaut.

## Responsive (testé le 2026-09-09 via `forge`, Chromium/Playwright headless)

- [x] Pas de scroll horizontal de page à 360px, 390px, 780px et 1440px de large sur une page avec `PrDataTable` + formulaire complexe (`PrToggleGroup` 7 items, `PrSelect`) + `PrDialog`. Un bug d'app consommatrice (wrapper `display:grid` sans colonnes explicites, cf. `BACKLOG.md`) faisait déborder la page et sortir `PrNavbar` du cadre au scroll horizontal — corrigé côté `forge`, pas un bug Prisme, mais bon réflexe à vérifier sur toute nouvelle page.
- [x] `PrSidebar` en dessous de 780px : passe bien en rail icônes réduit (`data-collapsed`/`max-[780px]`), le bouton `PrSidebarCollapseButton` fonctionne.
- [x] `PrDataTable` sur petit écran : les colonnes en trop restent accessibles via le scroll horizontal interne (`.pr-data-table__scroll`) sans faire déborder la page.
- [ ] Tiroir mobile `PrSidebar` en overlay (`data-mobile-expanded`) : pas testé (seul le mode rail réduit a été exercé, pas le mode tiroir déployé par-dessus le contenu).

## RTL (`dir="rtl"`)

- [ ] Passer une page de démo en `dir="rtl"` et vérifier visuellement : chevrons de `PrCalendar`/`PrCarousel`/`PrPagination` inversés, tiroir mobile de `PrSidebar` ancré à droite (en dessous de 780px de large).

## Thème / Navbar

- [ ] Dans une app consommatrice, redéfinir `--pr-color-navbar`, `--pr-color-navbar-text` et `--pr-color-navbar-muted` et vérifier que `PrNavbar` reflète bien ces valeurs en thème clair **et** sombre (avant le fix, le sombre divergeait du token).
- [ ] Injecter `getPrThemeInitScript()` dans le `<head>` Blade (cf. section README "Éviter le flash de theme") et faire un hard-reload avec le thème sombre choisi : vérifier qu'il n'y a aucun flash blanc avant que la page s'affiche en sombre.

## Navigation

- [ ] `PrSidebarItem` / `PrSidebarSubItem` / `PrNavigationMenu` sans prop `active` explicite, sur des routes Blade réelles avec sous-pages (ex: `/settings` et `/settings/security`) : vérifier que l'item parent reste actif sur les sous-routes.
- [ ] Vérifier qu'un `href` qui est un préfixe accidentel d'un autre (ex: `/settings` vs `/settings-other`) ne déclenche pas un faux positif.
- [x] Piège d'intégration (pas un bug Prisme) : `PrSidebarItem` compare `href` à `window.location.pathname`, qui est toujours un **chemin relatif**. Si `href` est généré via `route('...')` côté Laravel (URL absolue par défaut), l'item n'est jamais actif. Trouvé et corrigé dans `forge` en passant `route('users.index', absolute: false)`.

## Pagination

- [ ] `PrPagination` avec un `pageCount` élevé (ex: 500) : vérifier que la troncature `1 … 49 50 51 … 500` s'affiche et se met à jour correctement en naviguant vers les extrémités.

## FileUpload

- [ ] Déposer plus de fichiers que la limite `maxFiles` restante (ex: `maxFiles=3`, 2 déjà présents, dépôt de 5 fichiers d'un coup) : vérifier qu'exactement 1 fichier est accepté et 4 rejetés (avant le fix, le calcul pouvait accepter les mauvais fichiers).
