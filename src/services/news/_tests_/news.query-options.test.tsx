import { renderHook } from '@testing-library/react'
import {
  newsKeys,
  useGetHighlights,
  useGetNewsByCategory,
  useGetNewsCategories,
  useGetNewsDetail,
} from '../news.query-options'
import newsApi from '../news.service'

const mockUseQuery = jest.fn()
jest.mock('@tanstack/react-query', () => ({
  useQuery: (opts: unknown) => mockUseQuery(opts),
}))

jest.mock('../news.service', () => ({
  __esModule: true,
  default: {
    getHighlights: jest.fn(),
    getCategories: jest.fn(),
    getNewsByCategory: jest.fn(),
    getDetail: jest.fn(),
  },
}))

describe('services/news/news.query-options', () => {
  beforeEach(() => mockUseQuery.mockClear())

  it('builds stable keys', () => {
    expect(newsKeys.highlights()).toEqual(['news', 'highlights'])
    expect(newsKeys.categories()).toEqual(['news', 'categories'])
    expect(newsKeys.listByCategory('c1', 6, 0)).toEqual([
      'news',
      'list',
      'c1',
      6,
      0,
    ])
    expect(newsKeys.detail('1')).toEqual(['news', '1', 'detail'])
  })

  it('wires queries', () => {
    renderHook(() => useGetHighlights())
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['news', 'highlights'] }),
    )

    renderHook(() => useGetNewsCategories())
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['news', 'categories'] }),
    )

    renderHook(() =>
      useGetNewsByCategory('cat-1', { limit: 6, offset: 0 }),
    )
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['news', 'list', 'cat-1', 6, 0],
      }),
    )
  })

  it('disables detail query when id is falsy', () => {
    renderHook(() => useGetNewsDetail(''))
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false }),
    )
  })

  it('enables detail query when id is present', () => {
    renderHook(() => useGetNewsDetail('10'))
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['news', '10', 'detail'],
        enabled: true,
      }),
    )
  })

  it('disables category list query when categoryId is missing', () => {
    renderHook(() =>
      useGetNewsByCategory(undefined, { limit: 6, offset: 0 }),
    )
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false }),
    )
  })

  it('disables category list query when options.enabled is false', () => {
    renderHook(() =>
      useGetNewsByCategory('has-id', { limit: 6, offset: 0 }, {
        enabled: false,
      }),
    )
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false }),
    )
  })

  it('executes queryFns', async () => {
    ;(newsApi.getHighlights as jest.Mock).mockResolvedValueOnce({ ok: true })
    mockUseQuery.mockClear()
    renderHook(() => useGetHighlights())
    const highlightsOpts = mockUseQuery.mock.calls[0][0] as {
      queryFn: () => Promise<unknown>
    }
    await highlightsOpts.queryFn()
    expect(newsApi.getHighlights).toHaveBeenCalled()

    ;(newsApi.getCategories as jest.Mock).mockResolvedValueOnce({ ok: true })
    mockUseQuery.mockClear()
    renderHook(() => useGetNewsCategories())
    const categoriesOpts = mockUseQuery.mock.calls[0][0] as {
      queryFn: () => Promise<unknown>
    }
    await categoriesOpts.queryFn()
    expect(newsApi.getCategories).toHaveBeenCalled()

    ;(newsApi.getNewsByCategory as jest.Mock).mockResolvedValueOnce({
      ok: true,
    })
    mockUseQuery.mockClear()
    renderHook(() =>
      useGetNewsByCategory('id-7', { limit: 12, offset: 6 }),
    )
    const listOpts = mockUseQuery.mock.calls[0][0] as {
      queryFn: () => Promise<unknown>
    }
    await listOpts.queryFn()
    expect(newsApi.getNewsByCategory).toHaveBeenCalledWith({
      categoryId: 'id-7',
      limit: 12,
      offset: 6,
    })

    ;(newsApi.getDetail as jest.Mock).mockResolvedValueOnce({ ok: true })
    mockUseQuery.mockClear()
    renderHook(() => useGetNewsDetail('10'))
    const detailOpts = mockUseQuery.mock.calls[0][0] as {
      queryFn: () => Promise<unknown>
    }
    await detailOpts.queryFn()
    expect(newsApi.getDetail).toHaveBeenCalledWith('10')
  })
})
