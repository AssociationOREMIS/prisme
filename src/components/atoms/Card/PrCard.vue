<script setup lang="ts">
import { computed, useSlots } from 'vue'

export interface PrCardProps {
  padded?: boolean
  elevation?: 'flat' | 'raised'
  /** Title of the card's header (or the `title` slot). */
  title?: string
  /** Line under the title (or the `description` slot). */
  description?: string
  /** Level of the title, `h2` by default: one below the page title. */
  headingLevel?: 2 | 3 | 4
}

const props = withDefaults(defineProps<PrCardProps>(), {
  padded: true,
  elevation: 'flat',
  title: undefined,
  description: undefined,
  headingLevel: 2,
})

const slots = useSlots()
const hasHeading = computed(() => Boolean(props.title || props.description || slots.title || slots.description))
const hasHeader = computed(() => hasHeading.value || Boolean(slots.actions))

const cardBaseClass = [
  'pr-card',
  'pr:rounded-[var(--pr-radius-lg)] pr:border pr:border-[var(--pr-color-border)]',
  'pr:bg-[var(--pr-color-surface)] pr:text-[color:var(--pr-color-text)]',
  'pr:shadow-[var(--pr-shadow-xs)]',
]

const cardElevationClass: Record<NonNullable<PrCardProps['elevation']>, string> = {
  flat: 'pr:shadow-none',
  raised: 'pr:shadow-[var(--pr-shadow-sm)]',
}

const cardClass = computed(() => [
  cardBaseClass,
  props.padded ? 'pr:p-[var(--pr-space-5)]' : '',
  cardElevationClass[props.elevation],
])

// Without padding (a table filling the card), the header keeps its own and a line under it.
const headerClass = computed(() => props.padded
  ? 'pr:mb-[var(--pr-space-4)]'
  : 'pr:border-b pr:border-[var(--pr-color-border)] pr:p-[var(--pr-space-5)]')
</script>

<template>
  <section :class="cardClass">
    <!-- Title on the left, actions on the right; the actions go below when there is no room. -->
    <header v-if="hasHeader" class="pr-card__header pr:flex pr:flex-wrap pr:items-start pr:justify-between pr:gap-[var(--pr-space-3)]" :class="headerClass">
      <div v-if="hasHeading" class="pr-card__heading pr:grid pr:min-w-0 pr:flex-[1_1_16rem] pr:gap-[var(--pr-space-1)]">
        <component :is="`h${headingLevel}`" v-if="title || $slots.title" class="pr-card__title pr:m-0 pr:text-[length:var(--pr-font-size-lg)] pr:font-semibold pr:leading-[var(--pr-line-height-tight)]">
          <slot name="title">{{ title }}</slot>
        </component>
        <div v-if="description || $slots.description" class="pr-card__description pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-normal)] pr:text-[color:var(--pr-color-text-muted)]">
          <slot name="description">{{ description }}</slot>
        </div>
      </div>
      <div v-if="$slots.actions" class="pr-card__actions pr:flex pr:flex-wrap pr:items-center pr:gap-[var(--pr-space-2)]">
        <slot name="actions" />
      </div>
    </header>
    <slot />
  </section>
</template>
