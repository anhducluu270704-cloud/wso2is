
import newsApi from '../news.service'

const mockGet = jest.fn()
jest.mock('@/libs/axiosClient', () => ({
  __esModule: true,
  default: { get: (...args: unknown[]) => mockGet(...args) },
}))

describe('services/news/news.service', () => {
  beforeEach(() => mockGet.mockClear())

  it('calls correct endpoints', async () => {
    mockGet.mockResolvedValue({ ok: 1 })

    await newsApi.getHighlights()
    expect(mockGet).toHaveBeenCalledWith('/news/highlight')

    await newsApi.getCategories()
    expect(mockGet).toHaveBeenCalledWith('/news/categories')

    await newsApi.getNewsByCategory({
      categoryId: 'b7e7eea4-b3ab-42fa-bd6f-2e06b03e3cf4',
      limit: 6,
      offset: 0,
    })
    expect(mockGet).toHaveBeenCalledWith('/news', {
      params: {
        categoryId: 'b7e7eea4-b3ab-42fa-bd6f-2e06b03e3cf4',
        limit: 6,
        offset: 0,
      },
    })

    await newsApi.getDetail('9')
    expect(mockGet).toHaveBeenCalledWith('/news/9')
  })
})
