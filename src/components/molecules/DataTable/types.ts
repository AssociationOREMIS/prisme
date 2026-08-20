export interface PrDataTableColumn {
  key: string
  label: string
  sortable?: boolean
  filterable?: boolean
  hideable?: boolean
  hidden?: boolean
  class?: string
  headerClass?: string
  align?: 'left' | 'center' | 'right'
  width?: string
  formatter?: (value: unknown, row: Record<string, unknown>, column: PrDataTableColumn) => unknown
}

export interface PrDataTableRowAction {
  label: string
  danger?: boolean
  disabled?: boolean
}

export interface PrDataTableProps {
  columns?: PrDataTableColumn[]
  rows?: Record<string, unknown>[]
  data?: Record<string, unknown>[]
  rowKey?: string
  loading?: boolean
  isLoading?: boolean
  emptyText?: string
  noResultsMessage?: string
  pageSize?: number
  pageSizeOptions?: number[]
  selectable?: boolean
  displayPagination?: boolean
  displayViewOptions?: boolean
  hideSelectedRowsCount?: boolean
  filterKey?: string
  filterPlaceholder?: string
  rowActions?: PrDataTableRowAction[]
}
