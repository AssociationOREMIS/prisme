<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { MoreHorizontal } from '@lucide/vue'
import { PrButton } from '../../atoms/Button'
import { PrCheckbox } from '../../atoms/Checkbox'
import { PrInput } from '../../atoms/Input'
import { PrSkeleton } from '../../atoms/Skeleton'
import { PrDropdownMenu } from '../DropdownMenu'
import PrDataTableColumnHeader from './PrDataTableColumnHeader.vue'
import PrDataTablePagination from './PrDataTablePagination.vue'
import PrDataTableViewOptions from './PrDataTableViewOptions.vue'
import type { PrDataTableColumn, PrDataTableProps, PrDataTableRowAction } from './types'
import { compareDataTableValues } from './utils'

const props = withDefaults(defineProps<PrDataTableProps>(), {
  columns: () => [],
  rows: () => [],
  data: undefined,
  rowKey: 'id',
  loading: false,
  isLoading: false,
  emptyText: 'Aucune donnee',
  noResultsMessage: undefined,
  pageSize: 10,
  pageSizeOptions: () => [10, 20, 30, 40, 50],
  selectable: false,
  displayPagination: true,
  displayViewOptions: true,
  hideSelectedRowsCount: true,
  filterKey: undefined,
  filterPlaceholder: undefined,
  rowActions: () => [],
})

const emit = defineEmits<{
  'update:selectedRows': [rows: Record<string, unknown>[]]
  rowAction: [action: PrDataTableRowAction, row: Record<string, unknown>]
}>()

const page = ref(1)
const activePageSize = ref(props.pageSize)
const sortKey = ref('')
const sortDirection = ref<'asc' | 'desc'>('asc')
const filterValue = ref('')
const selectedKeys = ref(new Set<string>())
const hiddenColumnKeys = ref(new Set<string>())

const slots = defineSlots<{
  toolbar?: (props: { filterValue: string }) => unknown
  [key: `cell-${string}`]: (props: { value: unknown, row: Record<string, unknown>, column: PrDataTableColumn }) => unknown
  'row-actions'?: (props: { row: Record<string, unknown> }) => unknown
}>()

const isLoading = computed(() => props.loading || props.isLoading)
const columns = computed(() => props.columns)
const sourceRows = computed(() => props.data ?? props.rows)
const emptyMessage = computed(() => props.noResultsMessage ?? props.emptyText)
const filterColumnKey = computed(() => props.filterKey ?? columns.value.find((column) => column.filterable !== false)?.key ?? '')
const pageSizeOptions = computed(() => props.pageSizeOptions)
const hasRowActions = computed(() => Boolean(props.rowActions.length || 'row-actions' in slots))
const hideSelectedRowsCount = computed(() => props.hideSelectedRowsCount)

const visibleColumns = computed(() =>
  columns.value.filter((column) => !hiddenColumnKeys.value.has(column.key)),
)

const filteredRows = computed(() => {
  const query = filterValue.value.trim().toLocaleLowerCase()
  if (!query || !filterColumnKey.value) return sourceRows.value

  return sourceRows.value.filter((row) => {
    const value = row[filterColumnKey.value]
    return String(value ?? '').toLocaleLowerCase().includes(query)
  })
})

const sortedRows = computed(() => {
  if (!sortKey.value) return filteredRows.value

  return [...filteredRows.value].sort((a, b) => {
    const left = a[sortKey.value]
    const right = b[sortKey.value]
    const result = compareDataTableValues(left, right)
    return sortDirection.value === 'asc' ? result : -result
  })
})

const pageCount = computed(() => Math.max(1, Math.ceil(sortedRows.value.length / activePageSize.value)))
const visibleRows = computed(() => {
  if (!props.displayPagination) return sortedRows.value
  const start = (page.value - 1) * activePageSize.value
  return sortedRows.value.slice(start, start + activePageSize.value)
})

const selectedRows = computed(() => sourceRows.value.filter((row) => selectedKeys.value.has(rowId(row))))
const allPageRowsSelected = computed(() => visibleRows.value.length > 0 && visibleRows.value.every((row) => selectedKeys.value.has(rowId(row))))
const somePageRowsSelected = computed(() => visibleRows.value.some((row) => selectedKeys.value.has(rowId(row))) && !allPageRowsSelected.value)
const selectAllState = computed(() => allPageRowsSelected.value ? true : somePageRowsSelected.value ? 'indeterminate' : false)
const totalColumnCount = computed(() => visibleColumns.value.length + (props.selectable ? 1 : 0) + (hasRowActions.value ? 1 : 0))
const skeletonRows = computed(() => Array.from({ length: Math.min(activePageSize.value, 5) }, (_, index) => index))

watch(() => props.pageSize, (value) => {
  activePageSize.value = value
})

watch([filterValue, activePageSize, sortKey, sortDirection], () => {
  page.value = 1
})

watch(pageCount, (count) => {
  if (page.value > count) page.value = count
})

watch(sourceRows, () => {
  const availableKeys = new Set(sourceRows.value.map(rowId))
  selectedKeys.value = new Set([...selectedKeys.value].filter((key) => availableKeys.has(key)))
  syncSelection()
})

watch(() => props.columns, (columns) => {
  hiddenColumnKeys.value = new Set(columns.filter((column) => column.hidden).map((column) => column.key))
}, { immediate: true })

function rowId(row: Record<string, unknown>) {
  return String(row[props.rowKey])
}

function columnStyle(column: PrDataTableColumn) {
  return {
    width: column.width,
    textAlign: column.align,
  }
}

function cellValue(row: Record<string, unknown>, column: PrDataTableColumn) {
  const value = row[column.key]
  return column.formatter ? column.formatter(value, row, column) : value
}

function setSort(column: PrDataTableColumn, direction?: 'asc' | 'desc') {
  if (!column.sortable) return
  sortKey.value = column.key
  sortDirection.value = direction ?? (sortKey.value === column.key && sortDirection.value === 'asc' ? 'desc' : 'asc')
}

function hideColumn(column: PrDataTableColumn) {
  if (column.hideable === false) return
  const next = new Set(hiddenColumnKeys.value)
  next.add(column.key)
  hiddenColumnKeys.value = next
}

function toggleColumn(column: PrDataTableColumn, checked: boolean) {
  if (column.hideable === false) return
  const next = new Set(hiddenColumnKeys.value)
  if (checked) next.delete(column.key)
  else next.add(column.key)
  hiddenColumnKeys.value = next
}

function syncSelection() {
  emit('update:selectedRows', selectedRows.value)
}

function toggleRow(row: Record<string, unknown>, checked: boolean) {
  const next = new Set(selectedKeys.value)
  if (checked) next.add(rowId(row))
  else next.delete(rowId(row))
  selectedKeys.value = next
  syncSelection()
}

function togglePageRows(checked: boolean) {
  const next = new Set(selectedKeys.value)
  visibleRows.value.forEach((row) => {
    if (checked) next.add(rowId(row))
    else next.delete(rowId(row))
  })
  selectedKeys.value = next
  syncSelection()
}

function setPageSize(value: number) {
  activePageSize.value = value
}

function goToPage(nextPage: number) {
  page.value = Math.min(Math.max(nextPage, 1), pageCount.value)
}
</script>

<template>
  <div class="pr-data-table flex flex-col gap-[var(--pr-space-4)]">
    <div v-if="$slots.toolbar || filterColumnKey || displayViewOptions" class="pr-data-table__toolbar flex flex-wrap items-center justify-between gap-[var(--pr-space-3)]">
      <div class="pr-data-table__toolbar-content flex min-w-[min(100%,16rem)] flex-1 items-center gap-[var(--pr-space-2)]">
        <slot name="toolbar" :filter-value="filterValue">
          <PrInput
            v-if="filterColumnKey"
            v-model="filterValue"
            class="pr-data-table__filter h-8 w-[min(100%,16rem)]"
            :placeholder="filterPlaceholder ?? `Filtrer ${columns.find((column) => column.key === filterColumnKey)?.label.toLocaleLowerCase() ?? 'les lignes'}...`"
          />
        </slot>
      </div>

      <PrDataTableViewOptions
        v-if="displayViewOptions"
        :columns="columns"
        :hidden-column-keys="hiddenColumnKeys"
        @toggle-column="toggleColumn"
      />
    </div>

    <div class="pr-data-table__shell overflow-hidden rounded-[var(--pr-radius-md)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)]">
      <div class="pr-data-table__scroll w-full overflow-auto">
        <table class="pr-data-table__table w-full caption-bottom border-collapse text-[length:var(--pr-font-size-sm)] text-[color:var(--pr-color-text)]">
          <thead class="pr-data-table__head border-b border-[var(--pr-color-border)] bg-[var(--pr-color-surface-subtle)]">
            <tr class="pr-data-table__row border-b border-[var(--pr-color-border)] transition-colors last:border-b-0">
              <th v-if="selectable" class="pr-data-table__header h-12 w-[1%] px-[var(--pr-space-4)] text-left align-middle font-bold">
                <PrCheckbox
                  :checked="selectAllState"
                  aria-label="Selectionner la page"
                  @update:checked="togglePageRows(Boolean($event))"
                />
              </th>
              <th
                v-for="column in visibleColumns"
                :key="column.key"
                class="pr-data-table__header h-12 whitespace-nowrap px-[var(--pr-space-4)] text-left align-middle font-bold text-[color:var(--pr-color-text)]"
                :class="column.headerClass"
                :style="columnStyle(column)"
              >
                <PrDataTableColumnHeader
                  :column="column"
                  :sort-key="sortKey"
                  :sort-direction="sortDirection"
                  @sort="setSort"
                  @hide="hideColumn"
                />
              </th>
              <th v-if="hasRowActions" class="pr-data-table__header h-12 w-[1%] px-[var(--pr-space-4)] text-left align-middle font-bold">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="pr-data-table__body">
            <template v-if="isLoading">
              <tr v-for="rowIndex in skeletonRows" :key="rowIndex" class="pr-data-table__row border-b border-[var(--pr-color-border)] last:border-b-0">
                <td v-if="selectable" class="pr-data-table__cell p-[var(--pr-space-4)] align-middle">
                  <PrSkeleton class="size-4 rounded-[var(--pr-radius-sm)]" />
                </td>
                <td
                  v-for="column in visibleColumns"
                  :key="column.key"
                  class="pr-data-table__cell p-[var(--pr-space-4)] align-middle"
                >
                  <PrSkeleton class="h-6 w-full rounded-[var(--pr-radius-md)]" />
                </td>
                <td v-if="hasRowActions" class="pr-data-table__cell p-[var(--pr-space-4)] align-middle">
                  <PrSkeleton class="ml-auto size-8 rounded-[var(--pr-radius-md)]" />
                </td>
              </tr>
            </template>

            <tr v-else-if="visibleRows.length === 0" class="pr-data-table__row">
              <td :colspan="totalColumnCount" class="pr-data-table__cell h-24 p-[var(--pr-space-4)] text-center align-middle text-[color:var(--pr-color-text-muted)]">
                {{ emptyMessage }}
              </td>
            </tr>

            <template v-else>
              <tr
                v-for="row in visibleRows"
                :key="rowId(row)"
                class="pr-data-table__row border-b border-[var(--pr-color-border)] transition-colors last:border-b-0 hover:bg-[var(--pr-color-surface-subtle)] data-[state=selected]:bg-[var(--pr-color-primary-soft)]"
                :data-state="selectedKeys.has(rowId(row)) ? 'selected' : undefined"
              >
                <td v-if="selectable" class="pr-data-table__cell p-[var(--pr-space-4)] align-middle">
                  <PrCheckbox
                    :checked="selectedKeys.has(rowId(row))"
                    :aria-label="`Selectionner ${rowId(row)}`"
                    @update:checked="toggleRow(row, Boolean($event))"
                  />
                </td>
                <td
                  v-for="column in visibleColumns"
                  :key="column.key"
                  class="pr-data-table__cell p-[var(--pr-space-4)] align-middle"
                  :class="column.class"
                  :style="columnStyle(column)"
                >
                  <slot :name="`cell-${column.key}`" :value="row[column.key]" :row="row" :column="column">
                    {{ cellValue(row, column) }}
                  </slot>
                </td>
                <td v-if="hasRowActions" class="pr-data-table__cell p-[var(--pr-space-4)] align-middle">
                  <slot name="row-actions" :row="row">
                    <PrDropdownMenu align="end" label="Actions">
                      <template #trigger>
                        <PrButton class="ml-auto size-8 p-0" variant="ghost" size="sm" aria-label="Actions">
                          <MoreHorizontal :size="16" aria-hidden="true" />
                        </PrButton>
                      </template>
                      <template #default="{ item, itemClass, dangerItemClass }">
                        <component
                          :is="item"
                          v-for="action in rowActions"
                          :key="action.label"
                          :class="action.danger ? dangerItemClass : itemClass"
                          :disabled="action.disabled"
                          @click="emit('rowAction', action, row)"
                        >
                          {{ action.label }}
                        </component>
                      </template>
                    </PrDropdownMenu>
                  </slot>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <PrDataTablePagination
      v-if="displayPagination"
      :page="page"
      :page-count="pageCount"
      :page-size="activePageSize"
      :page-size-options="pageSizeOptions"
      :selected-rows-count="selectedRows.length"
      :filtered-rows-count="filteredRows.length"
      :hide-selected-rows-count="hideSelectedRowsCount"
      @update:page="goToPage"
      @update:page-size="setPageSize"
    />
  </div>
</template>
