<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import { buildPaginationItems } from './utils'

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

const currentPage = computed(() => props.page ?? 1)
const currentPageCount = computed(() => props.pageCount ?? 1)
const isDisabled = computed(() => props.disabled ?? false)

// Beyond a handful of pages, listing one button per page would be both
// unusable and unbounded (e.g. a server-paginated table with a large total).
// Show first/last plus a window around the current page, with ellipses.
const pages = computed(() => buildPaginationItems(currentPageCount.value, currentPage.value))
const paginationButtonClass = 'pr-pagination__button inline-grid min-h-[2.375rem] min-w-[2.375rem] cursor-pointer place-items-center rounded-[var(--pr-radius-md)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] px-[var(--pr-space-3)] font-[650] text-[color:var(--pr-color-text)] transition-[background-color,border-color,color] duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)] hover:not-disabled:bg-[var(--pr-color-surface-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)] disabled:cursor-not-allowed disabled:opacity-[0.58]'
const paginationActiveClass = 'pr-pagination__button--active border-[var(--pr-color-primary)] bg-[var(--pr-color-primary)] text-[color:var(--pr-color-primary-contrast)] hover:not-disabled:border-[var(--pr-color-primary-hover)] hover:not-disabled:bg-[var(--pr-color-primary-hover)]'

function go(nextPage: number) {
  if (!isDisabled.value && nextPage >= 1 && nextPage <= currentPageCount.value) {
    emit('update:page', nextPage)
  }
}
</script>

<template>
  <nav class="pr-pagination inline-flex flex-wrap items-center gap-(--pr-space-2)" aria-label="Pagination">
    <button class="pr-pagination__prev" :class="paginationButtonClass" type="button" :disabled="isDisabled || currentPage <= 1" aria-label="Page precedente" @click="go(currentPage - 1)">
      <ChevronLeft :size="16" aria-hidden="true" />
    </button>
    <template v-for="(item, index) in pages" :key="`${item}-${index}`">
      <span v-if="item === 'ellipsis'" class="pr-pagination__ellipsis inline-grid min-h-[2.375rem] min-w-[2.375rem] place-items-center text-[color:var(--pr-color-text-muted)]" aria-hidden="true">&hellip;</span>
      <button
        v-else
        :class="[paginationButtonClass, item === currentPage ? paginationActiveClass : '']"
        type="button"
        :aria-current="item === currentPage ? 'page' : undefined"
        :disabled="isDisabled"
        @click="go(item)"
      >
        {{ item }}
      </button>
    </template>
    <button class="pr-pagination__next" :class="paginationButtonClass" type="button" :disabled="isDisabled || currentPage >= currentPageCount" aria-label="Page suivante" @click="go(currentPage + 1)">
      <ChevronRight :size="16" aria-hidden="true" />
    </button>
  </nav>
</template>
