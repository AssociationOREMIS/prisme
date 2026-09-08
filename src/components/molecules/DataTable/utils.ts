export function compareDataTableValues(left: unknown, right: unknown) {
  if (left == null && right == null) return 0
  if (left == null) return 1
  if (right == null) return -1
  if (left instanceof Date && right instanceof Date) return left.getTime() - right.getTime()
  if (typeof left === 'number' && typeof right === 'number') return left - right
  return String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: 'base' })
}

export interface LaravelPaginatorMeta {
  current_page: number
  per_page: number
  total: number
}

/** The default `LengthAwarePaginator::toJson()` shape returned by `Model::paginate()`. */
export type LaravelFlatPaginatorResponse<T> = LaravelPaginatorMeta & { data: T[] }

/** The shape produced by wrapping a paginator in a Laravel API Resource collection. */
export type LaravelWrappedPaginatorResponse<T> = { data: T[], meta: LaravelPaginatorMeta }

export type LaravelPaginatorResponse<T> = LaravelFlatPaginatorResponse<T> | LaravelWrappedPaginatorResponse<T>

export interface PrServerTableState<T> {
  rows: T[]
  page: number
  pageSize: number
  totalRows: number
}

/**
 * Maps a Laravel `paginate()` JSON response — either the default flat shape
 * or one wrapped in an API Resource collection (`{ data, meta }`) — to the
 * props expected by `PrDataTable` in `serverSide` mode.
 */
export function fromLaravelPaginator<T = Record<string, unknown>>(
  response: LaravelPaginatorResponse<T>,
): PrServerTableState<T> {
  const meta = 'meta' in response ? response.meta : response

  return {
    rows: response.data,
    page: meta.current_page,
    pageSize: meta.per_page,
    totalRows: meta.total,
  }
}
