
/**
 * Unit test: services/auth - auth mutations
 */
import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useGetTokenMutation } from '../auth.mutations'
import { MOCK_AUTH_INFO_BASE } from '@/_tests_/mocks'

jest.mock('../auth.service', () => ({
  __esModule: true,
  default: {
    getToken: jest.fn(),
  },
}))
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'vi',
}))
jest.mock('sonner', () => ({ toast: { dismiss: jest.fn(), loading: jest.fn(), success: jest.fn(), error: jest.fn() } }))
const mockPush = jest.fn()
const mockReplace = jest.fn()
jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}))
jest.mock('@/providers/auth-provider', () => ({
  useAuth: () => ({ login: jest.fn() }),
}))

const authApi = require('../auth.service').default

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('auth.mutations', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPush.mockClear()
    mockReplace.mockClear()
  })

  it('useGetTokenMutation không gọi toast loading/dismiss ở onMutate', async () => {
    ;(authApi.getToken as jest.Mock).mockResolvedValue({ data: MOCK_AUTH_INFO_BASE })
    const { result } = renderHook(() => useGetTokenMutation(), { wrapper: createWrapper() })
    result.current.mutate({ code: 'code', redirect_uri: 'https://app/cb' })
    const { toast } = require('sonner')
    expect(toast.dismiss).not.toHaveBeenCalled()
    expect(toast.loading).not.toHaveBeenCalled()
  })

  it('useGetTokenMutation onSuccess gọi login khi data hợp lệ', async () => {
    ;(authApi.getToken as jest.Mock).mockResolvedValue({ data: MOCK_AUTH_INFO_BASE })
    const login = jest.fn()
    jest.doMock('@/providers/auth-provider', () => ({ useAuth: () => ({ login }) }))
    const { result } = renderHook(() => useGetTokenMutation(), { wrapper: createWrapper() })
    result.current.mutate({ code: 'code', redirect_uri: 'https://app/cb' })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBeDefined()
  })

  it('useGetTokenMutation onError gọi mutate login url', async () => {
    ;(authApi.getToken as jest.Mock).mockRejectedValueOnce({
      response: { data: { error: 'Invalid code' } },
    })
    const { result } = renderHook(() => useGetTokenMutation(), { wrapper: createWrapper() })
    result.current.mutate({ code: 'bad', redirect_uri: 'https://app/cb' })
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('useGetTokenMutation onError với message undefined không crash', async () => {
    ;(authApi.getToken as jest.Mock).mockRejectedValueOnce({ response: { data: {} } })
    const { result } = renderHook(() => useGetTokenMutation(), { wrapper: createWrapper() })
    result.current.mutate({ code: 'bad', redirect_uri: 'https://app/cb' })
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('useGetTokenMutation onSuccess với dữ liệu không hợp lệ gọi toast.error', async () => {
    ;(authApi.getToken as jest.Mock).mockResolvedValue({ data: {} })

    const schema = require('../auth.schema')
    jest.spyOn(schema.AuthInfoBaseSchema, 'safeParse').mockReturnValueOnce({
      error: new Error('invalid'),
    } as any)

    const { result } = renderHook(() => useGetTokenMutation(), { wrapper: createWrapper() })
    result.current.mutate({ code: 'code', redirect_uri: 'https://app/cb' })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    const { toast } = require('sonner')
    expect(toast.error).toHaveBeenCalledWith('mess.signin.error')
  })
})
