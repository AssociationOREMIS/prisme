<script setup lang="ts">
export interface PrPanelProps {
  /** Name of the side column (`aria-label` of the `<aside>`), when there are several on the page. */
  asideLabel?: string
  /** Element of the side column: `aside` (complementary landmark) by default, `div` when it is part of the main content. */
  asideTag?: string
}

withDefaults(defineProps<PrPanelProps>(), {
  asideLabel: undefined,
  asideTag: 'aside',
})
</script>

<template>
  <div class="pr-panel pr:box-border pr:w-full pr:rounded-[var(--pr-radius-xl)] pr:border pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)] pr:p-[var(--pr-space-8)] pr:text-[color:var(--pr-color-text)] pr:shadow-[var(--pr-shadow-sm)] pr:max-[780px]:p-[var(--pr-space-4)]">
    <!-- The aside goes to the right from 1024px, under the main column below. -->
    <div
      v-if="$slots.aside"
      class="pr-panel__layout pr:grid pr:grid-cols-[minmax(0,1fr)_minmax(18rem,0.48fr)] pr:items-start pr:gap-[var(--pr-space-12)] pr:max-[1024px]:grid-cols-1 pr:max-[1024px]:gap-[var(--pr-space-8)]"
    >
      <div class="pr-panel__main pr:min-w-0">
        <slot />
      </div>
      <component
        :is="asideTag"
        class="pr-panel__aside pr:min-w-0 pr:rounded-[var(--pr-radius-lg)] pr:bg-[var(--pr-color-surface-subtle)] pr:p-[var(--pr-space-6)] pr:max-[780px]:p-[var(--pr-space-4)]"
        :aria-label="asideLabel"
      >
        <slot name="aside" />
      </component>
    </div>
    <slot v-else />
  </div>
</template>
