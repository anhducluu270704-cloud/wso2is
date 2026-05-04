import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  apiProductKeys,
  useGetAllApiProducts,
  useGetAllApiProductsInfinite,
  useGetApiProductDetail,
  useGetApiProductThumbnail,
  useGetApiProductCategories,
} from '../apiProduct.query-options'

const mockCreateObjectURL = jest.fn(() => 'blob:mock-url')
const mockRevokeObjectURL = jest.fn()
beforeAll(() => {
  global.URL.createObjectURL = mockCreateObjectURL
  global.URL.revokeObjectURL = mockRevokeObjectURL
})
jest.mock('../apiProduct.service', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn().mockResolvedValue({ data: { list: [] } }),
    getDetail: jest.fn().mockResolvedValue({}),
    getThumbnail: jest.fn().mockResolvedValue(new Blob()),
    getCategories: jest.fn().mockResolvedValue({}),
  },
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }
}

describe('apiProduct.query-options', () => {
  beforeEach(() => {
    const apiProductApi = require('../apiProduct.service').default
    apiProductApi.getAll.mockClear()
    apiProductApi.getDetail.mockClear()
    apiProductApi.getThumbnail.mockClear()
    apiProductApi.getCategories.mockClear()
    mockCreateObjectURL.mockClear()
  })

  describe('apiProductKeys', () => {
    it('all', () => {
      expect(apiProductKeys.all).toEqual(['apiProducts'])
    })
    it('getAll(filter)', () => {
      const filter = { limit: 10, offset: 0 }
      expect(apiProductKeys.getAll(filter)).toEqual([
        'apiProducts',
        filter,
        'getAll',
      ])
    })
    it('detail(id)', () => {
      expect(apiProductKeys.detail('id-1')).toEqual([
        'apiProducts',
        'id-1',
        'detail',
      ])
    })
    it('getAllInfinite(filter)', () => {
      const filter = { limit: 10, offset: 4 }
      expect(apiProductKeys.getAllInfinite(filter)).toEqual([
        'apiProducts',
        {},
        'getAllInfinite',
      ])
    })
    it('thumbnail(id)', () => {
      expect(apiProductKeys.thumbnail('id-1')).toContain('thumbnail')
    })
    it('categories()', () => {
      expect(apiProductKeys.categories()).toContain('categories')
    })
  })

  describe('hooks', () => {
    it('useGetAllApiProducts', async () => {
      const { result } = renderHook(
        () => useGetAllApiProducts({ limit: 10, offset: 0 }),
        { wrapper: createWrapper() }
      )
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toBeDefined()
    })
    it('useGetApiProductDetail', async () => {
      const { result } = renderHook(() => useGetApiProductDetail('api-1'), {
        wrapper: createWrapper(),
      })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
    })
    it('useGetApiProductDetail disabled khi id rỗng', async () => {
      const apiProductApi = require('../apiProduct.service').default
      const { result } = renderHook(() => useGetApiProductDetail(''), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.fetchStatus).toBe('idle'))
      expect(apiProductApi.getDetail).not.toHaveBeenCalled()
    })
    it('useGetAllApiProductsInfinite gọi page đầu và page tiếp theo đúng limit', async () => {
      const apiProductApi = require('../apiProduct.service').default
      ;(apiProductApi.getAll as jest.Mock)
        .mockResolvedValueOnce({
          data: {
            list: [],
            pagination: { offset: 0, limit: 10, total: 20 },
          },
        })
        .mockResolvedValueOnce({
          data: {
            list: [],
            pagination: { offset: 10, limit: 4, total: 20 },
          },
        })

      const { result } = renderHook(
        () => useGetAllApiProductsInfinite({ limit: 10, offset: 5 }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(apiProductApi.getAll).toHaveBeenNthCalledWith(1, {
        limit: 10,
        offset: 0,
      })

      await result.current.fetchNextPage()

      await waitFor(() => expect(apiProductApi.getAll).toHaveBeenCalledTimes(2))
      expect(apiProductApi.getAll).toHaveBeenNthCalledWith(2, {
        limit: 4,
        offset: 10,
      })
    })
    it('useGetAllApiProductsInfinite không có next page khi đã tới total', async () => {
      const apiProductApi = require('../apiProduct.service').default
      ;(apiProductApi.getAll as jest.Mock).mockResolvedValueOnce({
        data: {
          list: [],
          pagination: { offset: 0, limit: 10, total: 10 },
        },
      })

      const { result } = renderHook(
        () => useGetAllApiProductsInfinite({ limit: 10, offset: 0 }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.hasNextPage).toBe(false)
    })
    it('useGetApiProductThumbnail', async () => {
      const { result } = renderHook(() => useGetApiProductThumbnail('api-1'), {
        wrapper: createWrapper(),
      })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toBeInstanceOf(Blob)
    })
    it('useGetApiProductCategories', async () => {
      const { result } = renderHook(() => useGetApiProductCategories(), {
        wrapper: createWrapper(),
      })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
    })
  })
})
