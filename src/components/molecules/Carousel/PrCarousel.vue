<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'

export interface PrCarouselItem {
  title: string
  description?: string
}

export interface PrCarouselProps {
  items?: PrCarouselItem[]
  ariaLabel?: string
}

const props = withDefaults(defineProps<PrCarouselProps>(), {
  items: () => [],
  ariaLabel: 'Carrousel',
})

const index = ref(0)
const current = computed(() => props.items[index.value])
const positionLabel = computed(() => `Élément ${index.value + 1} sur ${props.items.length}`)

function move(delta: number) {
  const total = props.items.length
  if (total === 0) return
  index.value = (index.value + delta + total) % total
}
</script>

<template>
  <section
    class="pr-carousel pr:grid pr:grid-cols-[auto_1fr_auto] pr:items-center pr:gap-[var(--pr-space-3)] pr:rounded-[var(--pr-radius-lg)] pr:border pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)] pr:p-[var(--pr-space-4)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]"
    aria-roledescription="carousel"
    :aria-label="ariaLabel"
    tabindex="0"
    @keydown.left.prevent="move(-1)"
    @keydown.right.prevent="move(1)"
  >
    <button class="pr-carousel__button pr:inline-grid pr:size-8 pr:cursor-pointer pr:place-items-center pr:rounded-[var(--pr-radius-md)] pr:border pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)] pr:text-[color:var(--pr-color-text)] pr:hover:bg-[var(--pr-color-surface-subtle)]" type="button" aria-label="Élément précédent" @click="move(-1)">
      <ChevronLeft :size="16" />
    </button>
    <div
      class="pr-carousel__item pr:grid pr:min-w-0 pr:gap-[var(--pr-space-1)] pr:text-center pr:[&_span]:text-[length:var(--pr-font-size-sm)] pr:[&_span]:text-[color:var(--pr-color-text-muted)]"
      role="group"
      aria-roledescription="slide"
      :aria-label="positionLabel"
      aria-live="polite"
      aria-atomic="true"
    >
      <strong>{{ current?.title }}</strong>
      <span v-if="current?.description">{{ current.description }}</span>
    </div>
    <button class="pr-carousel__button pr:inline-grid pr:size-8 pr:cursor-pointer pr:place-items-center pr:rounded-[var(--pr-radius-md)] pr:border pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)] pr:text-[color:var(--pr-color-text)] pr:hover:bg-[var(--pr-color-surface-subtle)]" type="button" aria-label="Élément suivant" @click="move(1)">
      <ChevronRight :size="16" />
    </button>
  </section>
</template>
