
import { renderHook, act } from '@testing-library/react'
import {
  FALLBACK_TOAST_DURATION_MS,
  TOAST_EXIT_ANIMATION_MS,
} from '@/constants/application'
import { useInlineToast } from '../use-inline-toast'

describe('share/hooks/use-inline-toast', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('khởi tạo không có toast', () => {
    const { result } = renderHook(() => useInlineToast())
    expect(result.current.inlineToast).toBeNull()
    expect(result.current.isToastExiting).toBe(false)
  })

  it('showSuccess hiển thị toast success', () => {
    const { result } = renderHook(() => useInlineToast())
    act(() => result.current.showSuccess('done'))
    expect(result.current.inlineToast).toEqual({
      type: 'success',
      message: 'done',
      durationMs: undefined,
    })
    expect(result.current.isToastExiting).toBe(false)
  })

  it('showError hiển thị toast error', () => {
    const { result } = renderHook(() => useInlineToast())
    act(() => result.current.showError('fail'))
    expect(result.current.inlineToast).toEqual({
      type: 'error',
      message: 'fail',
      durationMs: undefined,
    })
  })

  it('showWarning hiển thị toast warning', () => {
    const { result } = renderHook(() => useInlineToast())
    act(() => result.current.showWarning('warn'))
    expect(result.current.inlineToast).toEqual({
      type: 'warning',
      message: 'warn',
      durationMs: undefined,
    })
  })

  it('tùy chọn durationMs', () => {
    const { result } = renderHook(() => useInlineToast())
    act(() => result.current.showSuccess('x', { durationMs: 2000 }))
    expect(result.current.inlineToast?.durationMs).toBe(2000)
  })

  it('sau duration và exit animation thì đóng toast', () => {
    const { result } = renderHook(() => useInlineToast())
    act(() => result.current.showSuccess('x', { durationMs: 100 }))

    act(() => jest.advanceTimersByTime(100))
    expect(result.current.isToastExiting).toBe(true)

    act(() => jest.advanceTimersByTime(TOAST_EXIT_ANIMATION_MS))
    expect(result.current.inlineToast).toBeNull()
    expect(result.current.isToastExiting).toBe(false)
  })

  it('dùng FALLBACK_TOAST_DURATION_MS khi không truyền durationMs', () => {
    const { result } = renderHook(() => useInlineToast())
    act(() => result.current.showSuccess('x'))

    act(() => jest.advanceTimersByTime(FALLBACK_TOAST_DURATION_MS))
    expect(result.current.isToastExiting).toBe(true)

    act(() => jest.advanceTimersByTime(TOAST_EXIT_ANIMATION_MS))
    expect(result.current.inlineToast).toBeNull()
  })

  it('toast mới reset isToastExiting', () => {
    const { result } = renderHook(() => useInlineToast())
    act(() => result.current.showSuccess('a', { durationMs: 50 }))
    act(() => jest.advanceTimersByTime(50))
    expect(result.current.isToastExiting).toBe(true)

    act(() => result.current.showSuccess('b'))
    expect(result.current.isToastExiting).toBe(false)
    expect(result.current.inlineToast?.message).toBe('b')
  })

  it('unmount trong lúc có toast không ném lỗi', () => {
    const { result, unmount } = renderHook(() => useInlineToast())
    act(() => result.current.showSuccess('x'))
    unmount()
    expect(() =>
      act(() => jest.advanceTimersByTime(FALLBACK_TOAST_DURATION_MS + TOAST_EXIT_ANIMATION_MS))
    ).not.toThrow()
  })

  it('dismissToast không làm gì khi chưa có toast', () => {
    const { result } = renderHook(() => useInlineToast())
    act(() => result.current.dismissToast())
    expect(result.current.inlineToast).toBeNull()
    expect(result.current.isToastExiting).toBe(false)
  })
})
