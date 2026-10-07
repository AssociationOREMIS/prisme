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
  'relative inline-flex max-w-full items-center justify-center text-center',
  'border border-transparent rounded-[var(--pr-radius-md)]',
  'font-semibold leading-[var(--pr-line-height-tight)] no-underline [overflow-wrap:break-word]',
  'cursor-pointer transition-[background-color,border-color,color,box-shadow]',
  'duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)]',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)]',
  'disabled:cursor-not-allowed disabled:opacity-[0.58]',
  // A link has no `disabled`: aria-disabled, and no pointer events so neither hover nor click.
  'aria-disabled:pointer-events-none aria-disabled:opacity-[0.58]',
  '[&_svg]:shrink-0',
]

const buttonSizeClass: Record<NonNullable<PrButtonProps['size']>, string> = {
  sm: 'min-h-[2rem] px-[var(--pr-space-3)] gap-[var(--pr-space-2)] text-[length:var(--pr-font-size-sm)]',
  md: 'min-h-[2.375rem] px-[var(--pr-space-4)] gap-[var(--pr-space-2)] text-[length:var(--pr-font-size-md)]',
  lg: 'min-h-[2.75rem] px-[var(--pr-space-5)] gap-[var(--pr-space-3)] text-[length:var(--pr-font-size-lg)]',
}

/** Square buttons, the height of each size. */
const iconOnlySizeClass: Record<NonNullable<PrButtonProps['size']>, string> = {
  sm: 'size-8 min-h-0 px-0',
  md: 'size-[2.375rem] min-h-0 px-0',
  lg: 'size-[2.75rem] min-h-0 px-0',
}

const iconSize: Record<NonNullable<PrButtonProps['size']>, number> = { sm: 16, md: 18, lg: 20 }

// The discreet variants in red, whole (two text colours on one element would leave the winner to
// Tailwind's order). A transparent red tint on hover reads on light and dark surfaces alike.
const dangerHover = '[&:not(:disabled):hover]:bg-[color-mix(in_srgb,var(--pr-color-danger)_12%,transparent)] [&:not(:disabled):hover]:text-[color:var(--pr-color-danger-hover)]'
const dangerToneClass: Partial<Record<NonNullable<PrButtonProps['variant']>, string>> = {
  secondary: `border-[var(--pr-color-border-strong)] bg-[var(--pr-color-surface)] text-[color:var(--pr-color-danger)] shadow-[var(--pr-shadow-xs)] ${dangerHover}`,
  ghost: `bg-transparent text-[color:var(--pr-color-danger)] ${dangerHover}`,
}

const buttonVariantClass: Record<NonNullable<PrButtonProps['variant']>, string> = {
  primary:
    'bg-[var(--pr-color-primary)] text-[color:var(--pr-color-primary-contrast)] shadow-[var(--pr-shadow-xs)] [&:not(:disabled):hover]:bg-[var(--pr-color-primary-hover)] [&:not(:disabled):active]:bg-[var(--pr-color-primary-active)]',
  secondary:
    'border-[var(--pr-color-border-strong)] bg-[var(--pr-color-surface)] text-[color:var(--pr-color-text)] shadow-[var(--pr-shadow-xs)] [&:not(:disabled):hover]:bg-[var(--pr-color-surface-subtle)]',
  ghost:
    'bg-transparent text-[color:var(--pr-color-text)] [&:not(:disabled):hover]:bg-[var(--pr-color-surface-subtle)]',
  danger:
    'bg-[var(--pr-color-danger-solid)] text-[color:var(--pr-neutral-0)] shadow-[var(--pr-shadow-xs)] [&:not(:disabled):hover]:bg-[var(--pr-color-danger-solid-hover)]',
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
      <span v-if="loading" class="pr-button__loader absolute inset-0 inline-flex items-center justify-center" aria-hidden="true">
        <PrSpinner size="sm" label="Chargement" />
      </span>
      <component :is="icon" class="pr-button__icon" :class="{ 'opacity-0': loading }" :size="iconSize[size]" aria-hidden="true" />
    </component>
  </PrTooltip>
  <component
    v-else
    :is="href ? 'a' : 'button'"
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
      class="pr-button__loader absolute inset-0 inline-flex items-center justify-center"
      aria-hidden="true"
    >
      <PrSpinner size="sm" label="Chargement" />
    </span>
    <!-- Hidden with opacity, not visibility: the label stays the button's accessible name while it loads. -->
    <span
      class="pr-button__content inline-flex items-center justify-center gap-[inherit]"
      :class="{ 'opacity-0': loading }"
    >
      <component :is="icon" v-if="icon" class="pr-button__icon" :size="iconSize[size]" aria-hidden="true" />
      <slot />
    </span>
  </component>
</template>
