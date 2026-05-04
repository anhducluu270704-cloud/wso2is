
import { renderHook, waitFor } from '@testing-library/react'
import { useLogout, useRefresh, useTokenRefresh, useVerifyToken } from '../auth.query-options'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { MOCK_AUTH_INFO_BASE } from '@/_tests_/mocks'

jest.mock('../auth.service', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    logout: jest.fn(),
    refresh: jest.fn(),
    verifyToken: jest.fn(),
  },
}))
jest.mock('@/libs/axiosClient', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}))
jest.mock('next-intl', () => ({ useLocale: () => 'vi' }))
jest.mock('@/share/components/full-page/loading', () => ({
  __esModule: true,
  default: () => null,
}))
jest.mock('@/i18n/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }))
jest.mock('@/share/layout/end-user/header/hook', () => ({
  useGetUrlLoginMutation: () => ({ mutate: jest.fn() }),
}))

const authApi = require('../auth.service').default

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    {children}
  </QueryClientProvider>
)

describe('services/auth/auth.query-options', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('useVerifyToken gọi authApi.verifyToken với đúng token và nhận data', async () => {
    const payload = { data: { status: 'verified' as const } }
    ;(authApi.verifyToken as jest.Mock).mockResolvedValueOnce(payload)
    const { result } = renderHook(() => useVerifyToken('email-token'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(authApi.verifyToken).toHaveBeenCalledWith('email-token')
    expect(result.current.data).toEqual(payload)
  })

  it('useVerifyToken không retry khi verifyToken lỗi', async () => {
    ;(authApi.verifyToken as jest.Mock).mockRejectedValue(new Error('network'))
    const { result } = renderHook(() => useVerifyToken('bad'), { wrapper })
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(authApi.verifyToken).toHaveBeenCalledTimes(1)
  })

  it('useLogout trả về mutation có mutate', () => {
    const { result } = renderHook(() => useLogout(jest.fn()), { wrapper })
    expect(result.current.mutate).toBeDefined()
    expect(typeof result.current.mutate).toBe('function')
  })

  it('useLogout mutationFn gọi authApi.logout', async () => {
    ;(authApi.logout as jest.Mock).mockResolvedValue({})
    const { result } = renderHook(() => useLogout(jest.fn()), { wrapper })
    result.current.mutate({ idToken: 'id', callback: 'https://app' })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(authApi.logout).toHaveBeenCalledWith({ idToken: 'id', callback: 'https://app' })
  })

  it('useRefresh onSuccess gọi onSuccessCallback', async () => {
    ;(authApi.refresh as jest.Mock).mockResolvedValue({ data: MOCK_AUTH_INFO_BASE })
    const onSuccessCb = jest.fn()
    const onErrorCb = jest.fn()
    const { result } = renderHook(() => useRefresh(onSuccessCb, onErrorCb), { wrapper })
    result.current.mutate({ body: { refreshToken: 'ref' } })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(onSuccessCb).toHaveBeenCalledWith(MOCK_AUTH_INFO_BASE)
  })

  it('useRefresh onError gọi clearAuthAndLogout và onErrorCallback', async () => {
    ;(authApi.refresh as jest.Mock).mockRejectedValueOnce(new Error('fail'))
    const onErrorCb = jest.fn()
    const { result } = renderHook(() => useRefresh(jest.fn(), onErrorCb), { wrapper })
    result.current.mutate({ body: { refreshToken: 'ref' } })
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(onErrorCb).toHaveBeenCalled()
  })

  it('useTokenRefresh refreshToken throw khi không có AUTH_INFO_KEY', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
    const { result } = renderHook(() => useTokenRefresh(), { wrapper })
    await expect(result.current.refreshToken()).rejects.toThrow('Cannot find auth information to refresh')
  })

  it('useTokenRefresh refreshToken lưu token mới vào localStorage', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) =>
      key.includes('auth_info')
        ? JSON.stringify({
            refresh_token: 'ref',
            user_info: MOCK_AUTH_INFO_BASE.user_info,
          })
        : null
    )
    const setItem = jest
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {})
    ;(authApi.refresh as jest.Mock).mockResolvedValue({ data: MOCK_AUTH_INFO_BASE })

    const { result } = renderHook(() => useTokenRefresh(), { wrapper })
    const response = await result.current.refreshToken()

    expect(response.data).toEqual(MOCK_AUTH_INFO_BASE)
    expect(setItem).toHaveBeenCalledWith(
      expect.stringContaining('access_token'),
      MOCK_AUTH_INFO_BASE.access_token
    )
    expect(setItem).toHaveBeenCalledWith(
      expect.stringContaining('auth_info'),
      expect.stringContaining('"refresh_at"')
    )
    setItem.mockRestore()
  })

  it('useTokenRefresh refreshTokenWithRetry rethrow và gọi clearAuthAndLogout khi refresh fail', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) =>
      key.includes('auth_info')
        ? JSON.stringify({
            refresh_token: 'ref',
            user_info: MOCK_AUTH_INFO_BASE.user_info,
          })
        : null
    )
    const removeItem = jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {})
    ;(authApi.refresh as jest.Mock).mockRejectedValueOnce(new Error('refresh failed'))
    const { result } = renderHook(() => useTokenRefresh(), { wrapper })
    await expect(result.current.refreshTokenWithRetry()).rejects.toThrow('refresh failed')
    expect(removeItem).toHaveBeenCalled()
    removeItem.mockRestore()
  })

  it('useTokenRefresh refreshTokenWithRetry gọi onSuccess callback khi refresh thành công', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) =>
      key.includes('auth_info')
        ? JSON.stringify({
            refresh_token: 'ref',
            user_info: MOCK_AUTH_INFO_BASE.user_info,
          })
        : null
    )
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {})
    ;(authApi.refresh as jest.Mock).mockResolvedValue({ data: MOCK_AUTH_INFO_BASE })

    const onSuccess = jest.fn()
    const { result } = renderHook(() => useTokenRefresh(), { wrapper })

    await result.current.refreshTokenWithRetry(onSuccess)

    expect(onSuccess).toHaveBeenCalled()
  })

  it('useTokenRefresh trả về clearAuthAndLogout', () => {
    const { result } = renderHook(() => useTokenRefresh(), { wrapper })
    expect(typeof result.current.clearAuthAndLogout).toBe('function')
    result.current.clearAuthAndLogout()
  })
})