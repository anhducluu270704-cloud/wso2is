
import { renderHook } from '@testing-library/react'
import { usePaginationRouter } from '../use-pagination'

const mockPush = jest.fn()
const mockSearchParams = jest.fn(() => new URLSearchParams('page=1'))

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

jest.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams(),
}))

describe('share/hooks/use-pagination branch coverage', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockSearchParams.mockReturnValue(new URLSearchParams('page=1'))
  })

  it('sets limit param when limit != DEFAULT_PAGE_SIZE', () => {
    const { result } = renderHook(() =>
      usePaginationRouter({
        total: 100,
        offset: 0,
        limit: 10,
        next: '',
        previous: '',
      } as any)
    )
    result.current.onPageChange(1)
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('limit=10'))
  })

  it('deletes limit param when limit == DEFAULT_PAGE_SIZE', () => {
    mockSearchParams.mockReturnValue(new URLSearchParams('limit=10&page=1'))
    const { result } = renderHook(() =>
      usePaginationRouter({
        total: 100,
        offset: 0,
        limit: 5,
        next: '',
        previous: '',
      } as any)
    )
    result.current.onPageChange(0)
    const called = mockPush.mock.calls[0][0] as string
    expect(called).not.toContain('limit=')
    expect(called).toContain('page=')
  })
})
