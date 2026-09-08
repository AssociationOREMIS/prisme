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

export interface PrDataTableSort {
  key: string
  direction: 'asc' | 'desc'
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
  /**
   * When true, `rows`/`data` is expected to already contain only the current
   * page (sorted and filtered by the backend). Pagination, sorting and
   * filtering are no longer computed locally: `page`, `sort` and `filter`
   * become controlled inputs, and their changes are emitted instead of
   * applied, so the parent can refetch from the server.
   */
  serverSide?: boolean
  /** Total row count across all pages. Required when `serverSide` is true. */
  totalRows?: number
  /** Controlled current page, used when `serverSide` is true. */
  page?: number
  /** Controlled sort state, used when `serverSide` is true. */
  sort?: PrDataTableSort | null
  /** Controlled filter value, used when `serverSide` is true. */
  filter?: string
}
