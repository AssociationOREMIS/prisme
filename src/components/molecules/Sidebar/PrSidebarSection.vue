<script setup lang="ts">
import { computed, inject, useId } from 'vue'
import { prSidebarContextKey } from './sidebarContext'

export interface PrSidebarSectionProps {
  /** Title of the group of entries. A narrow sidebar replaces it with a line, still read by screen readers. */
  label: string
}

defineProps<PrSidebarSectionProps>()

const sidebar = inject(prSidebarContextKey, null)
const labelId = useId()
const narrow = computed(() => sidebar?.isNarrow.value ?? false)
</script>

<template>
  <div
    class="pr-sidebar-section pr:grid pr:gap-[var(--pr-space-2)] pr:not-first:mt-[var(--pr-space-3)] pr:[&:first-child>.pr-sidebar-section\_\_divider]:hidden"
    role="group"
    :aria-labelledby="labelId"
  >
    <!-- Narrow sidebar (icons only): no room for the title, a line separates the groups -->
    <span
      v-if="narrow"
      class="pr-sidebar-section__divider pr:mx-[var(--pr-space-1)] pr:mb-[var(--pr-space-1)] pr:block pr:h-px pr:bg-[var(--pr-color-border)]"
      aria-hidden="true"
    />
    <p
      :id="labelId"
      class="pr-sidebar-section__label pr:m-0 pr:px-[var(--pr-space-2)] pr:text-[length:var(--pr-font-size-xs)] pr:font-bold pr:uppercase pr:tracking-[0.05em] pr:text-[color:var(--pr-color-text-subtle)]"
      :class="{ 'pr:sr-only': narrow }"
    >
      {{ label }}
    </p>
    <slot />
  </div>
</template>
