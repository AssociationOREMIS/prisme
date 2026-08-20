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
const paginationButtonClass = 'pr-pagination__button inline-grid min-h-[2.375rem] min-w-[2.375rem] cursor-pointer place-items-center rounded-[var(--pr-radius-md)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] px-[var(--pr-space-3)] font-[650] text-[color:var(--pr-color-text)] transition-[background-color,border-color,color] duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)] hover:not-disabled:bg-[var(--pr-color-surface-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)] disabled:cursor-not-allowed disabled:opacity-[0.58]'
const paginationActiveClass = 'pr-pagination__button--active border-[var(--pr-color-primary)] bg-[var(--pr-color-primary)] text-[color:var(--pr-color-primary-contrast)] hover:not-disabled:border-[var(--pr-color-primary-hover)] hover:not-disabled:bg-[var(--pr-color-primary-hover)]'

function go(page: number) {
  if (!props.disabled && page >= 1 && page <= props.pageCount) {
    emit('update:page', page)
  }
}
</script>

<template>
  <nav class="pr-pagination inline-flex flex-wrap items-center gap-[var(--pr-space-2)]" aria-label="Pagination">
    <button :class="paginationButtonClass" type="button" :disabled="disabled || page <= 1" aria-label="Page precedente" @click="go(page - 1)">
      <ChevronLeft :size="16" aria-hidden="true" />
    </button>
    <button
      v-for="item in pages"
      :key="item"
      :class="[paginationButtonClass, item === page ? paginationActiveClass : '']"
      type="button"
      :aria-current="item === page ? 'page' : undefined"
      :disabled="disabled"
      @click="go(item)"
    >
      {{ item }}
    </button>
    <button :class="paginationButtonClass" type="button" :disabled="disabled || page >= pageCount" aria-label="Page suivante" @click="go(page + 1)">
      <ChevronRight :size="16" aria-hidden="true" />
    </button>
  </nav>
</template>
