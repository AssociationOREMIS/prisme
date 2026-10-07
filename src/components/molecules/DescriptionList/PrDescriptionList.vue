<script setup lang="ts">
import { provide } from 'vue'
import PrDescriptionItem from './PrDescriptionItem.vue'
import { descriptionListKey } from './context'

export interface PrDescriptionListItem {
  label: string
  value?: string | number | null
}

export interface PrDescriptionListProps {
  /** Plain text pairs. For a richer value (badge, link), use `PrDescriptionItem` in the slot. */
  items?: PrDescriptionListItem[]
  /** Shown, muted, for an empty value. */
  emptyText?: string
}

const props = withDefaults(defineProps<PrDescriptionListProps>(), {
  items: () => [],
  emptyText: 'Non renseigné',
})

provide(descriptionListKey, { emptyText: () => props.emptyText })
</script>

<template>
  <!-- Labels in a column on the left, values on the right; one under the other when the list itself
       is narrow (a container query: a narrow card on a wide screen too). -->
  <div class="pr-description-list pr:@container">
    <dl class="pr:m-0 pr:grid pr:grid-cols-1 pr:gap-x-[var(--pr-space-8)] pr:gap-y-[var(--pr-space-3)] pr:@sm:grid-cols-[max-content_1fr]">
      <PrDescriptionItem v-for="item in items" :key="item.label" :label="item.label" :value="item.value" />
      <slot />
    </dl>
  </div>
</template>
