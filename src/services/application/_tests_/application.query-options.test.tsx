
import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  applicationKeys,
  toApplicationInfiniteListKey,
  useGetAllApplications,
  useGetAllApplicationsInfinite,
  useGetAllSubscriptions,
  useGetAllThrottlingPolicies,
  useGetApplication,
  useGetKeyManger,
  useGetOauthKeys,
} from '../application.query-options'

jest.mock('../application.service', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn().mockResolvedValue({
      data: {
        list: [],
        pagination: {
          offset: 0,
          limit: 10,
          total: 0,
          next: '',
          previous: '',
        },
      },
    }),
    getAllWithApiStatus: jest.fn().mockResolvedValue({
      data: {
        list: [],
        pagination: {
          offset: 0,
          limit: 6,
          total: 0,
          next: '',
          previous: '',
        },
      },
    }),
    getDetail: jest.fn().mockResolvedValue({ data: {} }),
    getKeyManger: jest.fn().mockResolvedValue({ data: { list: [] } }),
    getOauthKey: jest.fn().mockResolvedValue({ data: { list: [] } }),
    getSubscriptions: jest.fn().mockResolvedValue({ data: { list: [] } }),
    getAllThrottlingPolicies: jest.fn().mockResolvedValue({ data: { list: [] } }),
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

describe('services/application/application.query-options', () => {
  describe('applicationKeys', () => {
    it('all', () => {
      expect(applicationKeys.all).toEqual(['applications'])
    })

    it('list(filter)', () => {
      const filter = { limit: 10, offset: 0 }
      expect(applicationKeys.list(filter)).toEqual([
        'applications',
        'list',
        filter,
      ])
    })

    it('toApplicationInfiniteListKey(filter)', () => {
      expect(
        toApplicationInfiniteListKey({
          apiId: 'api-1',
          limit: 6,
          offset: 0,
        } as any),
      ).toEqual({ apiId: 'api-1' })
    })

    it('listInfinite(filter)', () => {
      expect(
        applicationKeys.listInfinite({
          apiId: 'api-1',
          limit: 6,
          offset: 0,
        } as any),
      ).toEqual([
        'applications',
        'list',
        { apiId: 'api-1' },
        'listInfinite',
      ])
    })

    it('detail(id)', () => {
      expect(applicationKeys.detail('app-1')).toEqual([
        'applications',
        'app-1',
        'detail',
      ])
    })

    it('getKeyManger()', () => {
      expect(applicationKeys.getKeyManger()).toEqual([
        'applications',
        'key-manager',
      ])
    })

    it('oauthKeys(app_id)', () => {
      expect(applicationKeys.oauthKeys('app-xyz')).toEqual([
        'applications',
        'app-xyz',
        'oauth-keys',
      ])
    })

    it('subscriptions(applicationId)', () => {
      expect(applicationKeys.subscriptions('app-subs')).toEqual([
        'applications',
        'app-subs',
        'subscriptions',
      ])
    })

    it('throttlingPolicies()', () => {
      expect(applicationKeys.throttlingPolicies()).toEqual([
        'applications',
        'throttling-policies',
      ])
    })
  })

  describe('useGetKeyManger', () => {
    it('queryKey khớp getKeyManger() và gọi applicationApi.getKeyManger', async () => {
      const api = require('../application.service').default
      ;(api.getKeyManger as jest.Mock).mockClear()

      const { result } = renderHook(() => useGetKeyManger(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(api.getKeyManger).toHaveBeenCalledTimes(1)
      expect(result.current.data).toBeDefined()
    })
  })

  describe('useGetOauthKeys', () => {
    it('success khi app_id truthy và gọi getOauthKey', async () => {
      const api = require('../application.service').default
      ;(api.getOauthKey as jest.Mock).mockClear()

      const { result } = renderHook(() => useGetOauthKeys('app-oauth'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(api.getOauthKey).toHaveBeenCalledWith('app-oauth')
    })

    it('không fetch khi app_id rỗng (enabled: false)', () => {
      const api = require('../application.service').default
      ;(api.getOauthKey as jest.Mock).mockClear()

      renderHook(() => useGetOauthKeys(''), { wrapper: createWrapper() })
      expect(api.getOauthKey).not.toHaveBeenCalled()
    })
  })

  describe('useGetAllSubscriptions', () => {
    it('success khi applicationId truthy và gọi getSubscriptions', async () => {
      const api = require('../application.service').default
      ;(api.getSubscriptions as jest.Mock).mockClear()

      const { result } = renderHook(
        () => useGetAllSubscriptions('app-sub-id'),
        { wrapper: createWrapper() },
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(api.getSubscriptions).toHaveBeenCalledWith('app-sub-id')
    })

    it('không fetch khi applicationId rỗng', () => {
      const api = require('../application.service').default
      ;(api.getSubscriptions as jest.Mock).mockClear()

      renderHook(() => useGetAllSubscriptions(''), {
        wrapper: createWrapper(),
      })
      expect(api.getSubscriptions).not.toHaveBeenCalled()
    })
  })

  describe('useGetAllApplications', () => {
    it('fetch success', async () => {
      const { result } = renderHook(
        () => useGetAllApplications({ limit: 10, offset: 0 }),
        { wrapper: createWrapper() },
      )
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toBeDefined()
    })
  })

  describe('useGetApplication', () => {
    it('fetch success', async () => {
      const { result } = renderHook(() => useGetApplication('app-1'), {
        wrapper: createWrapper(),
      })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
    })

    it('không gọi getDetail khi id rỗng', () => {
      const api = require('../application.service').default
      ;(api.getDetail as jest.Mock).mockClear()
      renderHook(() => useGetApplication(''), { wrapper: createWrapper() })
      expect(api.getDetail).not.toHaveBeenCalled()
    })
  })

  describe('useGetAllThrottlingPolicies', () => {
    it('fetch success', async () => {
      const { result } = renderHook(() => useGetAllThrottlingPolicies(), {
        wrapper: createWrapper(),
      })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
    })
  })

  describe('useGetAllApplicationsInfinite', () => {
    it('success và có pages', async () => {
      const api = require('../application.service').default
      ;(api.getAllWithApiStatus as jest.Mock).mockResolvedValue({
        data: {
          list: [],
          pagination: { offset: 0, limit: 10, total: 5, next: '', previous: '' },
        },
      })
      const { result } = renderHook(
        () =>
          useGetAllApplicationsInfinite({
            apiId: 'api-1',
            limit: 6,
            offset: 0,
          } as any),
        { wrapper: createWrapper() },
      )
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data?.pages).toBeDefined()
    })

    it('fetchNextPage dùng offset + limit và APPLICATION_LIST_PAGE_SIZE', async () => {
      const api = require('../application.service').default
      ;(api.getAllWithApiStatus as jest.Mock).mockResolvedValue({
        data: {
          list: [],
          pagination: { offset: 0, limit: 2, total: 5, next: '', previous: '' },
        },
      })
      const { result } = renderHook(
        () =>
          useGetAllApplicationsInfinite({
            apiId: 'api-1',
            limit: 6,
            offset: 0,
          } as any),
        { wrapper: createWrapper() },
      )
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      await result.current.fetchNextPage()
      expect(api.getAllWithApiStatus).toHaveBeenCalledWith({
        offset: 2,
        limit: 3,
        apiId: 'api-1',
      })
    })

    it('trang đầu dùng APPLICATION_LIST_INITIAL_PAGE_SIZE khi pageParam 0', async () => {
      const api = require('../application.service').default
      ;(api.getAllWithApiStatus as jest.Mock).mockResolvedValue({
        data: {
          list: [],
          pagination: {
            offset: 0,
            limit: 6,
            total: 6,
            next: '',
            previous: '',
          },
        },
      })
      const { result } = renderHook(
        () =>
          useGetAllApplicationsInfinite({
            apiId: 'api-1',
            limit: 6,
            offset: 0,
          } as any),
        { wrapper: createWrapper() },
      )
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(api.getAllWithApiStatus).toHaveBeenCalledWith({
        offset: 0,
        limit: 6,
        apiId: 'api-1',
      })
    })
  })
})
