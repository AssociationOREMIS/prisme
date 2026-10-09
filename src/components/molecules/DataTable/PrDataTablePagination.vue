<script setup lang="ts">
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from '@lucide/vue'
import { PrButton } from '../../atoms/Button'
import { PrSelect } from '../Select'
import { usePrMessages } from '../../../i18n/context'

defineProps<{
  page: number
  pageCount: number
  pageSize: number
  pageSizeOptions: number[]
  selectedRowsCount: number
  filteredRowsCount: number
  hideSelectedRowsCount: boolean
}>()

const messages = usePrMessages()

const emit = defineEmits<{
  'update:page': [value: number]
  'update:pageSize': [value: number]
}>()
</script>

<template>
  <div class="pr-data-table__pagination pr:flex pr:flex-wrap pr:items-center pr:gap-[var(--pr-space-4)] pr:px-[var(--pr-space-2)]">
    <p v-if="selectedRowsCount > 0 && !hideSelectedRowsCount" class="pr:m-0 pr:flex-1 pr:text-[length:var(--pr-font-size-sm)] pr:text-[color:var(--pr-color-text-muted)]">
      {{ messages.dataTable.selectedRows(selectedRowsCount, filteredRowsCount) }}
    </p>
    <span v-else class="pr:flex-1" />

    <div class="pr:flex pr:flex-wrap pr:items-center pr:gap-[var(--pr-space-3)] pr:sm:gap-[var(--pr-space-6)]">
      <div class="pr:flex pr:items-center pr:gap-[var(--pr-space-2)]">
        <p class="pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:font-semibold">{{ messages.dataTable.rowsPerPage }}</p>
        <PrSelect
          class="pr:w-max pr:min-w-[4.75rem]"
          :aria-label="messages.dataTable.rowsPerPage"
          :model-value="String(pageSize)"
          :options="pageSizeOptions.map((size) => ({ label: String(size), value: String(size) }))"
          @update:model-value="emit('update:pageSize', Number($event))"
        />
      </div>

      <div class="pr:flex pr:min-w-[7rem] pr:items-center pr:justify-center pr:text-[length:var(--pr-font-size-sm)] pr:font-semibold">
        {{ messages.dataTable.pageOf(page, pageCount) }}
      </div>

      <div class="pr:flex pr:items-center pr:gap-[var(--pr-space-2)]">
        <PrButton class="pr:hidden pr:size-8 pr:p-0 pr:lg:inline-flex" variant="secondary" size="sm" :disabled="page <= 1" :aria-label="messages.dataTable.firstPage" @click="emit('update:page', 1)">
          <ChevronsLeft :size="16" aria-hidden="true" />
        </PrButton>
        <PrButton class="pr:size-8 pr:p-0" variant="secondary" size="sm" :disabled="page <= 1" :aria-label="messages.dataTable.previousPage" @click="emit('update:page', page - 1)">
          <ChevronLeft :size="16" aria-hidden="true" />
        </PrButton>
        <PrButton class="pr:size-8 pr:p-0" variant="secondary" size="sm" :disabled="page >= pageCount" :aria-label="messages.dataTable.nextPage" @click="emit('update:page', page + 1)">
          <ChevronRight :size="16" aria-hidden="true" />
        </PrButton>
        <PrButton class="pr:hidden pr:size-8 pr:p-0 pr:lg:inline-flex" variant="secondary" size="sm" :disabled="page >= pageCount" :aria-label="messages.dataTable.lastPage" @click="emit('update:page', pageCount)">
          <ChevronsRight :size="16" aria-hidden="true" />
        </PrButton>
      </div>
    </div>
  </div>
</template>
