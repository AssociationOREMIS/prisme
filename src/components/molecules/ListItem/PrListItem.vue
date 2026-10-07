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
  <div class="pr-list-item pr:flex pr:items-center pr:gap-[var(--pr-space-3)] pr:rounded-[var(--pr-radius-lg)] pr:border pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)] pr:p-[var(--pr-space-4)]" :class="{ 'pr-list-item--active pr:border-[var(--pr-color-primary-border)] pr:bg-[var(--pr-color-primary-soft)]': active }">
    <div v-if="$slots.media" class="pr-list-item__media pr:shrink-0"><slot name="media" /></div>
    <div class="pr-list-item__content pr:grid pr:min-w-0 pr:flex-auto pr:gap-[var(--pr-space-1)]">
      <strong v-if="title" class="pr-list-item__title pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)]">{{ title }}</strong>
      <p v-if="description" class="pr-list-item__description pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text-muted)]">{{ description }}</p>
      <slot />
    </div>
    <div v-if="$slots.actions" class="pr-list-item__actions pr:shrink-0"><slot name="actions" /></div>
  </div>
</template>
