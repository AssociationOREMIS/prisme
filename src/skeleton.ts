import { defineComponent, h, type Component, type VNode } from 'vue'

/**
 * Colors of the loading placeholders, light and dark: the theme tokens' values written out,
 * since these styles paint before Prisme's stylesheet has loaded. `skeleton.test.ts` checks
 * they still match themes.css.
 */
export const PR_SKELETON_COLORS = {
  light: { navbar: '#0d2c99', background: '#f8fafc', border: '#e2e8f0', base: '#f1f5f9', shine: '#e2e8f0' },
  dark: { navbar: '#040e32', background: '#12131b', border: '#2c2d3c', base: '#2c2d3c', shine: '#3a3b4d' },
} as const

type SkeletonColors = (typeof PR_SKELETON_COLORS)[keyof typeof PR_SKELETON_COLORS]

const variables = (colors: SkeletonColors) => [
  `--pr-sk-navbar: ${colors.navbar};`,
  `--pr-sk-background: ${colors.background};`,
  `--pr-sk-border: ${colors.border};`,
  `--pr-sk-base: ${colors.base};`,
  `--pr-sk-shine: ${colors.shine};`,
].join(' ')

/**
 * CSS of the loading placeholders, to inline in `<head>` before anything else: it paints while
 * the app's CSS, Prisme's styles and Vue still load. Like `getPrThemeInitScript()`, an app writes
 * it into a Blade partial at install (`<style>${getPrSkeletonStyles()}</style>`).
 *
 * - Bones: `<span class="pr-sk pr-sk--text" aria-hidden="true">`, shapes `text`, `title`, `label`,
 *   `field`, `textarea`, `button`, `switch`, `icon`, `block`, `circle`; `pr-sk-stack` and
 *   `pr-sk-row` line them up.
 * - Whole page: `.pr-sk-page` right after `<div id="app" v-cloak>`, shown until Vue mounts, with
 *   `__navbar`, `__sidebar`, `__content` (`--centered` without sidebar) and `__card`, sized like
 *   `PrAppShell`. `pr-sk-sr-only` holds its "loading" status for screen readers.
 */
export function getPrSkeletonStyles(): string {
  return `
:root { ${variables(PR_SKELETON_COLORS.light)} }
:root[data-pr-theme="dark"] { ${variables(PR_SKELETON_COLORS.dark)} }
@media (prefers-color-scheme: dark) { :root:not([data-pr-theme]) { ${variables(PR_SKELETON_COLORS.dark)} } }
body { margin: 0; background: var(--pr-sk-background); }
@keyframes pr-sk-shine { to { background-position-x: -200%; } }
.pr-sk { display: block; flex-shrink: 0; border-radius: 0.375rem; background: linear-gradient(90deg, var(--pr-sk-base), var(--pr-sk-shine), var(--pr-sk-base)) 0 0 / 200% 100%; animation: pr-sk-shine 1.4s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .pr-sk { animation: none; } }
.pr-sk--text { height: 0.875rem; width: 100%; }
.pr-sk--title { height: 2.5rem; width: min(22rem, 70%); }
.pr-sk--label { height: 0.875rem; width: 8rem; }
.pr-sk--field { height: 2.5rem; width: 100%; }
.pr-sk--textarea { height: 6rem; width: 100%; }
.pr-sk--button { height: 2.375rem; width: 9rem; display: inline-block; vertical-align: middle; }
.pr-sk--switch { height: 1.25rem; width: 2.25rem; border-radius: 999px; }
.pr-sk--icon { height: 2.25rem; width: 2.25rem; border-radius: 0.5rem; }
.pr-sk--block { height: 4rem; width: 100%; }
.pr-sk--circle { height: 2rem; width: 2rem; border-radius: 999px; }
.pr-sk-stack { display: flex; flex-direction: column; gap: 0.5rem; }
.pr-sk-row { display: flex; align-items: center; gap: 0.75rem; }
.pr-sk-page { display: none; }
#app[v-cloak] + .pr-sk-page { display: grid; grid-template-columns: auto minmax(0, 1fr); grid-template-rows: 3.75rem minmax(0, 1fr); min-height: 100svh; }
.pr-sk-page__navbar { grid-column: 1 / -1; background: var(--pr-sk-navbar); }
.pr-sk-page__sidebar { display: flex; flex-direction: column; gap: 1.25rem; width: 17.5rem; box-sizing: border-box; padding: 1.25rem 1rem; border-right: 1px solid var(--pr-sk-border); }
.pr-sk-page__content { display: flex; flex-direction: column; gap: 1.5rem; min-width: 0; padding: 2rem; }
.pr-sk-page__content--centered { grid-column: 1 / -1; box-sizing: border-box; width: 100%; max-width: 36rem; margin-inline: auto; padding: 4rem 1rem; }
.pr-sk-page__card { display: flex; flex-direction: column; gap: 0.75rem; padding: 1.5rem; border: 1px solid var(--pr-sk-border); border-radius: 0.5rem; }
@media (width < 780px) {
  .pr-sk-page__sidebar { width: 4.375rem; align-items: center; padding-inline: 0; }
  .pr-sk-page__sidebar .pr-sk-stack { display: none; }
  .pr-sk-page__content { padding: 1rem; }
}
.pr-sk-sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
`.trim()
}

const bone = (shape: string, style?: string): VNode => h('span', { class: `pr-sk pr-sk--${shape}`, style, 'aria-hidden': 'true' })

const labelled = (shape: string): Component => defineComponent(() => () => h('div', { class: 'pr-sk-stack' }, [bone('label'), bone(shape)]))

const inline = (shape: string, width: string): Component => defineComponent(() => () => h('div', { class: 'pr-sk-row' }, [bone(shape, width), bone('text', 'width: 10rem')]))

// Vue renders a placeholder without the component's props: each one draws the usual shape of
// that component, not its content. A closed dialog only shows its trigger, a button.
const shapes: Record<string, Component> = {
  PrSelect: labelled('field'),
  PrCombobox: labelled('field'),
  PrDatePicker: labelled('field'),
  PrTextarea: labelled('textarea'),
  PrSwitch: inline('switch', ''),
  PrCheckbox: inline('text', 'width: 1rem; height: 1rem'),
  PrDialog: defineComponent(() => () => bone('button')),
  PrAlertDialog: defineComponent(() => () => bone('button')),
}

/**
 * The placeholder of a lazily loaded Prisme component while its chunk loads, drawn with
 * `getPrSkeletonStyles()`'s classes, or undefined to leave the space empty (toasts, menus...):
 * `registerPrisme(app, { loading: prSkeletonFor })`.
 */
export function prSkeletonFor(name: string): Component | undefined {
  return shapes[name]
}
