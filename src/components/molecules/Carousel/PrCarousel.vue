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
  <section class="pr-carousel" aria-roledescription="carousel">
    <button class="pr-carousel__button" type="button" aria-label="Element precedent" @click="move(-1)">
      <ChevronLeft :size="16" />
    </button>
    <div class="pr-carousel__item">
      <strong>{{ current?.title }}</strong>
      <span v-if="current?.description">{{ current.description }}</span>
    </div>
    <button class="pr-carousel__button" type="button" aria-label="Element suivant" @click="move(1)">
      <ChevronRight :size="16" />
    </button>
  </section>
</template>
