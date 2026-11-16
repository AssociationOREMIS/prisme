<script setup lang="ts">
import { computed } from 'vue'

export interface PrBandProps {
  /**
   * `primary` (default): soft primary background with its border, to highlight. `subtle`: the
   * subtle surface. `surface`: the surface with a border.
   */
  tone?: 'primary' | 'subtle' | 'surface'
  /** Element to render, `section` by default. */
  as?: string
  /** Name of the section (`aria-label`), which makes it a region landmark. Only used on a `section`. */
  label?: string
}

const props = withDefaults(defineProps<PrBandProps>(), {
  tone: 'primary',
  as: 'section',
  label: undefined,
})

const bandToneClass: Record<NonNullable<PrBandProps['tone']>, string> = {
  primary: 'pr:border-[var(--pr-color-primary-border)] pr:bg-[var(--pr-color-primary-soft)]',
  subtle: 'pr:border-transparent pr:bg-[var(--pr-color-surface-subtle)]',
  surface: 'pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)]',
}

const bandClass = computed(() => [
  `pr-band pr-band--${props.tone}`,
  'pr:box-border pr:w-full pr:rounded-[var(--pr-radius-xl)] pr:border pr:text-[color:var(--pr-color-text)]',
  'pr:px-[var(--pr-space-10)] pr:py-[2.25rem] pr:max-[780px]:p-[var(--pr-space-4)]',
  bandToneClass[props.tone],
])
</script>

<template>
  <component :is="as" :class="bandClass" :aria-label="as === 'section' ? label : undefined">
    <!-- The aside goes to the right from 1024px, under the main content below. -->
    <div
      v-if="$slots.aside"
      class="pr-band__layout pr:grid pr:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] pr:items-start pr:gap-[var(--pr-space-8)] pr:max-[1024px]:grid-cols-1"
    >
      <div class="pr-band__main pr:min-w-0">
        <slot />
      </div>
      <div class="pr-band__aside pr:min-w-0">
        <slot name="aside" />
      </div>
    </div>
    <slot v-else />
  </component>
</template>
