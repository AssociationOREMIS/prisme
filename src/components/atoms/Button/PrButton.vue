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
</script>

<template>
  <button
    class="pr-button"
    :class="[`pr-button--${variant}`, `pr-button--${size}`]"
    :type="type"
    :disabled="isUnavailable"
    :aria-busy="loading ? 'true' : undefined"
    :data-loading="loading ? 'true' : 'false'"
  >
    <span v-if="loading" class="pr-button__loader" aria-hidden="true">
      <PrSpinner size="sm" label="Chargement" />
    </span>
    <span class="pr-button__content">
      <slot />
    </span>
  </button>
</template>
