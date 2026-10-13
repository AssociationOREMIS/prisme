<script setup lang="ts">
import { CircleUser } from '@lucide/vue'
import { computed, ref, watch } from 'vue'

export interface PrAvatarProps {
  /** Photo URL (e.g. `avatar_url` from PIO: a photo, or the volunteer's identicon). */
  src?: string | null
  /**
   * Text alternative. Empty by default: next to a name the picture is
   * decorative, the name already says who it is.
   */
  alt?: string
  /** Diameter in pixels. */
  size?: number
}

const props = withDefaults(defineProps<PrAvatarProps>(), {
  src: undefined,
  alt: '',
  size: 28,
})

// A broken or missing picture falls back to the generic person icon,
// never to the browser's broken-image glyph.
const failed = ref(false)
watch(() => props.src, () => {
  failed.value = false
})

const showImage = computed(() => Boolean(props.src) && !failed.value)
const style = computed(() => ({ width: `${props.size}px`, height: `${props.size}px` }))
</script>

<template>
  <span
    class="pr-avatar pr:inline-flex pr:shrink-0 pr:items-center pr:justify-center pr:overflow-hidden pr:rounded-[var(--pr-radius-full)]"
    :style="style"
  >
    <img
      v-if="showImage"
      :src="src ?? undefined"
      :alt="alt"
      class="pr-avatar__image pr:block pr:h-full pr:w-full pr:object-cover"
      loading="lazy"
      decoding="async"
      @error="failed = true"
    >
    <CircleUser
      v-else
      class="pr-avatar__fallback"
      :size="Math.round(size * 0.8)"
      :stroke-width="1.75"
      :aria-hidden="alt === '' ? 'true' : undefined"
      :aria-label="alt === '' ? undefined : alt"
      :role="alt === '' ? undefined : 'img'"
    />
  </span>
</template>
