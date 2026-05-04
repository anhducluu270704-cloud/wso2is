import { renderHook, act } from '@testing-library/react'
import { useVisibleCountUrlSync } from '../use-visible-count-url'

const mockReplace = jest.fn()

const mockPathname = '/en/api-products'

const mockSearchParamsRef = { current: new URLSearchParams() }

jest.mock('@/i18n/navigation', () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({ replace: mockReplace }),
}))
jest.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParamsRef.current,
}))

function queryFromReplaceCall(index: number) {
  const href = String(mockReplace.mock.calls[index]?.[0] ?? '')
  return href.split('?')[1] ?? ''
}

describe('useVisibleCountUrlSync', () => {
  const defaultPageSize = 8

  beforeEach(() => {
    mockReplace.mockClear()
    mockSearchParamsRef.current = new URLSearchParams()
  })

  it('chỉ set limit, không ghi page (mặc định parse = trang 1)', () => {
    const { result } = renderHook(() =>
      useVisibleCountUrlSync({ defaultPageSize })
    )

    act(() => {
      result.current.syncVisibleWindowToUrl(16, 100)
    })

    expect(mockReplace).toHaveBeenCalledTimes(1)
    const params = new URLSearchParams(queryFromReplaceCall(0))
    expect(params.get('page')).toBeNull()
    expect(params.get('limit')).toBe('16')
  })

  it('xóa limit khi visibleCount <= defaultPageSize', () => {
    mockSearchParamsRef.current = new URLSearchParams('limit=16&page=1')
    const { result } = renderHook(() =>
      useVisibleCountUrlSync({ defaultPageSize })
    )

    act(() => {
      result.current.syncVisibleWindowToUrl(8, 100)
    })

    const params = new URLSearchParams(queryFromReplaceCall(0))
    expect(params.get('limit')).toBeNull()
    expect(params.get('page')).toBeNull()
  })

  it('cap theo total', () => {
    const { result } = renderHook(() =>
      useVisibleCountUrlSync({ defaultPageSize })
    )

    act(() => {
      result.current.syncVisibleWindowToUrl(50, 17)
    })

    expect(new URLSearchParams(queryFromReplaceCall(0)).get('limit')).toBe(
      '17'
    )
  })

  it('không replace nếu page và limit đã khớp', () => {
    mockSearchParamsRef.current = new URLSearchParams('page=1&limit=16')
    const { result } = renderHook(() =>
      useVisibleCountUrlSync({ defaultPageSize })
    )

    act(() => {
      result.current.syncVisibleWindowToUrl(16, 100)
    })

    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('vẫn replace khi cần bỏ page (vd. từ page=2 về cửa sổ đầu)', () => {
    mockSearchParamsRef.current = new URLSearchParams('page=2&limit=16')
    const { result } = renderHook(() =>
      useVisibleCountUrlSync({ defaultPageSize })
    )

    act(() => {
      result.current.syncVisibleWindowToUrl(16, 100)
    })

    expect(mockReplace).toHaveBeenCalled()
    expect(new URLSearchParams(queryFromReplaceCall(0)).get('page')).toBeNull()
  })

  it('giữ các query khác (vd. keyword)', () => {
    mockSearchParamsRef.current = new URLSearchParams('keyword=loan')
    const { result } = renderHook(() =>
      useVisibleCountUrlSync({ defaultPageSize })
    )

    act(() => {
      result.current.syncVisibleWindowToUrl(16, 50)
    })

    const params = new URLSearchParams(queryFromReplaceCall(0))
    expect(params.get('keyword')).toBe('loan')
    expect(params.get('limit')).toBe('16')
  })
})
