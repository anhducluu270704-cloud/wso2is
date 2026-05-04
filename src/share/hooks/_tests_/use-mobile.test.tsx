
import { act, renderHook } from '@testing-library/react'
import { useIsMobile } from '../use-mobile'

describe('share/hooks/use-mobile', () => {
  const originalMatchMedia = window.matchMedia

  afterEach(() => {
    Object.defineProperty(window, 'matchMedia', { value: originalMatchMedia, writable: true })
  })

  it('mobile khi innerWidth < 768', () => {
    Object.defineProperty(window, 'innerWidth', { value: 767, writable: true })
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: true,
      media: query,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })) as unknown as typeof window.matchMedia

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(true)
  })

  it('cập nhật state khi viewport đổi và cleanup listener', () => {
    const removeEventListener = jest.fn()
    let changeHandler: (() => void) | undefined

    Object.defineProperty(window, 'innerWidth', { value: 768, writable: true })
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: (_event: string, handler: () => void) => {
        changeHandler = handler
      },
      removeEventListener,
      dispatchEvent: jest.fn(),
    })) as unknown as typeof window.matchMedia

    const { result, unmount } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)

    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 500, writable: true })
      changeHandler?.()
    })

    expect(result.current).toBe(true)

    unmount()
    expect(removeEventListener).toHaveBeenCalledWith('change', changeHandler)
  })
})