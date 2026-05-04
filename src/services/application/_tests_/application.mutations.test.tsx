import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { applicationKeys } from '../application.query-options'
import type {
  ApplicationRequest,
  GetApplicationDetailResponse,
  GetApplicationSubscriptionsResponse,
  Subscription,
} from '../application.schema'
import {
  useCreateApplicationMutation,
  useDeleteApplicationMutation,
  useDeleteOAuthKeyMutation,
  useDeleteSubscriptionMutation,
  useGenerateAccessTokenMutation,
  useGenerateKeysMutation,
  useSubscribeApiMutation,
  useUpdateApplicationMutation,
  useUpdateConfigurationMutation,
} from '../application.mutations'

jest.mock('../application.service', () => ({
  __esModule: true,
  default: {
    create: jest.fn().mockResolvedValue({ data: { applicationId: 'app-1' } }),
    subscribe: jest.fn().mockResolvedValue({ message: 'OK', code: '200' }),
    delete: jest.fn().mockResolvedValue({ message: 'deleted' }),
    deleteSubscription: jest.fn().mockResolvedValue({ message: 'ok' }),
    update: jest.fn().mockResolvedValue({ message: 'ok' }),
    generateKeys: jest
      .fn()
      .mockResolvedValue({ data: { keyMappingId: 'km-1' } }),
    updateConfiguration: jest
      .fn()
      .mockResolvedValue({ data: { keyMappingId: 'km-1' } }),
    deleteOAuthKey: jest.fn().mockResolvedValue({ message: 'ok' }),
    generateAccessToken: jest
      .fn()
      .mockResolvedValue({
        data: { accessToken: 'at', tokenScopes: [], validityTime: 3600 },
      }),
  },
}))
jest.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }))
jest.mock('sonner', () => ({
  toast: {
    dismiss: jest.fn(),
    loading: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  },
}))

/** Giống AxiosError: onError đọc error.response?.data?.error */
function mockAxiosMutationError(message: string) {
  return { response: { data: { error: message } } }
}

function createWrapper(queryClient?: QueryClient) {
  const client =
    queryClient ??
    new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
}

describe('application.mutations', () => {
  beforeEach(() => {
    const { toast } = require('sonner')
    toast.dismiss.mockClear()
    toast.loading.mockClear()
    toast.success.mockClear()
    toast.error.mockClear()
  })

  it('useCreateApplicationMutation', async () => {
    const { result } = renderHook(() => useCreateApplicationMutation(), {
      wrapper: createWrapper(),
    })
    result.current.mutate({
      name: 'App1',
      throttlingPolicy: '10PerMin',
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBeDefined()
  })

  it('useSubscribeApiMutation', async () => {
    const { result } = renderHook(() => useSubscribeApiMutation('MyApp'), {
      wrapper: createWrapper(),
    })
    result.current.mutate({
      applicationId: 'app-1',
      body: { apiId: 'api-1', throttlingPolicy: '10PerMin' },
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('useSubscribeApiMutation fallback dùng applicationId khi không truyền applicationName', async () => {
    const { result } = renderHook(() => useSubscribeApiMutation(), {
      wrapper: createWrapper(),
    })
    result.current.mutate({
      applicationId: 'app-2',
      body: { apiId: 'api-1', throttlingPolicy: '10PerMin' },
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('useCreateApplicationMutation onError gọi toast.dismiss', async () => {
    const applicationApi = require('../application.service').default
    ;(applicationApi.create as jest.Mock).mockRejectedValueOnce(
      new Error('fail')
    )
    const { result } = renderHook(() => useCreateApplicationMutation(), {
      wrapper: createWrapper(),
    })
    result.current.mutate({ name: 'App', throttlingPolicy: '10PerMin' })
    await waitFor(() => expect(result.current.isError).toBe(true))
    const { toast } = require('sonner')
    expect(toast.dismiss).toHaveBeenCalled()
  })

  it('useSubscribeApiMutation onError gọi toast.error', async () => {
    const applicationApi = require('../application.service').default
    ;(applicationApi.subscribe as jest.Mock).mockRejectedValueOnce(
      new Error('fail')
    )
    const { result } = renderHook(() => useSubscribeApiMutation(), {
      wrapper: createWrapper(),
    })
    result.current.mutate({
      applicationId: 'app-1',
      body: { apiId: 'api-1', throttlingPolicy: '10PerMin' },
    })
    await waitFor(() => expect(result.current.isError).toBe(true))
    const { toast } = require('sonner')
    expect(toast.error).toHaveBeenCalled()
  })

  it('useSubscribeApiMutation với inline callbacks không gọi toast loading/success', async () => {
    const onSuccess = jest.fn()
    const { result } = renderHook(
      () => useSubscribeApiMutation('MyInlineApp', { onSuccess }),
      { wrapper: createWrapper() }
    )

    result.current.mutate({
      applicationId: 'app-inline',
      body: { apiId: 'api-1', throttlingPolicy: '10PerMin' },
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const { toast } = require('sonner')
    expect(onSuccess).toHaveBeenCalledWith('mess.subscribe.success')
    expect(toast.loading).not.toHaveBeenCalledWith('mess.subscribe.loading')
    expect(toast.success).not.toHaveBeenCalledWith('mess.subscribe.success')
  })

  it('useSubscribeApiMutation inline onError trả về message và durationMs', async () => {
    const applicationApi = require('../application.service').default
    ;(applicationApi.subscribe as jest.Mock).mockRejectedValueOnce({
      message: 'fallback-error',
      response: {
        data: {
          error: 'api-error',
          toastDurationMs: 2500,
        },
      },
    })

    const onError = jest.fn()
    const { result } = renderHook(
      () => useSubscribeApiMutation(undefined, { onError }),
      { wrapper: createWrapper() }
    )

    result.current.mutate({
      applicationId: 'app-inline',
      body: { apiId: 'api-1', throttlingPolicy: '10PerMin' },
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(onError).toHaveBeenCalledWith('api-error', {
      durationMs: 2500,
    })
  })

  it('useDeleteApplicationMutation success chỉ dismiss loading', async () => {
    const { result } = renderHook(() => useDeleteApplicationMutation(), {
      wrapper: createWrapper(),
    })

    result.current.mutate('app-1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const { toast } = require('sonner')
    expect(toast.loading).toHaveBeenCalledWith('mess.delete.loading')
    expect(toast.success).not.toHaveBeenCalled()
  })

  it('useDeleteApplicationMutation error gọi toast.error', async () => {
    const applicationApi = require('../application.service').default
    ;(applicationApi.delete as jest.Mock).mockRejectedValueOnce({
      response: { data: { error: 'delete-fail' } },
    })

    const { result } = renderHook(() => useDeleteApplicationMutation(), {
      wrapper: createWrapper(),
    })

    result.current.mutate('app-1')

    await waitFor(() => expect(result.current.isError).toBe(true))

    const { toast } = require('sonner')
    expect(toast.error).toHaveBeenCalledWith('delete-fail')
  })

  it('useSubscribeApiMutation inline onError fallback dùng i18n message', async () => {
    const applicationApi = require('../application.service').default
    ;(applicationApi.subscribe as jest.Mock).mockRejectedValueOnce({
      message: 'plain-error-message',
    })

    const onError = jest.fn()
    const { result } = renderHook(
      () => useSubscribeApiMutation(undefined, { onError }),
      { wrapper: createWrapper() }
    )

    result.current.mutate({
      applicationId: 'app-inline',
      body: { apiId: 'api-1', throttlingPolicy: '10PerMin' },
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(onError).toHaveBeenCalledWith('mess.subscribe.error', {
      durationMs: undefined,
    })
  })

  const stubSub = (
    subscriptionId: string,
    applicationId: string
  ): Subscription =>
    ({
      subscriptionId,
      applicationId,
      apiId: 'api-1',
      apiInfo: {} as Subscription['apiInfo'],
      applicationInfo: {} as Subscription['applicationInfo'],
      throttlingPolicy: 'p',
      requestedThrottlingPolicy: 'p',
      status: 'ACTIVE',
      redirectionParams: null,
    }) as Subscription

  it('useDeleteSubscriptionMutation success: toast và invalidate', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const seeded: GetApplicationSubscriptionsResponse = {
      message: 'ok',
      code: '200',
      data: {
        count: 2,
        list: [stubSub('s-a', 'app-sub'), stubSub('s-b', 'app-sub')],
        pagination: { offset: 0, limit: 10, total: 2, next: '', previous: '' },
      },
    }
    queryClient.setQueryData(applicationKeys.subscriptions('app-sub'), seeded)

    const { result } = renderHook(() => useDeleteSubscriptionMutation(), {
      wrapper: createWrapper(queryClient),
    })

    result.current.mutate({
      applicationId: 'app-sub',
      subscriptionId: 's-a',
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const after = queryClient.getQueryData<GetApplicationSubscriptionsResponse>(
      applicationKeys.subscriptions('app-sub')
    )
    expect(after?.data?.list.map((s) => s.subscriptionId)).toEqual(['s-b'])
    expect(after?.data?.count).toBe(1)

    const { toast } = require('sonner')
    expect(toast.success).toHaveBeenCalledWith(
      'mess.delete_subscription.success'
    )
  })

  it('useDeleteSubscriptionMutation khi cache subscriptions chưa có (old?.data falsy)', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const { result } = renderHook(() => useDeleteSubscriptionMutation(), {
      wrapper: createWrapper(queryClient),
    })

    result.current.mutate({
      applicationId: 'app-empty-cache',
      subscriptionId: 's-none',
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('useDeleteSubscriptionMutation onError khôi phục cache khi có previous', async () => {
    const applicationApi = require('../application.service').default
    ;(applicationApi.deleteSubscription as jest.Mock).mockRejectedValueOnce({
      response: { data: { error: 'del-fail' } },
    })

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const seeded: GetApplicationSubscriptionsResponse = {
      message: 'ok',
      code: '200',
      data: {
        count: 1,
        list: [stubSub('s-x', 'app-err')],
        pagination: { offset: 0, limit: 10, total: 1, next: '', previous: '' },
      },
    }
    queryClient.setQueryData(applicationKeys.subscriptions('app-err'), seeded)

    const { result } = renderHook(() => useDeleteSubscriptionMutation(), {
      wrapper: createWrapper(queryClient),
    })

    result.current.mutate({
      applicationId: 'app-err',
      subscriptionId: 's-x',
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    const restored =
      queryClient.getQueryData<GetApplicationSubscriptionsResponse>(
        applicationKeys.subscriptions('app-err')
      )
    expect(restored).toEqual(seeded)

    const { toast } = require('sonner')
    expect(toast.error).toHaveBeenCalledWith('del-fail')
  })

  it('useUpdateApplicationMutation khi cache detail chưa có (old?.data falsy)', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const { result } = renderHook(
      () => useUpdateApplicationMutation('app-no-detail-cache'),
      { wrapper: createWrapper(queryClient) }
    )

    result.current.mutate({
      name: 'OnlyBody',
      throttlingPolicy: '10PerMin',
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('useUpdateApplicationMutation success merge body vào cache', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const detail: GetApplicationDetailResponse = {
      message: 'ok',
      code: '200',
      data: {
        name: 'Old',
        applicationId: 'app-up',
        tier: 'SANDBOX',
        throttlingPolicy: '10PerMin',
        status: 'ACTIVE',
        groups: [],
        subscriptionCount: 0,
        attributes: {},
        owner: 'o',
        tokenType: 'Bearer',
      },
    }
    queryClient.setQueryData(applicationKeys.detail('app-up'), detail)

    const { result } = renderHook(
      () => useUpdateApplicationMutation('app-up'),
      {
        wrapper: createWrapper(queryClient),
      }
    )

    const body: ApplicationRequest = {
      name: 'NewName',
      throttlingPolicy: '10PerMin',
    }
    result.current.mutate(body)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const cached = queryClient.getQueryData<GetApplicationDetailResponse>(
      applicationKeys.detail('app-up')
    )
    expect(cached?.data?.name).toBe('NewName')

    const { toast } = require('sonner')
    expect(toast.success).toHaveBeenCalledWith('mess.update.success')
  })

  it('useUpdateApplicationMutation onError khôi phục cache', async () => {
    const applicationApi = require('../application.service').default
    ;(applicationApi.update as jest.Mock).mockRejectedValueOnce({
      response: { data: { error: 'up-fail' } },
    })

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const detail: GetApplicationDetailResponse = {
      message: 'ok',
      code: '200',
      data: {
        name: 'Keep',
        applicationId: 'app-roe',
        tier: 'SANDBOX',
        throttlingPolicy: '10PerMin',
        status: 'ACTIVE',
        groups: [],
        subscriptionCount: 0,
        attributes: {},
        owner: 'o',
        tokenType: 'Bearer',
      },
    }
    queryClient.setQueryData(applicationKeys.detail('app-roe'), detail)

    const { result } = renderHook(
      () => useUpdateApplicationMutation('app-roe'),
      {
        wrapper: createWrapper(queryClient),
      }
    )

    result.current.mutate({
      name: 'Broken',
      throttlingPolicy: '10PerMin',
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(queryClient.getQueryData(applicationKeys.detail('app-roe'))).toEqual(
      detail
    )
    const { toast } = require('sonner')
    expect(toast.error).toHaveBeenCalledWith('up-fail')
  })

  it('useGenerateKeysMutation success và error', async () => {
    const { result } = renderHook(() => useGenerateKeysMutation('app-gen'), {
      wrapper: createWrapper(),
    })

    result.current.mutate({
      additionalProperties: {},
      callbackUrl: '',
      grantTypesToBeSupported: ['password'],
      keyManager: 'KM',
      keyType: 'SANDBOX',
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    const { toast } = require('sonner')
    expect(toast.success).toHaveBeenCalledWith('mess.generate_keys.success')

    const applicationApi = require('../application.service').default
    ;(applicationApi.generateKeys as jest.Mock).mockRejectedValueOnce({
      response: { data: { error: 'gk-fail' } },
    })
    const { result: errHook } = renderHook(
      () => useGenerateKeysMutation('app-gen'),
      { wrapper: createWrapper() }
    )
    errHook.current.mutate({
      additionalProperties: {},
      callbackUrl: '',
      grantTypesToBeSupported: ['password'],
      keyManager: 'KM',
      keyType: 'SANDBOX',
    })
    await waitFor(() => expect(errHook.current.isError).toBe(true))
    expect(toast.error).toHaveBeenCalledWith('gk-fail')
  })

  it('useUpdateConfigurationMutation success và error', async () => {
    const { result } = renderHook(
      () => useUpdateConfigurationMutation('app-cfg', 'oauth-1'),
      { wrapper: createWrapper() }
    )

    result.current.mutate({
      additionalProperties: {},
      callbackUrl: 'https://cb',
      supportedGrantTypes: ['password'],
      keyManager: 'KM',
      keyType: 'SANDBOX',
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    const applicationApi = require('../application.service').default
    expect(applicationApi.updateConfiguration).toHaveBeenCalledWith(
      'app-cfg',
      'oauth-1',
      expect.any(Object)
    )
    ;(applicationApi.updateConfiguration as jest.Mock).mockRejectedValueOnce({
      response: { data: { error: 'cfg-fail' } },
    })
    const { result: errHook } = renderHook(
      () => useUpdateConfigurationMutation('app-cfg', 'oauth-1'),
      { wrapper: createWrapper() }
    )
    errHook.current.mutate({
      additionalProperties: {},
      callbackUrl: '',
      supportedGrantTypes: ['password'],
      keyManager: 'KM',
      keyType: 'SANDBOX',
    })
    await waitFor(() => expect(errHook.current.isError).toBe(true))
    const { toast } = require('sonner')
    expect(toast.error).toHaveBeenCalledWith('cfg-fail')
  })

  it('useDeleteOAuthKeyMutation success và error', async () => {
    const { result } = renderHook(
      () => useDeleteOAuthKeyMutation('app-oauth', 'key-1'),
      { wrapper: createWrapper() }
    )

    result.current.mutate()
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    const { toast } = require('sonner')
    expect(toast.success).toHaveBeenCalledWith('mess.delete_oauth_key.success')

    const applicationApi = require('../application.service').default
    ;(applicationApi.deleteOAuthKey as jest.Mock).mockRejectedValueOnce({
      response: { data: { error: 'do-fail' } },
    })
    const { result: errHook } = renderHook(
      () => useDeleteOAuthKeyMutation('app-oauth', 'key-1'),
      { wrapper: createWrapper() }
    )
    errHook.current.mutate()
    await waitFor(() => expect(errHook.current.isError).toBe(true))
    expect(toast.error).toHaveBeenCalledWith('do-fail')
  })

  it('useGenerateAccessTokenMutation success và error', async () => {
    const { result } = renderHook(
      () => useGenerateAccessTokenMutation('app-at', 'oauth-at'),
      { wrapper: createWrapper() }
    )

    result.current.mutate({
      consumerSecret: 'sec',
      validityPeriod: 3600,
      revokeToken: null,
      scopes: [],
      additionalProperties: {},
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    const applicationApi = require('../application.service').default
    expect(applicationApi.generateAccessToken).toHaveBeenCalledWith(
      'app-at',
      'oauth-at',
      expect.any(Object)
    )
    const { toast } = require('sonner')
    expect(toast.success).toHaveBeenCalledWith(
      'mess.generate_access_token.success'
    )
    ;(applicationApi.generateAccessToken as jest.Mock).mockRejectedValueOnce({
      response: { data: { error: 'at-fail' } },
    })
    const { result: errHook } = renderHook(
      () => useGenerateAccessTokenMutation('app-at', 'oauth-at'),
      { wrapper: createWrapper() }
    )
    errHook.current.mutate({
      consumerSecret: 'sec',
      validityPeriod: 3600,
      revokeToken: null,
      scopes: [],
      additionalProperties: {},
    })
    await waitFor(() => expect(errHook.current.isError).toBe(true))
    expect(toast.error).toHaveBeenCalledWith('at-fail')
  })
})
