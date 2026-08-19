<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'

export interface PrPaginationProps {
  page?: number
  pageCount?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<PrPaginationProps>(), {
  page: 1,
  pageCount: 1,
  disabled: false,
})

const emit = defineEmits<{
  'update:page': [value: number]
}>()

const pages = computed(() => Array.from({ length: props.pageCount }, (_, index) => index + 1))

function go(page: number) {
  if (!props.disabled && page >= 1 && page <= props.pageCount) {
    emit('update:page', page)
  }
}
</script>

<template>
  <nav class="pr-pagination" aria-label="Pagination">
    <button class="pr-pagination__button" type="button" :disabled="disabled || page <= 1" aria-label="Page precedente" @click="go(page - 1)">
      <ChevronLeft :size="16" aria-hidden="true" />
    </button>
    <button
      v-for="item in pages"
      :key="item"
      class="pr-pagination__button"
      :class="{ 'pr-pagination__button--active': item === page }"
      type="button"
      :aria-current="item === page ? 'page' : undefined"
      :disabled="disabled"
      @click="go(item)"
    >
      {{ item }}
    </button>
    <button class="pr-pagination__button" type="button" :disabled="disabled || page >= pageCount" aria-label="Page suivante" @click="go(page + 1)">
      <ChevronRight :size="16" aria-hidden="true" />
    </button>
  </nav>
</template>
