
/**
 * Unit test: libs/axiosClient - interceptors và config
 */
jest.mock('jsdom/lib/jsdom/browser/not-implemented.js', () => {
  return function notImplemented() {
    // no-op in tests; prevents noisy jsdom "navigation not implemented" logs
  }
})

import {
  AUTH_INFO_KEY,
  ERROR_CODES,
  LOCALE_SELECTED_KEY,
  TOKEN_KEY,
} from '@/constants/system'
jest.mock('@/util/token-refresh-queue', () => ({
  refreshTokenAndRetry: jest.fn(),
}))
import axiosClient from '@/libs/axiosClient'

const mockGetItem = jest.fn()
const mockSetItem = jest.fn()
const mockRemoveItem = jest.fn()
beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: mockGetItem,
      setItem: mockSetItem,
      removeItem: mockRemoveItem,
      clear: jest.fn(),
    },
    writable: true,
  })
})

describe('libs/axiosClient', () => {
  beforeEach(() => {
    mockGetItem.mockClear()
    mockSetItem.mockClear()
    mockRemoveItem.mockClear()
  })

  it('có request interceptor', () => {
    expect(axiosClient.interceptors.request.handlers).toBeDefined()
    expect(axiosClient.interceptors.request.handlers.length).toBeGreaterThan(0)
  })
  it('có response interceptor', () => {
    expect(axiosClient.interceptors.response.handlers).toBeDefined()
    expect(axiosClient.interceptors.response.handlers.length).toBeGreaterThan(0)
  })
  it('baseURL được set', () => {
    expect(axiosClient.defaults.baseURL).toBeDefined()
  })

  it('request interceptor thêm Authorization và Accept-Language khi có token và locale', () => {
    mockGetItem.mockImplementation((key: string) => {
      if (key === TOKEN_KEY) return 'my-token'
      if (key === LOCALE_SELECTED_KEY) return 'vi-VN'
      return null
    })
    const config = {
      headers: {} as Record<string, string>,
      url: '/some-api',
    }
    const out = axiosClient.interceptors.request.handlers[0].fulfilled?.(config as any)
    expect(out?.headers?.Authorization).toBe('Bearer my-token')
    expect(out?.headers?.['Accept-Language']).toBe('vi-VN')
  })

  it('không thêm Authorization cho auth request (/token)', () => {
    mockGetItem.mockImplementation((key: string) => {
      if (key === TOKEN_KEY) return 'auth-token'
      if (key === LOCALE_SELECTED_KEY) return null
      return null
    })
    const config = {
      headers: {} as Record<string, string>,
      url: '/token',
    }
    const out = axiosClient.interceptors.request.handlers[0].fulfilled?.(config as any)
    expect(out?.headers?.Authorization).toBeUndefined()
  })

  it('không thêm header khi không có token và locale', () => {
    mockGetItem.mockReturnValue(null)
    const config = {
      headers: {} as Record<string, string>,
      url: '/some-api',
    }
    const out = axiosClient.interceptors.request.handlers[0].fulfilled?.(config as any)
    expect(out?.headers).toEqual({})
  })

  it('request interceptor thêm Accept-Language khi có locale', () => {
    mockGetItem.mockImplementation((key: string) => {
      if (key === LOCALE_SELECTED_KEY) return 'en-US'
      return null
    })
    const config = { headers: {} as Record<string, string>, url: '/api' }
    const out = axiosClient.interceptors.request.handlers[0].fulfilled?.(config as any)
    expect(out?.headers?.['Accept-Language']).toBe('en-US')
  })

  it('request interceptor rejected trả về Promise.reject', async () => {
    const err = new Error('req err')
    await expect(
      axiosClient.interceptors.request.handlers[0].rejected?.(err)
    ).rejects.toThrow('req err')
  })

  it('response interceptor trả về response.data', () => {
    const handler = axiosClient.interceptors.response.handlers[0]
    const res = { data: { foo: 1 }, status: 200 }
    const out = handler.fulfilled?.(res as any)
    expect(out).toEqual({ foo: 1 })
  })

  it('response interceptor reject trả về Promise.reject', async () => {
    const handler = axiosClient.interceptors.response.handlers[0]
    const err = new Error('fail')
    await expect(handler.rejected?.(err)).rejects.toThrow('fail')
  })

  it('response interceptor không retry khi request đã _retry hoặc status khác 401', async () => {
    const handler = axiosClient.interceptors.response.handlers[0]
    const { refreshTokenAndRetry } = require('@/util/token-refresh-queue')
    const nonRetryError = {
      config: { headers: {}, url: '/retry', _retry: true },
      response: { status: 401, data: { code: 'OTHER' } },
    }

    await expect(handler.rejected?.(nonRetryError as any)).rejects.toBe(nonRetryError)
    expect(refreshTokenAndRetry).not.toHaveBeenCalled()

    const not401Error = {
      config: { headers: {}, url: '/retry' },
      response: { status: 500, data: { code: 'OTHER' } },
    }
    await expect(handler.rejected?.(not401Error as any)).rejects.toBe(not401Error)
  })

  it('response interceptor: permission denied xoa token va redirect', async () => {
    const handler = axiosClient.interceptors.response.handlers[0]
    const { refreshTokenAndRetry } = require('@/util/token-refresh-queue')

    mockRemoveItem.mockClear()
    refreshTokenAndRetry.mockClear()

    const permissionDeniedError = {
      config: { headers: {}, url: '/protected' },
      response: {
        status: 401,
        data: { code: ERROR_CODES['PERMISSION_DENIED'] },
      },
    }

    // jsdom logs "Not implemented: navigation" when window.location.href is assigned.
    // Silence in this test to keep the Jest output clean.
    const originalConsoleError = console.error
    ;(console as any).error = jest.fn()
    try {
      await expect(
        handler.rejected?.(permissionDeniedError as any),
      ).rejects.toBe(permissionDeniedError)
    } finally {
      console.error = originalConsoleError
    }
    expect(mockRemoveItem).toHaveBeenCalledWith(TOKEN_KEY)
    expect(mockRemoveItem).toHaveBeenCalledWith(AUTH_INFO_KEY)
    expect(refreshTokenAndRetry).not.toHaveBeenCalled()
  })

  it('response interceptor: 401 và không có token thì không gọi refreshTokenAndRetry', async () => {
    const handler = axiosClient.interceptors.response.handlers[0]
    const { refreshTokenAndRetry } = require('@/util/token-refresh-queue')

    mockGetItem.mockReturnValue(null)
    refreshTokenAndRetry.mockClear()

    const anon401 = {
      config: { headers: {}, url: '/support/guide' },
      response: { status: 401, data: { code: 'UNAUTHORIZED' } },
    }

    await expect(handler.rejected?.(anon401 as any)).rejects.toBe(anon401)
    expect(refreshTokenAndRetry).not.toHaveBeenCalled()
  })

  it('response interceptor: retry thanh cong voi refreshTokenAndRetry', async () => {
    const handler = axiosClient.interceptors.response.handlers[0]
    const { refreshTokenAndRetry } = require('@/util/token-refresh-queue')

    mockGetItem.mockImplementation((key: string) => {
      if (key === TOKEN_KEY) return 'expired-but-present'
      return null
    })
    const refreshResult = { url: '/protected', headers: {} }
    refreshTokenAndRetry.mockResolvedValue(refreshResult)

    // Chặn request mạng thật bằng cách override adapter của axios.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(axiosClient.defaults as any).adapter = () =>
      Promise.resolve({
        data: { ok: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        request: {},
      })

    const retryError = {
      config: { headers: {}, url: '/protected' },
      response: {
        status: 401,
        data: { code: ERROR_CODES['INVALID_AUTH_TOKEN'] },
      },
    }

    const out = await handler.rejected?.(retryError as any)
    expect(refreshTokenAndRetry).toHaveBeenCalled()
    expect(out).toEqual({ ok: true })
  })

  it('response interceptor: retry that bai khi refreshTokenAndRetry throw', async () => {
    const handler = axiosClient.interceptors.response.handlers[0]
    const { refreshTokenAndRetry } = require('@/util/token-refresh-queue')

    mockGetItem.mockImplementation((key: string) => {
      if (key === TOKEN_KEY) return 'expired-but-present'
      return null
    })
    refreshTokenAndRetry.mockRejectedValue('refresh-fail')

    const retryError = {
      config: { headers: {}, url: '/protected' },
      response: {
        status: 401,
        data: { code: ERROR_CODES['INVALID_AUTH_TOKEN'] },
      },
    }

    await expect(
      handler.rejected?.(retryError as any),
    ).rejects.toThrow('refresh-fail')
  })

})