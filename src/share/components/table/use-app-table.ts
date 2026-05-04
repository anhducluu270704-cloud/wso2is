// hooks/useAppTable.ts
import { Pagination } from '@/models/api/common'
import { usePaginationRouter } from '@/share/hooks/use-pagination'
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  OnChangeFn,
  SortingState,
  useReactTable,
  Table,
  PaginationState,
  VisibilityState,
} from '@tanstack/react-table'

type UseAppTableProps<TData, TValue = unknown> = {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  sort?: {
    state?: SortingState
    updateSort?: OnChangeFn<SortingState>
  }
  filterColumn?: {
    state?: ColumnFiltersState
    setColumnFilters?: OnChangeFn<ColumnFiltersState>
  }
  metadata?: Pagination
  /** Initial column visibility (`true` = visible). Maps column id → visibility. */
  initialColumnVisibility?: VisibilityState
  debug?: boolean
}

export function useAppTable<TData, TValue = unknown>({
  data,
  columns,
  metadata,
  filterColumn,
  sort,
  initialColumnVisibility,
  debug = false,
}: UseAppTableProps<TData, TValue>): Table<TData> {
  const { currentPage, totalPages, onPageChange, pageSize } =
    usePaginationRouter({
      ...metadata || {
        total: data.length,
        offset: 0,
        limit: 9999,
        next: '',
        previous: '',
      },
    })
  const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next =
      typeof updater === 'function'
        ? updater({
          pageIndex: currentPage,
          pageSize: pageSize,
        })
        : updater
    onPageChange(next.pageIndex)
  }

  return useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      columnVisibility: initialColumnVisibility ?? {},
    },
    state: {
      sorting: sort?.state,
      pagination: {
        pageIndex: currentPage,
        pageSize: pageSize,
      },
      columnFilters: filterColumn?.state,
    },
    onSortingChange: sort?.updateSort,
    onPaginationChange: handlePaginationChange,
    onColumnFiltersChange: filterColumn?.setColumnFilters,
    sortDescFirst: false,
    pageCount: totalPages,
    debugTable: debug,
    manualPagination: true,
  })
}
