<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowDown, ArrowUp } from '@lucide/vue'
import { PrCheckbox } from '../../atoms/Checkbox'
import { PrPagination } from '../Pagination'

export interface PrDataTableColumn {
  key: string
  label: string
  sortable?: boolean
}

export interface PrDataTableProps {
  columns?: PrDataTableColumn[]
  rows?: Record<string, unknown>[]
  rowKey?: string
  loading?: boolean
  emptyText?: string
  pageSize?: number
  selectable?: boolean
}

const props = withDefaults(defineProps<PrDataTableProps>(), {
  columns: () => [],
  rows: () => [],
  rowKey: 'id',
  loading: false,
  emptyText: 'Aucune donnee',
  pageSize: 10,
  selectable: false,
})

const emit = defineEmits<{
  'update:selectedRows': [rows: Record<string, unknown>[]]
}>()

const page = ref(1)
const sortKey = ref('')
const sortDirection = ref<'asc' | 'desc'>('asc')
const selectedKeys = ref(new Set<string>())

const sortedRows = computed(() => {
  if (!sortKey.value) return props.rows

  return [...props.rows].sort((a, b) => {
    const left = String(a[sortKey.value] ?? '')
    const right = String(b[sortKey.value] ?? '')
    const result = left.localeCompare(right, undefined, { numeric: true })
    return sortDirection.value === 'asc' ? result : -result
  })
})

const pageCount = computed(() => Math.max(1, Math.ceil(sortedRows.value.length / props.pageSize)))
const visibleRows = computed(() => {
  const start = (page.value - 1) * props.pageSize
  return sortedRows.value.slice(start, start + props.pageSize)
})

function rowId(row: Record<string, unknown>) {
  return String(row[props.rowKey])
}

function sort(column: PrDataTableColumn) {
  if (!column.sortable) return
  if (sortKey.value === column.key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = column.key
    sortDirection.value = 'asc'
  }
}

function syncSelection() {
  emit('update:selectedRows', props.rows.filter((row) => selectedKeys.value.has(rowId(row))))
}

function toggleRow(row: Record<string, unknown>, checked: boolean) {
  const next = new Set(selectedKeys.value)
  if (checked) next.add(rowId(row))
  else next.delete(rowId(row))
  selectedKeys.value = next
  syncSelection()
}
</script>

<template>
  <div class="pr-data-table">
    <div class="pr-table-wrap">
      <table class="pr-table">
        <thead>
          <tr>
            <th v-if="selectable" class="pr-data-table__select-cell">Selection</th>
            <th v-for="column in columns" :key="column.key">
              <button
                v-if="column.sortable"
                class="pr-data-table__sort"
                type="button"
                @click="sort(column)"
              >
                {{ column.label }}
                <ArrowUp v-if="sortKey === column.key && sortDirection === 'asc'" :size="14" />
                <ArrowDown v-else-if="sortKey === column.key" :size="14" />
              </button>
              <span v-else>{{ column.label }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td :colspan="columns.length + (selectable ? 1 : 0)">Chargement...</td>
          </tr>
          <tr v-else-if="visibleRows.length === 0">
            <td :colspan="columns.length + (selectable ? 1 : 0)">{{ emptyText }}</td>
          </tr>
          <tr v-for="row in visibleRows" v-else :key="rowId(row)">
            <td v-if="selectable" class="pr-data-table__select-cell">
              <PrCheckbox
                :checked="selectedKeys.has(rowId(row))"
                :aria-label="`Selectionner ${rowId(row)}`"
                @update:checked="toggleRow(row, Boolean($event))"
              />
            </td>
            <td v-for="column in columns" :key="column.key">{{ row[column.key] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <PrPagination v-if="pageCount > 1" v-model:page="page" :page-count="pageCount" />
  </div>
</template>
