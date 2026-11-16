<script setup lang="ts">
import { computed } from 'vue'

export interface PrVisuallyHiddenProps {
  /** Element rendered: `span` (inline text) by default, `div`, `p`, `h2`... */
  as?: string
  /**
   * Shows the content again while it, or a link inside it, has the focus: a skip link
   * (« Aller au formulaire »), invisible until the first Tab.
   */
  focusable?: boolean
}

const props = withDefaults(defineProps<PrVisuallyHiddenProps>(), {
  as: 'span',
  focusable: false,
})

// `sr-only`: out of sight but still read by screen readers, never `display: none`.
const visuallyHiddenClass = computed(() => [
  'pr-visually-hidden pr:sr-only',
  props.focusable && 'pr-visually-hidden--focusable pr:focus:not-sr-only pr:focus-within:not-sr-only',
])
</script>

<template>
  <component :is="as" :class="visuallyHiddenClass">
    <slot />
  </component>
</template>
