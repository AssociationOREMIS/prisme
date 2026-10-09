<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import { buildPageHref, buildPaginationItems } from './utils'
import { usePrMessages } from '../../../i18n/context'

export interface PrPaginationProps {
  page?: number
  pageCount?: number
  /** Alternative to `pageCount`: total row count, combined with `pageSize` to compute it — mirrors `PrDataTable`'s server-side pagination so a consumer using `fromLaravelPaginator` doesn't have to compute `pageCount` by hand. Ignored when `pageCount` is set. */
  totalRows?: number
  /** Row count per page, used with `totalRows` to compute `pageCount`. */
  pageSize?: number
  disabled?: boolean
  /** Renders real links instead of buttons, for a list paginated by the server (Blade): the name of the query parameter holding the page (`$paginator->getPageName()`, usually `page`). Each link is the current address with only that parameter changed, so filters and the page of another list are kept. */
  pageParam?: string
  /** With `pageParam`: anchor added to the links (the id of the list or its title), so the next page opens on the list instead of the top of the page. */
  fragment?: string
}

const props = withDefaults(defineProps<PrPaginationProps>(), {
  page: undefined,
  pageCount: undefined,
  totalRows: undefined,
  pageSize: 10,
  disabled: false,
  pageParam: undefined,
  fragment: undefined,
})

const messages = usePrMessages()

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
// A disabled link has no `disabled` state: `aria-disabled` carries the same look.
const paginationButtonClass = 'pr-pagination__button pr:inline-grid pr:min-h-[2.375rem] pr:min-w-[2.375rem] pr:cursor-pointer pr:place-items-center pr:rounded-[var(--pr-radius-md)] pr:border pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)] pr:px-[var(--pr-space-3)] pr:font-[650] pr:text-[color:var(--pr-color-text)] pr:no-underline pr:transition-[background-color,border-color,color] pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)] pr:hover:not-disabled:not-aria-disabled:bg-[var(--pr-color-surface-subtle)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)] pr:disabled:cursor-not-allowed pr:disabled:opacity-[0.58] pr:aria-disabled:cursor-not-allowed pr:aria-disabled:opacity-[0.58]'
const paginationActiveClass = 'pr-pagination__button--active pr:border-[var(--pr-color-primary)] pr:bg-[var(--pr-color-primary)] pr:text-[color:var(--pr-color-primary-contrast)] pr:hover:not-disabled:not-aria-disabled:border-[var(--pr-color-primary-hover)] pr:hover:not-disabled:not-aria-disabled:bg-[var(--pr-color-primary-hover)]'

const asLinks = computed(() => props.pageParam !== undefined && props.pageParam !== '')

const controlTag = computed(() => (asLinks.value ? 'a' : 'button'))

/**
 * Attributes of the control leading to `target`: a button, or with
 * `pageParam` a link the browser (or Prisme's navigation) follows.
 */
function control(target: number, unavailable: boolean): Record<string, string | boolean> {
  if (!asLinks.value) {
    return { type: 'button', disabled: unavailable }
  }

  if (unavailable || typeof window === 'undefined') {
    return { role: 'link', 'aria-disabled': 'true' }
  }

  return { href: buildPageHref(window.location.href, props.pageParam!, target, props.fragment) }
}

function go(nextPage: number) {
  if (!isDisabled.value && nextPage >= 1 && nextPage <= currentPageCount.value) {
    internalPage.value = nextPage
    emit('update:page', nextPage)
  }
}
</script>

<template>
  <nav class="pr-pagination pr:inline-flex pr:flex-wrap pr:items-center pr:gap-(--pr-space-2)" :aria-label="messages.pagination.label">
    <component :is="controlTag" v-bind="control(currentPage - 1, isDisabled || currentPage <= 1)" class="pr-pagination__prev" :class="paginationButtonClass" :aria-label="messages.pagination.previous" @click="go(currentPage - 1)">
      <ChevronLeft :size="16" aria-hidden="true" />
    </component>
    <template v-for="(item, index) in pages" :key="`${item}-${index}`">
      <span v-if="item === 'ellipsis'" class="pr-pagination__ellipsis pr:inline-grid pr:min-h-[2.375rem] pr:min-w-[2.375rem] pr:place-items-center pr:text-[color:var(--pr-color-text-muted)]" aria-hidden="true">&hellip;</span>
      <component
        :is="controlTag"
        v-else
        v-bind="control(item, isDisabled)"
        :class="[paginationButtonClass, item === currentPage ? paginationActiveClass : '']"
        :aria-current="item === currentPage ? 'page' : undefined"
        @click="go(item)"
      >
        {{ item }}
      </component>
    </template>
    <component :is="controlTag" v-bind="control(currentPage + 1, isDisabled || currentPage >= currentPageCount)" class="pr-pagination__next" :class="paginationButtonClass" :aria-label="messages.pagination.next" @click="go(currentPage + 1)">
      <ChevronRight :size="16" aria-hidden="true" />
    </component>
  </nav>
</template>
