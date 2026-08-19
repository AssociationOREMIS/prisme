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
  <div class="pr-list-item" :class="{ 'pr-list-item--active': active }">
    <div v-if="$slots.media" class="pr-list-item__media"><slot name="media" /></div>
    <div class="pr-list-item__content">
      <strong v-if="title" class="pr-list-item__title">{{ title }}</strong>
      <p v-if="description" class="pr-list-item__description">{{ description }}</p>
      <slot />
    </div>
    <div v-if="$slots.actions" class="pr-list-item__actions"><slot name="actions" /></div>
  </div>
</template>
