<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'

export interface PrCarouselItem {
  title: string
  description?: string
}

export interface PrCarouselProps {
  items?: PrCarouselItem[]
}

const props = withDefaults(defineProps<PrCarouselProps>(), {
  items: () => [],
})

const index = ref(0)
const current = computed(() => props.items[index.value])

function move(delta: number) {
  const total = props.items.length
  if (total === 0) return
  index.value = (index.value + delta + total) % total
}
</script>

<template>
  <section class="pr-carousel grid grid-cols-[auto_1fr_auto] items-center gap-[var(--pr-space-3)] rounded-[var(--pr-radius-lg)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] p-[var(--pr-space-4)]" aria-roledescription="carousel">
    <button class="pr-carousel__button inline-grid size-8 cursor-pointer place-items-center rounded-[var(--pr-radius-md)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] text-[color:var(--pr-color-text)] hover:bg-[var(--pr-color-surface-subtle)]" type="button" aria-label="Element precedent" @click="move(-1)">
      <ChevronLeft :size="16" />
    </button>
    <div class="pr-carousel__item grid min-w-0 gap-[var(--pr-space-1)] text-center [&_span]:text-[length:var(--pr-font-size-sm)] [&_span]:text-[color:var(--pr-color-text-muted)]">
      <strong>{{ current?.title }}</strong>
      <span v-if="current?.description">{{ current.description }}</span>
    </div>
    <button class="pr-carousel__button inline-grid size-8 cursor-pointer place-items-center rounded-[var(--pr-radius-md)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] text-[color:var(--pr-color-text)] hover:bg-[var(--pr-color-surface-subtle)]" type="button" aria-label="Element suivant" @click="move(1)">
      <ChevronRight :size="16" />
    </button>
  </section>
</template>
