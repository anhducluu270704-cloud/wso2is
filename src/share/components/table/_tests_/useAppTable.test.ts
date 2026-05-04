
import { renderHook } from '@testing-library/react'
import { useAppTable } from '../use-app-table'

const mockOnPageChange = jest.fn()
jest.mock('@/share/hooks/use-pagination', () => ({
  usePaginationRouter: () => ({
    currentPage: 2,
    totalPages: 9,
    pageSize: 25,
    onPageChange: mockOnPageChange,
  }),
}))

let capturedOptions: any
jest.mock('@tanstack/react-table', () => ({
  getCoreRowModel: () => 'core',
  useReactTable: (opts: any) => {
    capturedOptions = opts
    return { __table: true }
  },
}))

describe('share/components/table/useAppTable', () => {
  beforeEach(() => {
    mockOnPageChange.mockClear()
    capturedOptions = undefined
  })

  it('uses metadata fallback when metadata not provided', () => {
    const { result } = renderHook(() =>
      useAppTable({
        data: [{ id: 1 }],
        columns: [] as any,
      })
    )
    expect(result.current).toEqual({ __table: true })
    expect(capturedOptions.manualPagination).toBe(true)
    expect(capturedOptions.pageCount).toBe(9)
  })

  it('onPaginationChange supports object and functional updater', () => {
    renderHook(() =>
      useAppTable({
        data: [],
        columns: [] as any,
      })
    )

    capturedOptions.onPaginationChange({ pageIndex: 5, pageSize: 25 })
    expect(mockOnPageChange).toHaveBeenCalledWith(5)

    capturedOptions.onPaginationChange((prev: any) => ({
      ...prev,
      pageIndex: 7,
    }))
    expect(mockOnPageChange).toHaveBeenCalledWith(7)
  })
})

