<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import { buildPaginationItems } from './utils'

export interface PrPaginationProps {
  page?: number
  pageCount?: number
  /** Alternative to `pageCount`: total row count, combined with `pageSize` to compute it — mirrors `PrDataTable`'s server-side pagination so a consumer using `fromLaravelPaginator` doesn't have to compute `pageCount` by hand. Ignored when `pageCount` is set. */
  totalRows?: number
  /** Row count per page, used with `totalRows` to compute `pageCount`. */
  pageSize?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<PrPaginationProps>(), {
  page: undefined,
  pageCount: undefined,
  totalRows: undefined,
  pageSize: 10,
  disabled: false,
})

const emit = defineEmits<{
  'update:page': [value: number]
}>()

// Without v-model:page the buttons must still move the current page: keep it locally,
// while a real v-model still takes priority (as the form fields do).
const internalPage = ref(props.page ?? 1)
watch(() => props.page, (value) => {
  if (value !== undefined) internalPage.value = value
})
const currentPage = computed(() => props.page ?? internalPage.value)
const currentPageCount = computed(() => {
  if (props.pageCount !== undefined) return props.pageCount
  if (props.totalRows !== undefined) return Math.max(1, Math.ceil(props.totalRows / props.pageSize))
  return 1
})
const isDisabled = computed(() => props.disabled ?? false)

// Beyond a handful of pages, listing one button per page would be both
// unusable and unbounded (e.g. a server-paginated table with a large total).
// Show first/last plus a window around the current page, with ellipses.
const pages = computed(() => buildPaginationItems(currentPageCount.value, currentPage.value))
const paginationButtonClass = 'pr-pagination__button pr:inline-grid pr:min-h-[2.375rem] pr:min-w-[2.375rem] pr:cursor-pointer pr:place-items-center pr:rounded-[var(--pr-radius-md)] pr:border pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)] pr:px-[var(--pr-space-3)] pr:font-[650] pr:text-[color:var(--pr-color-text)] pr:transition-[background-color,border-color,color] pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)] pr:hover:not-disabled:bg-[var(--pr-color-surface-subtle)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)] pr:disabled:cursor-not-allowed pr:disabled:opacity-[0.58]'
const paginationActiveClass = 'pr-pagination__button--active pr:border-[var(--pr-color-primary)] pr:bg-[var(--pr-color-primary)] pr:text-[color:var(--pr-color-primary-contrast)] pr:hover:not-disabled:border-[var(--pr-color-primary-hover)] pr:hover:not-disabled:bg-[var(--pr-color-primary-hover)]'

function go(nextPage: number) {
  if (!isDisabled.value && nextPage >= 1 && nextPage <= currentPageCount.value) {
    internalPage.value = nextPage
    emit('update:page', nextPage)
  }
}
</script>

<template>
  <nav class="pr-pagination pr:inline-flex pr:flex-wrap pr:items-center pr:gap-(--pr-space-2)" aria-label="Pagination">
    <button class="pr-pagination__prev" :class="paginationButtonClass" type="button" :disabled="isDisabled || currentPage <= 1" aria-label="Page précédente" @click="go(currentPage - 1)">
      <ChevronLeft :size="16" aria-hidden="true" />
    </button>
    <template v-for="(item, index) in pages" :key="`${item}-${index}`">
      <span v-if="item === 'ellipsis'" class="pr-pagination__ellipsis pr:inline-grid pr:min-h-[2.375rem] pr:min-w-[2.375rem] pr:place-items-center pr:text-[color:var(--pr-color-text-muted)]" aria-hidden="true">&hellip;</span>
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
