<script setup lang="ts">
import { computed, type Component } from 'vue'

export interface PrFeatureProps {
  /** Icon (a Lucide component) shown in a round badge before the text. */
  icon?: Component
  /** Title of the tile (or the `title` slot). */
  title?: string
  /** Text under the title (or the `description` slot, or the default slot). */
  description?: string
  /** `surface` (default): a white rounded tile with padding. `plain`: no background. */
  tone?: 'surface' | 'plain'
  /** Element to render: `li` inside a list... */
  as?: string
  /** Makes the title a heading of this level. A `<p>` styled as a title without it. */
  headingLevel?: 2 | 3 | 4
}

const props = withDefaults(defineProps<PrFeatureProps>(), {
  icon: undefined,
  title: undefined,
  description: undefined,
  tone: 'surface',
  as: 'div',
  headingLevel: undefined,
})

const featureToneClass: Record<NonNullable<PrFeatureProps['tone']>, string> = {
  surface: 'pr:rounded-[var(--pr-radius-lg)] pr:border pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)] pr:p-[var(--pr-space-4)]',
  plain: '',
}

const featureClass = computed(() => [
  `pr-feature pr-feature--${props.tone}`,
  'pr:flex pr:items-start pr:gap-[var(--pr-space-4)] pr:text-[color:var(--pr-color-text)]',
  featureToneClass[props.tone],
])
const titleTag = computed(() => (props.headingLevel ? `h${props.headingLevel}` : 'p'))
</script>

<template>
  <component :is="as" :class="featureClass">
    <span
      v-if="icon"
      class="pr-feature__icon pr:inline-flex pr:size-11 pr:shrink-0 pr:items-center pr:justify-center pr:rounded-[var(--pr-radius-full)] pr:border pr:border-[var(--pr-color-primary-border)] pr:bg-[var(--pr-color-primary-soft)] pr:text-[color:var(--pr-color-primary)]"
      aria-hidden="true"
    >
      <component :is="icon" :size="22" aria-hidden="true" />
    </span>
    <div class="pr-feature__body pr:grid pr:min-w-0 pr:gap-[var(--pr-space-1)]">
      <component
        :is="titleTag"
        v-if="title || $slots.title"
        class="pr-feature__title pr:m-0 pr:font-[family-name:var(--pr-font-heading)] pr:text-[length:var(--pr-font-size-lg)] pr:font-semibold pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-heading)]"
      >
        <slot name="title">{{ title }}</slot>
      </component>
      <div
        v-if="description || $slots.description"
        class="pr-feature__description pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-normal)] pr:text-[color:var(--pr-color-text-muted)]"
      >
        <slot name="description">{{ description }}</slot>
      </div>
      <slot />
    </div>
  </component>
</template>
