<script setup lang="ts">
export interface PrListItemProps {
  title?: string
  description?: string
  active?: boolean
}

withDefaults(defineProps<PrListItemProps>(), {
  title: undefined,
  description: undefined,
  active: false,
})
</script>

<template>
  <div class="pr-list-item flex items-center gap-[var(--pr-space-3)] rounded-[var(--pr-radius-lg)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] p-[var(--pr-space-4)]" :class="{ 'pr-list-item--active border-[var(--pr-color-primary-border)] bg-[var(--pr-color-primary-soft)]': active }">
    <div v-if="$slots.media" class="pr-list-item__media shrink-0"><slot name="media" /></div>
    <div class="pr-list-item__content grid min-w-0 flex-auto gap-[var(--pr-space-1)]">
      <strong v-if="title" class="pr-list-item__title text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-tight)]">{{ title }}</strong>
      <p v-if="description" class="pr-list-item__description m-0 text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-text-muted)]">{{ description }}</p>
      <slot />
    </div>
    <div v-if="$slots.actions" class="pr-list-item__actions shrink-0"><slot name="actions" /></div>
  </div>
</template>
