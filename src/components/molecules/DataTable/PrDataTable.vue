<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { MoreHorizontal } from '@lucide/vue'
import { PrButton } from '../../atoms/Button'
import { PrCheckbox } from '../../atoms/Checkbox'
import { PrInput } from '../../atoms/Input'
import { PrSkeleton } from '../../atoms/Skeleton'
import { PrDropdownMenu } from '../DropdownMenu'
import PrDataTableColumnHeader from './PrDataTableColumnHeader.vue'
import PrDataTablePagination from './PrDataTablePagination.vue'
import PrDataTableViewOptions from './PrDataTableViewOptions.vue'
import type { PrDataTableColumn, PrDataTableProps, PrDataTableRowAction, PrDataTableSort } from './types'
import { compareDataTableValues } from './utils'

const props = withDefaults(defineProps<PrDataTableProps>(), {
  columns: () => [],
  rows: () => [],
  data: undefined,
  rowKey: 'id',
  loading: false,
  isLoading: false,
  emptyText: 'Aucune donnée',
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
  serverSide: false,
  totalRows: 0,
  page: undefined,
  sort: undefined,
  filter: undefined,
})

const emit = defineEmits<{
  'update:selectedRows': [rows: Record<string, unknown>[]]
  rowAction: [action: PrDataTableRowAction, row: Record<string, unknown>]
  'update:page': [value: number]
  'update:pageSize': [value: number]
  'update:sort': [value: PrDataTableSort | null]
  'update:filter': [value: string]
}>()

const page = ref(props.serverSide ? (props.page ?? 1) : 1)
const activePageSize = ref(props.pageSize)
const sortKey = ref(props.serverSide ? (props.sort?.key ?? '') : '')
const sortDirection = ref<'asc' | 'desc'>(props.serverSide ? (props.sort?.direction ?? 'asc') : 'asc')
const filterValue = ref(props.serverSide ? (props.filter ?? '') : '')
const selectedKeys = ref(new Set<string>())
const hiddenColumnKeys = ref(new Set<string>())
let filterDebounceTimer: ReturnType<typeof setTimeout> | undefined

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
const filterLabel = computed(() => props.filterPlaceholder
  ?? `Filtrer ${columns.value.find((column) => column.key === filterColumnKey.value)?.label.toLocaleLowerCase() ?? 'les lignes'}...`)
// The page size in use is always offered, so the select never falls back to its placeholder.
const pageSizeOptions = computed(() => props.pageSizeOptions.includes(activePageSize.value)
  ? props.pageSizeOptions
  : [...props.pageSizeOptions, activePageSize.value].sort((a, b) => a - b))
const hasRowActions = computed(() => Boolean(props.rowActions.length || 'row-actions' in slots))
const hideSelectedRowsCount = computed(() => props.hideSelectedRowsCount)

const visibleColumns = computed(() =>
  columns.value.filter((column) => !hiddenColumnKeys.value.has(column.key)),
)

const filteredRows = computed(() => {
  if (props.serverSide) return sourceRows.value

  const query = filterValue.value.trim().toLocaleLowerCase()
  if (!query || !filterColumnKey.value) return sourceRows.value

  return sourceRows.value.filter((row) => {
    const value = row[filterColumnKey.value]
    return String(value ?? '').toLocaleLowerCase().includes(query)
  })
})

const sortedRows = computed(() => {
  if (props.serverSide || !sortKey.value) return filteredRows.value

  return [...filteredRows.value].sort((a, b) => {
    const left = a[sortKey.value]
    const right = b[sortKey.value]
    const result = compareDataTableValues(left, right)
    return sortDirection.value === 'asc' ? result : -result
  })
})

const pageCount = computed(() => {
  if (props.serverSide) return Math.max(1, Math.ceil((props.totalRows ?? 0) / activePageSize.value))
  return Math.max(1, Math.ceil(sortedRows.value.length / activePageSize.value))
})
const visibleRows = computed(() => {
  if (props.serverSide) return sourceRows.value
  if (!props.displayPagination) return sortedRows.value
  const start = (page.value - 1) * activePageSize.value
  return sortedRows.value.slice(start, start + activePageSize.value)
})
const filteredRowsCount = computed(() => (props.serverSide ? (props.totalRows ?? 0) : filteredRows.value.length))

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
  if (props.serverSide) emit('update:page', 1)
})

watch(pageCount, (count) => {
  if (page.value > count) {
    page.value = count
    if (props.serverSide) emit('update:page', count)
  }
})

watch(() => props.page, (value) => {
  if (props.serverSide && value !== undefined) page.value = value
})

watch(() => props.sort, (value) => {
  if (!props.serverSide) return
  sortKey.value = value?.key ?? ''
  sortDirection.value = value?.direction ?? 'asc'
})

watch(() => props.filter, (value) => {
  if (props.serverSide) filterValue.value = value ?? ''
})

watch(filterValue, (value) => {
  if (!props.serverSide) return
  if (filterDebounceTimer) clearTimeout(filterDebounceTimer)
  filterDebounceTimer = setTimeout(() => emit('update:filter', value), 300)
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

// What the row checkbox announces: the first visible column (a name, a title), not the row's
// technical key, which read as "Sélectionner 42".
function rowLabel(row: Record<string, unknown>): string {
  const first = visibleColumns.value[0]
  const value = first ? row[first.key] : undefined
  return value === undefined || value === null || value === '' ? rowId(row) : String(value)
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
  if (props.serverSide) emit('update:sort', { key: sortKey.value, direction: sortDirection.value })
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
  if (props.serverSide) emit('update:pageSize', value)
}

function goToPage(nextPage: number) {
  const clamped = Math.min(Math.max(nextPage, 1), pageCount.value)
  page.value = clamped
  if (props.serverSide) emit('update:page', clamped)
}

onBeforeUnmount(() => {
  if (filterDebounceTimer) clearTimeout(filterDebounceTimer)
})
</script>

<template>
  <div class="pr-data-table pr:flex pr:flex-col pr:gap-[var(--pr-space-4)]">
    <div v-if="$slots.toolbar || filterColumnKey || displayViewOptions" class="pr-data-table__toolbar pr:flex pr:flex-wrap pr:items-center pr:justify-between pr:gap-[var(--pr-space-3)]">
      <div class="pr-data-table__toolbar-content pr:flex pr:min-w-[min(100%,16rem)] pr:flex-1 pr:items-center pr:gap-[var(--pr-space-2)]">
        <slot name="toolbar" :filter-value="filterValue">
          <PrInput
            v-if="filterColumnKey"
            v-model="filterValue"
            class="pr-data-table__filter pr:h-8 pr:w-full pr:max-w-[28rem]"
            :placeholder="filterLabel"
            :aria-label="filterLabel"
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

    <div class="pr-data-table__shell pr:overflow-hidden pr:rounded-[var(--pr-radius-md)] pr:border pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)]">
      <div class="pr-data-table__scroll pr:w-full pr:overflow-auto">
        <table class="pr-data-table__table pr:w-full pr:caption-bottom pr:border-collapse pr:text-[length:var(--pr-font-size-sm)] pr:text-[color:var(--pr-color-text)]">
          <thead class="pr-data-table__head pr:border-b pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface-subtle)]">
            <tr class="pr-data-table__row pr:border-b pr:border-[var(--pr-color-border)] pr:transition-colors pr:last:border-b-0">
              <th v-if="selectable" class="pr-data-table__header pr:h-12 pr:w-[1%] pr:px-[var(--pr-space-4)] pr:text-left pr:align-middle pr:font-bold">
                <PrCheckbox
                  :checked="selectAllState"
                  aria-label="Sélectionner la page"
                  @update:checked="togglePageRows(Boolean($event))"
                />
              </th>
              <th
                v-for="column in visibleColumns"
                :key="column.key"
                class="pr-data-table__header pr:h-12 pr:whitespace-nowrap pr:px-[var(--pr-space-4)] pr:text-left pr:align-middle pr:font-bold pr:text-[color:var(--pr-color-text)]"
                :class="column.headerClass"
                :style="columnStyle(column)"
                :aria-sort="sortKey === column.key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined"
              >
                <PrDataTableColumnHeader
                  :column="column"
                  :sort-key="sortKey"
                  :sort-direction="sortDirection"
                  @sort="setSort"
                  @hide="hideColumn"
                />
              </th>
              <th v-if="hasRowActions" class="pr-data-table__header pr:h-12 pr:w-[1%] pr:px-[var(--pr-space-4)] pr:text-left pr:align-middle pr:font-bold">
                <span class="pr:sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="pr-data-table__body">
            <template v-if="isLoading">
              <tr v-for="rowIndex in skeletonRows" :key="rowIndex" class="pr-data-table__row pr:border-b pr:border-[var(--pr-color-border)] pr:last:border-b-0">
                <td v-if="selectable" class="pr-data-table__cell pr:p-[var(--pr-space-4)] pr:align-middle">
                  <PrSkeleton class="pr:size-4 pr:rounded-[var(--pr-radius-sm)]" />
                </td>
                <td
                  v-for="column in visibleColumns"
                  :key="column.key"
                  class="pr-data-table__cell pr:p-[var(--pr-space-4)] pr:align-middle"
                >
                  <PrSkeleton class="pr:h-6 pr:w-full pr:rounded-[var(--pr-radius-md)]" />
                </td>
                <td v-if="hasRowActions" class="pr-data-table__cell pr:p-[var(--pr-space-4)] pr:align-middle">
                  <PrSkeleton class="pr:ml-auto pr:size-8 pr:rounded-[var(--pr-radius-md)]" />
                </td>
              </tr>
            </template>

            <tr v-else-if="visibleRows.length === 0" class="pr-data-table__row">
              <td :colspan="totalColumnCount" class="pr-data-table__cell pr:h-24 pr:p-[var(--pr-space-4)] pr:text-center pr:align-middle pr:text-[color:var(--pr-color-text-muted)]">
                {{ emptyMessage }}
              </td>
            </tr>

            <template v-else>
              <tr
                v-for="row in visibleRows"
                :key="rowId(row)"
                class="pr-data-table__row pr:border-b pr:border-[var(--pr-color-border)] pr:transition-colors pr:last:border-b-0 pr:hover:bg-[var(--pr-color-surface-subtle)] pr:data-[state=selected]:bg-[var(--pr-color-primary-soft)]"
                :data-state="selectedKeys.has(rowId(row)) ? 'selected' : undefined"
              >
                <td v-if="selectable" class="pr-data-table__cell pr:p-[var(--pr-space-4)] pr:align-middle">
                  <PrCheckbox
                    :checked="selectedKeys.has(rowId(row))"
                    :aria-label="`Sélectionner ${rowLabel(row)}`"
                    @update:checked="toggleRow(row, Boolean($event))"
                  />
                </td>
                <td
                  v-for="column in visibleColumns"
                  :key="column.key"
                  class="pr-data-table__cell pr:p-[var(--pr-space-4)] pr:align-middle"
                  :class="column.class"
                  :style="columnStyle(column)"
                >
                  <slot :name="`cell-${column.key}`" :value="row[column.key]" :row="row" :column="column">
                    {{ cellValue(row, column) }}
                  </slot>
                </td>
                <td v-if="hasRowActions" class="pr-data-table__cell pr:p-[var(--pr-space-4)] pr:align-middle">
                  <slot name="row-actions" :row="row">
                    <PrDropdownMenu align="end" label="Actions">
                      <template #trigger>
                        <PrButton class="pr:ml-auto pr:size-8 pr:p-0" variant="ghost" size="sm" aria-label="Actions">
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
      :filtered-rows-count="filteredRowsCount"
      :hide-selected-rows-count="hideSelectedRowsCount"
      @update:page="goToPage"
      @update:page-size="setPageSize"
    />
  </div>
</template>
