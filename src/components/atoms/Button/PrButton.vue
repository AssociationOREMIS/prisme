<script setup lang="ts">
import { computed } from 'vue'
import { PrSpinner } from '../Spinner'

export interface PrButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<PrButtonProps>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
})

const isUnavailable = computed(() => props.disabled || props.loading)

const buttonBaseClass = [
  'pr-button',
  'relative inline-flex min-w-max items-center justify-center',
  'border border-transparent rounded-[var(--pr-radius-md)]',
  'font-semibold leading-[var(--pr-line-height-tight)] no-underline whitespace-nowrap',
  'cursor-pointer transition-[background-color,border-color,color,box-shadow]',
  'duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)]',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)]',
  'disabled:cursor-not-allowed disabled:opacity-[0.58]',
  '[&_svg]:shrink-0',
]

const buttonSizeClass: Record<NonNullable<PrButtonProps['size']>, string> = {
  sm: 'min-h-[2rem] px-[var(--pr-space-3)] gap-[var(--pr-space-2)] text-[length:var(--pr-font-size-sm)]',
  md: 'min-h-[2.375rem] px-[var(--pr-space-4)] gap-[var(--pr-space-2)] text-[length:var(--pr-font-size-md)]',
  lg: 'min-h-[2.75rem] px-[var(--pr-space-5)] gap-[var(--pr-space-3)] text-[length:var(--pr-font-size-lg)]',
}

const buttonVariantClass: Record<NonNullable<PrButtonProps['variant']>, string> = {
  primary:
    'bg-[var(--pr-color-primary)] text-[color:var(--pr-color-primary-contrast)] shadow-[var(--pr-shadow-xs)] [&:not(:disabled):hover]:bg-[var(--pr-color-primary-hover)] [&:not(:disabled):active]:bg-[var(--pr-color-primary-active)]',
  secondary:
    'border-[var(--pr-color-border-strong)] bg-[var(--pr-color-surface)] text-[color:var(--pr-color-text)] shadow-[var(--pr-shadow-xs)] [&:not(:disabled):hover]:bg-[var(--pr-color-surface-subtle)]',
  ghost:
    'bg-transparent text-[color:var(--pr-color-text)] [&:not(:disabled):hover]:bg-[var(--pr-color-surface-subtle)]',
  danger:
    'bg-[var(--pr-color-danger)] text-[color:var(--pr-neutral-0)] shadow-[var(--pr-shadow-xs)] [&:not(:disabled):hover]:bg-[var(--pr-color-danger-hover)]',
}

const buttonClass = computed(() => [
  buttonBaseClass,
  buttonSizeClass[props.size],
  buttonVariantClass[props.variant],
])
</script>

<template>
  <button
    :class="buttonClass"
    :type="type"
    :disabled="isUnavailable"
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
    <span
      class="pr-button__content inline-flex items-center justify-center gap-[inherit]"
      :class="{ invisible: loading }"
    >
      <slot />
    </span>
  </button>
</template>
