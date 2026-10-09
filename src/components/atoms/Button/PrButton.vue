<script setup lang="ts">
import { computed, useSlots, type Component } from 'vue'
import { PrSpinner } from '../Spinner'
import { PrTooltip } from '../../molecules/Tooltip'
import { prButtonActions, type PrButtonAction } from './actions'

export interface PrButtonProps {
  /** Default `primary`, `ghost` with an `action`. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  /** Renders a link (`<a>`) styled as a button: for navigation, a button inside a link is not accessible. */
  href?: string
  /** Icon (a Lucide component) shown before the label. */
  icon?: Component
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
  icon: undefined,
  label: undefined,
  tone: undefined,
  action: undefined,
})

const preset = computed(() => (props.action ? prButtonActions[props.action] : undefined))
const variant = computed(() => props.variant ?? (props.action ? 'ghost' : 'primary'))
const icon = computed(() => props.icon ?? preset.value?.icon)
const label = computed(() => props.label ?? preset.value?.label)
const tone = computed(() => props.tone ?? (preset.value && 'tone' in preset.value ? preset.value.tone : 'default'))

const slots = useSlots()
const isIconOnly = computed(() => Boolean(icon.value && !slots.default))

if (icon.value && !slots.default && !label.value) {
  console.warn('[prisme] PrButton: an icon-only button needs a `label`, its accessible name and tooltip.')
}

const isUnavailable = computed(() => props.disabled || props.loading)

const buttonBaseClass = [
  'pr-button',
  // Fits its label on one line when there is room, wraps between words instead of overflowing on a
  // narrow screen. `break-word`, not `anywhere`: a word only breaks when it cannot fit at all, so a
  // table column never shrinks the button down to « Gé / rer ».
  'pr:relative pr:inline-flex pr:max-w-full pr:items-center pr:justify-center pr:text-center',
  'pr:border pr:border-transparent pr:rounded-[var(--pr-radius-md)]',
  'pr:font-semibold pr:leading-[var(--pr-line-height-tight)] pr:no-underline pr:[overflow-wrap:break-word]',
  'pr:cursor-pointer pr:transition-[background-color,border-color,color,box-shadow]',
  'pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)]',
  'pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]',
  'pr:disabled:cursor-not-allowed pr:disabled:opacity-[0.58]',
  // A link has no `disabled`: aria-disabled, and no pointer events so neither hover nor click.
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
}

const buttonClass = computed(() => [
  buttonBaseClass,
  buttonSizeClass[props.size],
  isIconOnly.value && iconOnlySizeClass[props.size],
  (tone.value === 'danger' && dangerToneClass[variant.value]) || buttonVariantClass[variant.value],
])
</script>

<template>
  <!-- A link when `href` is given. A disabled link drops its href (not focusable, not
       followed) and is announced as a disabled link. An icon-only button shows its label as a tooltip. -->
  <PrTooltip v-if="isIconOnly" :content="label" :disabled="isUnavailable">
    <component
      :is="href ? 'a' : 'button'"
      v-bind="$attrs"
      :class="buttonClass"
      :type="href ? undefined : type"
      :disabled="href ? undefined : isUnavailable"
      :href="href && !isUnavailable ? href : undefined"
      :role="href && isUnavailable ? 'link' : undefined"
      :aria-disabled="href && isUnavailable ? 'true' : undefined"
      :aria-busy="loading ? 'true' : undefined"
      :aria-label="label"
      :data-loading="loading ? 'true' : 'false'"
    >
      <span v-if="loading" class="pr-button__loader pr:absolute pr:inset-0 pr:inline-flex pr:items-center pr:justify-center" aria-hidden="true">
        <PrSpinner size="sm" label="Chargement" />
      </span>
      <component :is="icon" class="pr-button__icon" :class="{ 'pr:opacity-0': loading }" :size="iconSize[size]" aria-hidden="true" />
    </component>
  </PrTooltip>
  <component
    :is="href ? 'a' : 'button'"
    v-else
    v-bind="$attrs"
    :class="buttonClass"
    :type="href ? undefined : type"
    :disabled="href ? undefined : isUnavailable"
    :href="href && !isUnavailable ? href : undefined"
    :role="href && isUnavailable ? 'link' : undefined"
    :aria-disabled="href && isUnavailable ? 'true' : undefined"
    :aria-busy="loading ? 'true' : undefined"
    :data-loading="loading ? 'true' : 'false'"
  >
    <span
      v-if="loading"
      class="pr-button__loader pr:absolute pr:inset-0 pr:inline-flex pr:items-center pr:justify-center"
      aria-hidden="true"
    >
      <PrSpinner size="sm" label="Chargement" />
    </span>
    <!-- Hidden with opacity, not visibility: the label stays the button's accessible name while it loads. -->
    <span
      class="pr-button__content pr:inline-flex pr:items-center pr:justify-center pr:gap-[inherit]"
      :class="{ 'pr:opacity-0': loading }"
    >
      <component :is="icon" v-if="icon" class="pr-button__icon" :size="iconSize[size]" aria-hidden="true" />
      <slot />
    </span>
  </component>
</template>
