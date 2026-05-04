
import { renderHook } from '@testing-library/react'
import { useHighlightClick } from '../use-highlight-click'

const mockPush = jest.fn()
jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

describe('components/news/highlights/hook/use-highlight-click', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('pushes to /news/:id on click', () => {
    const { result } = renderHook(() => useHighlightClick('77'))
    result.current.onClick()
    expect(mockPush).toHaveBeenCalledWith('/news/77')
  })
})

