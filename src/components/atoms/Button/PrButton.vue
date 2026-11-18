<script setup lang="ts">
import { computed, useAttrs, useSlots, type Component } from 'vue'
import { PrLink, type PrLinkTo } from '../Link'
import { PrSpinner } from '../Spinner'
import { PrTooltip } from '../../molecules/Tooltip'
import { prButtonActions, type PrButtonAction } from './actions'
import { usePrMessages } from '../../../i18n/context'

export interface PrButtonProps {
  /**
   * Default `primary`, `ghost` with an `action`. `link`: text in the primary color, no
   * background, underlined on hover, for « Lire l'article → » or « Voir tout ». `cta`: the call to
   * action of a public page (« Adhérer à OREMIS »), a pill in a primary gradient, in capitals.
   */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'link' | 'cta'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  /** Renders a link (`<a>`) styled as a button: for navigation, a button inside a link is not accessible. */
  href?: string
  /** Route of the app's Vue Router: a link that navigates without reloading the page (see `PrLink`). */
  to?: PrLinkTo
  /**
   * A halo that pulses around the button, to draw the eye to the one action of a page. It plays
   * once only when the user asks for less motion. Keep it to one button per page.
   */
  pulse?: boolean
  /** Icon (a Lucide component) shown before the label, or after it with `icon-position="end"`. */
  icon?: Component
  /** Where the icon goes next to the label: `start` (default) or `end` (an arrow after « Lire l'article »). */
  iconPosition?: 'start' | 'end'
  /**
   * Name of an icon-only button (`icon` and no label in the slot): a square button whose name is
   * `label`, also shown as a tooltip. Row actions of a table: Voir, Modifier, Supprimer...
   */
  label?: string
  /** `danger` turns a discreet button (`ghost`, `secondary`) red: Supprimer, Retirer, Rejeter in a table. */
  tone?: 'default' | 'danger'
  /** A usual action (view, edit, delete...): its icon, label and tone, see `prButtonActions`. */
  action?: PrButtonAction
}

// The attributes given to the button (@click, class, data-*, form...) go to the actual <button>/<a>:
// an icon-only button's root is its tooltip, which would otherwise receive them and swallow the click.
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<PrButtonProps>(), {
  variant: undefined,
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  href: undefined,
  to: undefined,
  pulse: false,
  icon: undefined,
  iconPosition: 'start',
  label: undefined,
  tone: undefined,
  action: undefined,
})

const messages = usePrMessages()

const preset = computed(() => (props.action ? prButtonActions[props.action] : undefined))
const variant = computed(() => props.variant ?? (props.action ? 'ghost' : 'primary'))
const icon = computed(() => props.icon ?? preset.value?.icon)
const label = computed(() => props.label ?? (props.action ? messages.actions[props.action] : undefined))
const tone = computed(() => props.tone ?? (preset.value && 'tone' in preset.value ? preset.value.tone : 'default'))

const slots = useSlots()
const isIconOnly = computed(() => Boolean(icon.value && !slots.default))

if (icon.value && !slots.default && !label.value) {
  console.warn('[prisme] PrButton: an icon-only button needs a `label`, its accessible name and tooltip.')
}

const isUnavailable = computed(() => props.disabled || props.loading)
const isLink = computed(() => props.href !== undefined || props.to !== undefined)
// A link that works goes through PrLink (plain <a>, or the router's link with `to`). A disabled
// one is an <a> without address: not focusable, not followed, announced as a disabled link.
const tag = computed(() => (isLink.value ? (isUnavailable.value ? 'a' : PrLink) : 'button'))
const linkProps = computed(() => (isLink.value && !isUnavailable.value ? { href: props.href, to: props.to } : {}))

// A loading button keeps the focus: `disabled` would drop it on <body> (a keyboard or screen reader
// user pressing « Confirmer » lost their place while the request ran). It is announced as
// unavailable (aria-disabled) and ignores clicks instead. An `aria-disabled` given by the app works
// the same way, for a button that must stay focusable (the last page's « Page suivante »).
const attrs = useAttrs()
const isAriaDisabled = computed(() => {
  const value = attrs['aria-disabled']
  return props.loading || (isLink.value && props.disabled) || value === true || value === 'true'
})
const isNativeDisabled = computed(() => !isLink.value && props.disabled)

function blockWhenAriaDisabled(event: Event) {
  if (!isAriaDisabled.value) return
  event.preventDefault()
  event.stopImmediatePropagation()
}

const buttonBaseClass = [
  'pr-button',
  // Fits its label on one line when there is room, wraps between words instead of overflowing on a
  // narrow screen. `break-word`, not `anywhere`: a word only breaks when it cannot fit at all, so a
  // table column never shrinks the button down to « Gé / rer ».
  'pr:relative pr:inline-flex pr:max-w-full pr:items-center pr:justify-center pr:text-center',
  'pr:border pr:border-transparent',
  'pr:font-bold pr:leading-[var(--pr-line-height-tight)] pr:no-underline pr:[overflow-wrap:break-word]',
  'pr:cursor-pointer pr:transition-[background-color,border-color,color,box-shadow]',
  'pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)]',
  'pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]',
  'pr:disabled:cursor-not-allowed pr:disabled:opacity-[0.58]',
  // A link has no `disabled`, and a loading button keeps the focus: aria-disabled, and no pointer
  // events so neither hover nor click.
  'pr:aria-disabled:pointer-events-none pr:aria-disabled:opacity-[0.58]',
  'pr:[&_svg]:shrink-0',
]

const buttonSizeClass: Record<NonNullable<PrButtonProps['size']>, string> = {
  sm: 'pr:min-h-[2rem] pr:px-[var(--pr-space-3)] pr:gap-[var(--pr-space-2)] pr:text-[length:var(--pr-font-size-sm)]',
  md: 'pr:min-h-[2.375rem] pr:px-[var(--pr-space-4)] pr:gap-[var(--pr-space-2)] pr:text-[length:var(--pr-font-size-md)]',
  lg: 'pr:min-h-[2.75rem] pr:px-[var(--pr-space-5)] pr:gap-[var(--pr-space-3)] pr:text-[length:var(--pr-font-size-lg)]',
}

/** Square buttons, the height of each size. */
const iconOnlySizeClass: Record<NonNullable<PrButtonProps['size']>, string> = {
  sm: 'pr:size-8 pr:min-h-0 pr:px-0',
  md: 'pr:size-[2.375rem] pr:min-h-0 pr:px-0',
  lg: 'pr:size-[2.75rem] pr:min-h-0 pr:px-0',
}

const iconSize: Record<NonNullable<PrButtonProps['size']>, number> = { sm: 16, md: 18, lg: 20 }

// The discreet variants in red, whole (two text colours on one element would leave the winner to
// Tailwind's order). A transparent red tint on hover reads on light and dark surfaces alike.
const dangerHover = 'pr:[&:not(:disabled):hover]:bg-[color-mix(in_srgb,var(--pr-color-danger)_12%,transparent)] pr:[&:not(:disabled):hover]:text-[color:var(--pr-color-danger-hover)]'
const dangerToneClass: Partial<Record<NonNullable<PrButtonProps['variant']>, string>> = {
  secondary: `pr:border-[var(--pr-color-border-strong)] pr:bg-[var(--pr-color-surface)] pr:text-[color:var(--pr-color-danger)] pr:shadow-[var(--pr-shadow-xs)] ${dangerHover}`,
  ghost: `pr:bg-transparent pr:text-[color:var(--pr-color-danger)] ${dangerHover}`,
  link: 'pr:bg-transparent pr:text-[color:var(--pr-color-danger)] pr:[&:not(:disabled):hover]:text-[color:var(--pr-color-danger-hover)]',
}

const buttonVariantClass: Record<NonNullable<PrButtonProps['variant']>, string> = {
  primary:
    'pr:bg-[var(--pr-color-primary)] pr:text-[color:var(--pr-color-primary-contrast)] pr:shadow-[var(--pr-shadow-xs)] pr:[&:not(:disabled):hover]:bg-[var(--pr-color-primary-hover)] pr:[&:not(:disabled):active]:bg-[var(--pr-color-primary-active)]',
  secondary:
    'pr:border-[var(--pr-color-border-strong)] pr:bg-[var(--pr-color-surface)] pr:text-[color:var(--pr-color-text)] pr:shadow-[var(--pr-shadow-xs)] pr:[&:not(:disabled):hover]:bg-[var(--pr-color-surface-subtle)]',
  ghost:
    'pr:bg-transparent pr:text-[color:var(--pr-color-text)] pr:[&:not(:disabled):hover]:bg-[var(--pr-color-surface-subtle)]',
  danger:
    'pr:bg-[var(--pr-color-danger-solid)] pr:text-[color:var(--pr-neutral-0)] pr:shadow-[var(--pr-shadow-xs)] pr:[&:not(:disabled):hover]:bg-[var(--pr-color-danger-solid-hover)]',
  link: 'pr:bg-transparent pr:text-[color:var(--pr-color-primary)] pr:[&:not(:disabled):hover]:text-[color:var(--pr-color-primary-hover)]',
  // A pill in a gradient of the primary color, lifted on hover. The text keeps the primary contrast
  // color, readable on both ends of the gradient (checked in the contrast tests).
  cta:
    'pr-button--cta pr:rounded-[var(--pr-radius-full)] pr:bg-[linear-gradient(90deg,var(--pr-color-primary)_0%,var(--pr-color-primary-active)_100%)] pr:text-[color:var(--pr-color-primary-contrast)] pr:font-[family-name:var(--pr-font-heading)] pr:uppercase pr:tracking-[0.04em] pr:shadow-[0_0.75rem_1.5rem_color-mix(in_srgb,var(--pr-color-primary-active)_40%,transparent)] pr:transition-[transform,box-shadow] pr:[&:not(:disabled):hover]:-translate-y-0.5',
}

/** The call to action is roomier than a button of the same size. */
const ctaSizeClass: Record<NonNullable<PrButtonProps['size']>, string> = {
  sm: 'pr:px-[var(--pr-space-5)]',
  md: 'pr:min-h-[3rem] pr:px-[var(--pr-space-6)]',
  lg: 'pr:min-h-[3.5rem] pr:px-[var(--pr-space-8)]',
}

// The halo: a ring drawn by ::after that grows and fades out, every second. pointer-events-none so
// it never catches a click meant for the page around.
const pulseClass = "pr-button--pulse pr:after:pointer-events-none pr:after:absolute pr:after:inset-[-4px] pr:after:rounded-[inherit] pr:after:border-4 pr:after:border-[var(--pr-color-primary)] pr:after:opacity-0 pr:after:shadow-[0_0_3.75rem_color-mix(in_srgb,var(--pr-color-primary)_50%,transparent)] pr:after:content-[''] pr:after:animate-[pr-pulse-out_1s_ease-out_infinite] pr:forced-colors:after:hidden"

// A link reads as text: no side padding (it lines up with the text around it), a lighter weight,
// underlined on hover. It keeps the height of its size, a target of 24 px at least (WCAG 2.5.8).
// `w-fit`: in a column (a stack, an aside) it keeps the width of its text instead of stretching.
const linkClass = 'pr-button--link pr:w-fit pr:px-0 pr:font-semibold pr:[&:not(:disabled):hover]:underline pr:underline-offset-4'

const buttonClass = computed(() => [
  buttonBaseClass,
  buttonSizeClass[props.size],
  isIconOnly.value && iconOnlySizeClass[props.size],
  variant.value === 'link' && !isIconOnly.value && linkClass,
  // One radius class only: two on the same element leave the winner to the order of the CSS.
  variant.value === 'cta' ? ctaSizeClass[props.size] : 'pr:rounded-[var(--pr-radius-md)]',
  props.pulse && pulseClass,
  (tone.value === 'danger' && dangerToneClass[variant.value]) || buttonVariantClass[variant.value],
])
</script>

<template>
  <!-- A link when `href` or `to` is given. A disabled link drops its href (not focusable, not
       followed) and is announced as a disabled link. An icon-only button shows its label as a tooltip. -->
  <PrTooltip v-if="isIconOnly" :content="label" :disabled="isUnavailable">
    <component
      :is="tag"
      v-bind="{ ...$attrs, ...linkProps }"
      :class="buttonClass"
      :type="isLink ? undefined : type"
      :disabled="isNativeDisabled || undefined"
      :role="isLink && isUnavailable ? 'link' : undefined"
      :aria-disabled="isAriaDisabled ? 'true' : undefined"
      :aria-busy="loading ? 'true' : undefined"
      :aria-label="label"
      :data-loading="loading ? 'true' : 'false'"
      @click.capture="blockWhenAriaDisabled"
    >
      <span v-if="loading" class="pr-button__loader pr:absolute pr:inset-0 pr:inline-flex pr:items-center pr:justify-center" aria-hidden="true">
        <PrSpinner size="sm" :aria-label="messages.common.loading" />
      </span>
      <component :is="icon" class="pr-button__icon" :class="{ 'pr:opacity-0': loading }" :size="iconSize[size]" aria-hidden="true" />
    </component>
  </PrTooltip>
  <component
    :is="tag"
    v-else
    v-bind="{ ...$attrs, ...linkProps }"
    :class="buttonClass"
    :type="isLink ? undefined : type"
    :disabled="isNativeDisabled || undefined"
    :role="isLink && isUnavailable ? 'link' : undefined"
    :aria-disabled="isAriaDisabled ? 'true' : undefined"
    :aria-busy="loading ? 'true' : undefined"
    :data-loading="loading ? 'true' : 'false'"
    @click.capture="blockWhenAriaDisabled"
  >
    <span
      v-if="loading"
      class="pr-button__loader pr:absolute pr:inset-0 pr:inline-flex pr:items-center pr:justify-center"
      aria-hidden="true"
    >
      <PrSpinner size="sm" :aria-label="messages.common.loading" />
    </span>
    <!-- Hidden with opacity, not visibility: the label stays the button's accessible name while it loads. -->
    <span
      class="pr-button__content pr:inline-flex pr:items-center pr:justify-center pr:gap-[inherit]"
      :class="{ 'pr:opacity-0': loading }"
    >
      <component :is="icon" v-if="icon && iconPosition === 'start'" class="pr-button__icon" :size="iconSize[size]" aria-hidden="true" />
      <slot />
      <component :is="icon" v-if="icon && iconPosition === 'end'" class="pr-button__icon pr-button__icon--end" :size="iconSize[size]" aria-hidden="true" />
    </span>
  </component>
</template>
