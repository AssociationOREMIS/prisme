<script setup lang="ts">
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from '@lucide/vue'
import { PrButton } from '../../atoms/Button'
import { PrSelect } from '../Select'

defineProps<{
  page: number
  pageCount: number
  pageSize: number
  pageSizeOptions: number[]
  selectedRowsCount: number
  filteredRowsCount: number
  hideSelectedRowsCount: boolean
}>()

const emit = defineEmits<{
  'update:page': [value: number]
  'update:pageSize': [value: number]
}>()
</script>

<template>
  <div class="pr-data-table__pagination flex flex-wrap items-center gap-[var(--pr-space-4)] px-[var(--pr-space-2)]">
    <p v-if="selectedRowsCount > 0 && !hideSelectedRowsCount" class="m-0 flex-1 text-[length:var(--pr-font-size-sm)] text-[color:var(--pr-color-text-muted)]">
      {{ selectedRowsCount }} sur {{ filteredRowsCount }} ligne(s) selectionnee(s).
    </p>
    <span v-else class="flex-1" />

    <div class="flex flex-wrap items-center gap-[var(--pr-space-3)] sm:gap-[var(--pr-space-6)]">
      <div class="flex items-center gap-[var(--pr-space-2)]">
        <p class="m-0 text-[length:var(--pr-font-size-sm)] font-semibold">Lignes par page</p>
        <PrSelect
          class="w-[4.75rem]"
          :model-value="String(pageSize)"
          :options="pageSizeOptions.map((size) => ({ label: String(size), value: String(size) }))"
          @update:model-value="emit('update:pageSize', Number($event))"
        />
      </div>

      <div class="flex w-[7rem] items-center justify-center text-[length:var(--pr-font-size-sm)] font-semibold">
        Page {{ page }} sur {{ pageCount }}
      </div>

      <div class="flex items-center gap-[var(--pr-space-2)]">
        <PrButton class="hidden size-8 p-0 lg:inline-flex" variant="secondary" size="sm" :disabled="page <= 1" aria-label="Premiere page" @click="emit('update:page', 1)">
          <ChevronsLeft :size="16" aria-hidden="true" />
        </PrButton>
        <PrButton class="size-8 p-0" variant="secondary" size="sm" :disabled="page <= 1" aria-label="Page precedente" @click="emit('update:page', page - 1)">
          <ChevronLeft :size="16" aria-hidden="true" />
        </PrButton>
        <PrButton class="size-8 p-0" variant="secondary" size="sm" :disabled="page >= pageCount" aria-label="Page suivante" @click="emit('update:page', page + 1)">
          <ChevronRight :size="16" aria-hidden="true" />
        </PrButton>
        <PrButton class="hidden size-8 p-0 lg:inline-flex" variant="secondary" size="sm" :disabled="page >= pageCount" aria-label="Derniere page" @click="emit('update:page', pageCount)">
          <ChevronsRight :size="16" aria-hidden="true" />
        </PrButton>
      </div>
    </div>
  </div>
</template>
