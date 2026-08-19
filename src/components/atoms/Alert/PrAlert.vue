<script setup lang="ts">
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from '@lucide/vue'
import { computed } from 'vue'

export interface PrAlertProps {
  variant?: 'info' | 'success' | 'warning' | 'danger'
  title?: string
}

const props = withDefaults(defineProps<PrAlertProps>(), {
  variant: 'info',
  title: undefined,
})

const icon = computed(() => ({
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  danger: AlertCircle,
})[props.variant])
</script>

<template>
  <div class="pr-alert" :class="`pr-alert--${variant}`" role="status">
    <component :is="icon" class="pr-alert__icon" :size="18" aria-hidden="true" />
    <div class="pr-alert__content">
      <p v-if="title" class="pr-alert__title">{{ title }}</p>
      <div class="pr-alert__description">
        <slot />
      </div>
    </div>
  </div>
</template>
