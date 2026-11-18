<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { PrContainer } from '../Container'

export interface PrSectionProps {
  /** Element to render, `section` by default. */
  as?: string
  /** Name of the section (`aria-label`), which makes it a region landmark. Only used on a `section`. */
  label?: string
  /**
   * `default`: the page background. `subtle` and `primary`: a soft surface or a soft primary
   * tint, the whole width. Ignored with a `background` image.
   */
  tone?: 'default' | 'subtle' | 'primary'
  /**
   * Image behind the section (a URL), under a dark veil: the content switches to the dark theme
   * so that its text, and the cards put on it, stay readable. Decorative: say what matters in the text.
   */
  background?: string
  /** The image stays still while the page scrolls. Off on touch screens and when the user asks for less motion. */
  parallax?: boolean
  /** Strength of the dark veil over the image, in percent (70 by default). */
  overlay?: number
  /** Width of the content, as `PrContainer`: `wide` (80rem, default), `narrow` (48rem) or `full`. */
  width?: 'full' | 'wide' | 'narrow'
  /** Space above and below the content: `none`, `md` (default) or `lg` (a hero). */
  spacing?: 'none' | 'md' | 'lg'
  /**
   * Starts under the floating navbar (`PrNavbar variant="floating"`): the image or color shows
   * behind the bar, as on the first section of a public page. The content stays below the bar.
   */
  underNavbar?: boolean
}

const props = withDefaults(defineProps<PrSectionProps>(), {
  as: 'section',
  label: undefined,
  tone: 'default',
  background: undefined,
  parallax: false,
  overlay: 70,
  width: 'wide',
  spacing: 'md',
  underNavbar: false,
})

const toneClass = {
  default: '',
  subtle: 'pr:bg-[var(--pr-color-surface-subtle)]',
  primary: 'pr:bg-[var(--pr-color-primary-soft)]',
} as const

const spacingClass = {
  none: '',
  md: 'pr:py-[var(--pr-space-12)] pr:max-[780px]:py-[var(--pr-space-8)]',
  lg: 'pr:py-[var(--pr-space-16)] pr:max-[780px]:py-[var(--pr-space-12)]',
} as const

// The floating navbar's height (--pr-navbar-floating-height, layout.css): the section moves up by as
// much and pads its content by as much again, so the content starts below the bar.
const underNavbarClass = 'pr-section--under-navbar pr:-mt-[var(--pr-navbar-floating-height)] pr:pt-[calc(var(--pr-navbar-floating-height)+var(--pr-space-12))] pr:max-[780px]:pt-[calc(var(--pr-navbar-floating-height)+var(--pr-space-8))]'

const bottomSpacingClass = {
  none: '',
  md: 'pr:pb-[var(--pr-space-12)] pr:max-[780px]:pb-[var(--pr-space-8)]',
  lg: 'pr:pb-[var(--pr-space-16)] pr:max-[780px]:pb-[var(--pr-space-12)]',
} as const

// The image under a dark veil drawn by ::before. Double quotes: Tailwind reads `content-['']` as is.
const imageClass = "pr-section--image pr:bg-[image:var(--pr-section-image)] pr:bg-cover pr:bg-center pr:bg-no-repeat pr:text-[color:var(--pr-color-text)] pr:before:absolute pr:before:inset-0 pr:before:z-[-1] pr:before:bg-[rgb(0_0_0/var(--pr-section-overlay))] pr:before:content-[''] pr:forced-colors:before:hidden"

// Still image while scrolling, except on touch screens (most ignore or botch it) and with reduced motion.
const parallaxClass = 'pr-section--parallax pr:bg-fixed pr:[@media(hover:none)]:bg-scroll pr:motion-reduce:bg-scroll'

const sectionClass = computed(() => [
  props.background ? imageClass : toneClass[props.tone],
  props.background && props.parallax && parallaxClass,
  props.underNavbar ? [underNavbarClass, bottomSpacingClass[props.spacing]] : spacingClass[props.spacing],
])

// The dark theme inside the image section, with the page's brand theme if it has one (the brand
// tokens only apply where both attributes sit on the same element).
const root = ref<HTMLElement>()
const brand = ref<string>()
onMounted(() => {
  brand.value = root.value?.parentElement?.closest<HTMLElement>('[data-pr-brand]')?.dataset.prBrand
})

const sectionStyle = computed(() => props.background
  ? {
      '--pr-section-image': `url("${props.background.replace(/"/g, '%22')}")`,
      '--pr-section-overlay': `${Math.min(Math.max(props.overlay, 0), 100)}%`,
    }
  : undefined)
</script>

<template>
  <component
    :is="as"
    ref="root"
    class="pr-section pr:relative pr:isolate pr:w-full"
    :class="sectionClass"
    :style="sectionStyle"
    :data-pr-theme="background ? 'dark' : undefined"
    :data-pr-brand="background ? brand : undefined"
    :aria-label="as === 'section' ? label : undefined"
  >
    <PrContainer :width="width">
      <slot />
    </PrContainer>
  </component>
</template>
