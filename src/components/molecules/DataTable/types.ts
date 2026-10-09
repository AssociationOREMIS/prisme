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
  /** `danger` colors a destructive action (Supprimer), like PrButton's `tone`. */
  tone?: 'danger'
  disabled?: boolean
}

export interface PrDataTableSort {
  key: string
  direction: 'asc' | 'desc'
}

export interface PrDataTableProps {
  columns?: PrDataTableColumn[]
  rows?: Record<string, unknown>[]
  rowKey?: string
  loading?: boolean
  /** Shown when the table has no row at all. */
  emptyText?: string
  /** Shown when the search filter matches no row (« Aucun bénévole ne correspond »). Defaults to « Aucun résultat ». */
  noResultsMessage?: string
  pageSize?: number
  pageSizeOptions?: number[]
  selectable?: boolean
  hidePagination?: boolean
  hideViewOptions?: boolean
  /** Shows « 3 sur 40 ligne(s) sélectionnée(s) » under a `selectable` table. */
  showSelectedRowsCount?: boolean
  filterKey?: string
  filterPlaceholder?: string
  rowActions?: PrDataTableRowAction[]
  /**
   * When true, `rows` is expected to already contain only the current
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
