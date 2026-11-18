<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

export interface PrRevealProps {
  /**
   * How the content appears when it scrolls into view: `fade-up` (default) rises, `fade-left`
   * comes from the right, `fade-right` from the left, `fade` only fades in.
   */
  effect?: 'fade' | 'fade-up' | 'fade-left' | 'fade-right'
  /** Length of the animation, in milliseconds. */
  duration?: number
  /** Wait before it starts, in milliseconds: to stagger cards in a row. */
  delay?: number
  /** How far into the screen the content must come before it appears, in pixels. */
  offset?: number
  /** Plays again each time the content comes back into view, instead of once. */
  repeat?: boolean
  /** Element to render, `div` by default. */
  as?: string
}

const props = withDefaults(defineProps<PrRevealProps>(), {
  effect: 'fade-up',
  duration: 800,
  delay: 0,
  offset: 120,
  repeat: false,
  as: 'div',
})

// Shown until mounted: without JavaScript, before hydration, or if anything fails, the content is
// simply there. It only hides once the observer is ready to show it again.
const state = ref<'idle' | 'hidden' | 'shown'>('idle')
const root = ref<HTMLElement>()
let observer: IntersectionObserver | undefined

onMounted(() => {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (reduced || typeof IntersectionObserver === 'undefined' || !root.value) return
  state.value = 'hidden'
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        state.value = 'shown'
        if (!props.repeat) observer?.disconnect()
      } else if (props.repeat && entry.boundingClientRect.top > 0) {
        // Hidden again only once it leaves through the bottom: scrolling back up replays it.
        state.value = 'hidden'
      }
    }
  }, { rootMargin: `0px 0px -${Math.max(props.offset, 0)}px 0px` })
  observer.observe(root.value)
})

onBeforeUnmount(() => observer?.disconnect())

// The starting position of each effect. Sideways moves are shorter on a phone, and the root clips
// sideways overflow, so a card sliding in never widens the page (no horizontal scroll, WCAG 1.4.10).
const hiddenClass = {
  'fade': 'pr:opacity-0',
  'fade-up': 'pr:opacity-0 pr:translate-y-[6rem] pr:max-[780px]:translate-y-[3rem]',
  'fade-left': 'pr:opacity-0 pr:translate-x-[6rem] pr:max-[780px]:translate-x-[2.5rem]',
  'fade-right': 'pr:opacity-0 pr:-translate-x-[6rem] pr:max-[780px]:-translate-x-[2.5rem]',
} as const

// Only the way in is animated: hiding (on mount, or below the screen with `repeat`) is instant,
// the content never fades out under the user's eyes.
const innerStyle = computed(() => ({
  transitionDuration: `${props.duration}ms`,
  transitionDelay: `${props.delay}ms`,
}))
</script>

<template>
  <component
    :is="as"
    ref="root"
    class="pr-reveal"
    :class="{ 'pr:overflow-x-clip': effect === 'fade-left' || effect === 'fade-right' }"
    :data-state="state"
  >
    <div
      class="pr-reveal__inner pr:h-full pr:ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
      :class="state === 'hidden' ? [hiddenClass[effect], 'pr:transition-none'] : 'pr:transition-[opacity,transform]'"
      :style="innerStyle"
    >
      <slot />
    </div>
  </component>
</template>
