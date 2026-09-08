# Checklist de tests manuels

Ce document liste ce qui doit être vérifié manuellement (ou via une app Laravel de test) avant de considérer les correctifs récents comme validés. La suite automatisée (`npm test`, 28 tests unitaires + 133 tests Storybook) couvre la logique pure ; elle ne couvre pas le rendu réel dans un navigateur, la soumission de formulaire native, ni l'intégration Blade.

## DataTable — mode `serverSide`

- [ ] Brancher `PrDataTable` en `serverSide` sur un vrai endpoint Laravel `Model::paginate()` (forme brute *et* forme wrappée en API Resource `{ data, meta }`) via `fromLaravelPaginator`.
- [ ] Changer de page, de tri, de taille de page et de filtre : vérifier que chaque action déclenche bien un seul appel réseau avec les bons paramètres (le filtre est débouncé à 300ms côté composant).
- [ ] Vérifier l'état `isLoading` pendant le fetch (skeleton rows).
- [ ] Vérifier que la sélection de lignes (`selectedRows`) se comporte correctement quand on change de page côté serveur (les lignes sélectionnées hors page courante ne doivent pas disparaître silencieusement du modèle).
- [ ] Réduire `totalRows` côté serveur pendant qu'on est sur une page qui n'existe plus (ex: suppression en masse) : vérifier que le composant retombe bien sur la dernière page valide et émet `update:page`.

## usePrForm

- [ ] Formulaire avec un champ tableau dynamique (ajout/suppression de lignes) : vérifier que `isDirty` ne reste plus bloqué à `true` en permanence, et que `reset()` restaure bien l'état initial sans le corrompre après plusieurs cycles.
- [ ] Simuler une réponse 422 Laravel avec des clés imbriquées (`items.0.name`, `items.1.email`) sur un schéma qui déclare `items.name` : vérifier que le message atterrit sur le bon champ.
- [ ] Simuler une réponse 422 avec une clé qui ne correspond à aucun champ du schéma : vérifier que le message apparaît dans `generalErrors` (à afficher quelque part dans l'UI — ce n'est pas automatique, c'est au consommateur de le faire).
- [ ] Vérifier qu'il n'y a **pas** d'état `isSubmitting` intégré : le bouton de soumission doit être désactivé manuellement par l'app consommatrice pendant `handleSubmit`. (Cf. BACKLOG.md — feature manquante, pas un bug.)

## PrCalendar — fuseau horaire

- [ ] Sélectionner une date en fin de journée locale (23h+, via un environnement système en `Europe/Paris` ou toute zone UTC+) et vérifier que la valeur émise correspond bien au jour cliqué (pas de décalage de -1 jour côté backend).
- [ ] Ouvrir le calendrier avec une `modelValue` déjà définie (ex: `2026-01-01`) et vérifier que le mois affiché au premier rendu est le bon, sans décalage.

## Soumission de formulaire native (sans JS, `<form method="POST">` Blade classique)

- [ ] `PrCheckbox` / `PrSwitch` : plusieurs cases avec `name="options[]"` et des `value` distincts → vérifier côté Laravel (`$request->input('options')`) que le tableau contient bien les valeurs cochées.
- [ ] `PrTagInput` avec `name="tags[]"` : ajouter plusieurs tags, soumettre le formulaire, vérifier que Laravel reçoit bien le tableau complet des tags validés (pas le texte de saisie en cours).
- [ ] `PrCombobox` en mode simple et en mode `multiple`, avec `name` renseigné : vérifier la valeur reçue côté serveur dans les deux cas.
- [ ] `PrToggleGroup` en `type="single"` et `type="multiple"`, avec `name` renseigné : vérifier la valeur reçue côté serveur.
- [ ] `PrDatePicker` avec `name` renseigné : vérifier que la date sélectionnée arrive bien côté serveur.
- [ ] `PrInput` / `PrNumberInput` / `PrTextarea` / `PrTagInput` : passer `autocomplete`, `maxlength`, `pattern`, `inputmode` ou un `data-*` custom et vérifier via l'inspecteur DOM que l'attribut est bien sur le `<input>`/`<textarea>` réel, pas sur le `<div>` englobant.

## Accessibilité (lecteur d'écran)

- [ ] `PrAlert` en variante `danger`/`warning` : vérifier qu'un lecteur d'écran (NVDA/VoiceOver) interrompt et annonce immédiatement le message (role="alert").
- [ ] `PrSlider` avec `label` : cliquer sur le label et vérifier que le focus va bien sur le curseur ; vérifier que le lecteur d'écran annonce le label fourni (pas "Valeur" en dur) quand on focus le curseur.
- [ ] `PrThemeToggle` avec une prop `label` custom : vérifier que le lecteur d'écran annonce ce label plutôt que le message dynamique par défaut.

## RTL (`dir="rtl"`)

- [ ] Passer une page de démo en `dir="rtl"` et vérifier visuellement : chevrons de `PrCalendar`/`PrCarousel`/`PrPagination` inversés, tiroir mobile de `PrSidebar` ancré à droite (en dessous de 780px de large).

## Thème / Navbar

- [ ] Dans une app consommatrice, redéfinir `--pr-color-navbar`, `--pr-color-navbar-text` et `--pr-color-navbar-muted` et vérifier que `PrNavbar` reflète bien ces valeurs en thème clair **et** sombre (avant le fix, le sombre divergeait du token).
- [ ] Injecter `getPrThemeInitScript()` dans le `<head>` Blade (cf. section README "Éviter le flash de theme") et faire un hard-reload avec le thème sombre choisi : vérifier qu'il n'y a aucun flash blanc avant que la page s'affiche en sombre.

## Navigation

- [ ] `PrSidebarItem` / `PrSidebarSubItem` / `PrNavigationMenu` sans prop `active` explicite, sur des routes Blade réelles avec sous-pages (ex: `/settings` et `/settings/security`) : vérifier que l'item parent reste actif sur les sous-routes.
- [ ] Vérifier qu'un `href` qui est un préfixe accidentel d'un autre (ex: `/settings` vs `/settings-other`) ne déclenche pas un faux positif.

## Pagination

- [ ] `PrPagination` avec un `pageCount` élevé (ex: 500) : vérifier que la troncature `1 … 49 50 51 … 500` s'affiche et se met à jour correctement en naviguant vers les extrémités.

## FileUpload

- [ ] Déposer plus de fichiers que la limite `maxFiles` restante (ex: `maxFiles=3`, 2 déjà présents, dépôt de 5 fichiers d'un coup) : vérifier qu'exactement 1 fichier est accepté et 4 rejetés (avant le fix, le calcul pouvait accepter les mauvais fichiers).
