<script setup lang="ts">
import { computed, inject, useSlots } from 'vue'
import { descriptionListKey } from './context'

export interface PrDescriptionItemProps {
  label: string
  /** Plain text value; the default slot takes a richer one (badge, link). */
  value?: string | number | null
}

const props = withDefaults(defineProps<PrDescriptionItemProps>(), {
  value: undefined,
})

const slots = useSlots()
const list = inject(descriptionListKey, null)
const isEmpty = computed(() => !slots.default && (props.value == null || props.value === ''))
</script>

<template>
  <!-- A div around each pair is valid in a <dl>; on two columns it takes both, as a subgrid. -->
  <div class="pr-description-item pr:grid pr:gap-[var(--pr-space-1)] pr:@sm:col-span-2 pr:@sm:grid-cols-subgrid pr:@sm:gap-[normal]">
    <dt class="pr-description-item__label pr:text-[length:var(--pr-font-size-sm)] pr:font-semibold pr:leading-[var(--pr-line-height-normal)] pr:text-[color:var(--pr-color-text-muted)]">{{ label }}</dt>
    <dd class="pr-description-item__value pr:m-0 pr:min-w-0 pr:leading-[var(--pr-line-height-normal)] pr:[overflow-wrap:anywhere]" :class="{ 'pr:text-[color:var(--pr-color-text-subtle)]': isEmpty }">
      <slot>{{ isEmpty ? (list?.emptyText() ?? 'Non renseigné') : value }}</slot>
    </dd>
  </div>
</template>
