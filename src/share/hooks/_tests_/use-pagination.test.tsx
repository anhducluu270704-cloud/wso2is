
import { renderHook } from '@testing-library/react'
import { usePaginationRouter } from '../use-pagination'

const mockPush = jest.fn()
const mockGet = jest.fn()

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))
jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: mockGet,
    toString: () => '',
  }),
}))

describe('share/hooks/use-pagination', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockGet.mockReturnValue(null)
  })

  it('trả về onPageChange, currentPage, totalPages, pageSize', () => {
    const { result } = renderHook(() =>
      usePaginationRouter({ offset: 0, limit: 10, total: 100, next: '', previous: '' })
    )
    expect(typeof result.current.onPageChange).toBe('function')
    expect(typeof result.current.currentPage).toBe('number')
    expect(typeof result.current.totalPages).toBe('number')
    expect(result.current.pageSize).toBe(10)
  })
  it('currentPage = offset/limit', () => {
    const { result } = renderHook(() =>
      usePaginationRouter({ offset: 20, limit: 10, total: 100, next: '', previous: '' })
    )
    expect(result.current.currentPage).toBe(2)
  })
  it('totalPages = ceil(total/limit)', () => {
    const { result } = renderHook(() =>
      usePaginationRouter({ offset: 0, limit: 10, total: 25, next: '', previous: '' })
    )
    expect(result.current.totalPages).toBe(3)
  })

  it('onPageChange gọi router.push với page param', () => {
    const { result } = renderHook(() =>
      usePaginationRouter({ offset: 0, limit: 10, total: 100, next: '', previous: '' })
    )
    result.current.onPageChange(2)
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('page='))
  })

  it('onPageChange set limit khi limit != DEFAULT_PAGE_SIZE', () => {
    mockGet.mockImplementation((k: string) => (k === 'limit' ? '20' : null))
    const { result } = renderHook(() =>
      usePaginationRouter({ offset: 0, limit: 20, total: 100, next: '', previous: '' })
    )
    result.current.onPageChange(1)
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('limit=20'))
  })
})