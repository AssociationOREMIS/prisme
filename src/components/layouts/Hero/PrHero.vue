<script setup lang="ts">
import { computed } from 'vue'

export interface PrHeroProps {
  /** Title of the page (or the `title` slot). */
  title?: string
  /** Lead text under the title (or the `description` slot). */
  description?: string
  /** Level of the title: `h1` (default) when the hero opens the page, `h2` otherwise. */
  headingLevel?: 1 | 2
  /** Decorative squares on the right half. Hidden on small screens and in forced colors. */
  pattern?: boolean
}

const props = withDefaults(defineProps<PrHeroProps>(), {
  title: undefined,
  description: undefined,
  headingLevel: 1,
  pattern: true,
})

/** The decorative squares, in percent of the pattern layer: left, top, size (rem), accent color (filled, no outline). */
const squares: Array<{ x: number, y: number, size: number, accent?: boolean }> = [
  { x: 18, y: 12, size: 2.5 },
  { x: 40, y: 6, size: 1.5, accent: true },
  { x: 62, y: 18, size: 3.25 },
  { x: 84, y: 8, size: 2 },
  { x: 30, y: 44, size: 1.75 },
  { x: 52, y: 52, size: 2.75, accent: true },
  { x: 76, y: 46, size: 2.25 },
  { x: 92, y: 62, size: 1.5, accent: true },
  { x: 12, y: 74, size: 1.5, accent: true },
  { x: 38, y: 80, size: 2.25 },
  { x: 66, y: 82, size: 1.75 },
  { x: 86, y: 86, size: 2.5 },
]

function squareStyle(square: { x: number, y: number, size: number }) {
  return { left: `${square.x}%`, top: `${square.y}%`, width: `${square.size}rem`, height: `${square.size}rem` }
}

// Next to the pattern, the text keeps to the left half so the squares never sit under a word.
const contentClass = computed(() => props.pattern
  ? 'pr:max-w-[48rem] pr:min-[1024px]:max-w-[min(48rem,55%)]'
  : 'pr:max-w-[48rem]')
</script>

<template>
  <div class="pr-hero pr:relative pr:isolate pr:overflow-hidden pr:py-[var(--pr-space-12)] pr:max-[780px]:py-[var(--pr-space-8)]">
    <!-- A div, not a <header>: outside <main> that would be a second banner landmark. -->
    <div
      v-if="pattern"
      class="pr-hero__pattern pr:pointer-events-none pr:absolute pr:inset-y-0 pr:right-0 pr:z-[-1] pr:w-[42%] pr:opacity-60 pr:max-[1024px]:hidden pr:forced-colors:hidden"
      aria-hidden="true"
    >
      <span
        v-for="(square, index) in squares"
        :key="index"
        class="pr-hero__square pr:absolute pr:block pr:rounded-[var(--pr-radius-md)] pr:border"
        :class="square.accent
          ? 'pr-hero__square--accent pr:border-transparent pr:bg-[color-mix(in_srgb,var(--pr-color-accent)_45%,transparent)]'
          : 'pr:border-[var(--pr-color-primary-border)] pr:bg-[var(--pr-color-primary-soft)]'"
        :style="squareStyle(square)"
      />
    </div>
    <div class="pr-hero__content pr:grid pr:gap-[var(--pr-space-4)]" :class="contentClass">
      <component
        :is="`h${headingLevel}`"
        class="pr-hero__title pr:m-0 pr:font-[family-name:var(--pr-font-heading)] pr:text-[clamp(2rem,1.5rem+2vw,3rem)] pr:font-bold pr:leading-[1.15] pr:text-[color:var(--pr-color-heading)] pr:[overflow-wrap:break-word]"
      >
        <slot name="title">{{ title }}</slot>
      </component>
      <div
        v-if="description || $slots.description"
        class="pr-hero__description pr:text-[length:var(--pr-font-size-xl)] pr:font-semibold pr:leading-[var(--pr-line-height-normal)] pr:text-[color:var(--pr-color-text-muted)] pr:max-[780px]:text-[length:var(--pr-font-size-lg)]"
      >
        <slot name="description">{{ description }}</slot>
      </div>
      <div v-if="$slots.actions" class="pr-hero__actions pr:mt-[var(--pr-space-2)] pr:flex pr:flex-wrap pr:items-center pr:gap-[var(--pr-space-3)]">
        <slot name="actions" />
      </div>
      <slot />
    </div>
  </div>
</template>
