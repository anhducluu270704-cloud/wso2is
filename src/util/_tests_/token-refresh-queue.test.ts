import { beforeEach, describe, expect, it, jest } from '@jest/globals'

jest.mock('jsdom/lib/jsdom/browser/not-implemented.js', () => {
  return function notImplemented() {
    // no-op in tests; prevents noisy jsdom "navigation not implemented" errors
  }
})

const mockRefresh = jest.fn()
const mockParse = jest.fn((value: any) => value)

function loadTokenRefreshQueueModule() {
  jest.resetModules()
  mockRefresh.mockReset()
  mockParse.mockReset()
  mockParse.mockImplementation((value: any) => value)

  jest.doMock('@/services/auth/auth.service', () => ({
    __esModule: true,
    default: {
      refresh: mockRefresh,
    },
  }))

  jest.doMock('@/services/auth/auth.schema', () => ({
    AuthInfoFullSchema: {
      parse: mockParse,
    },
    RefreshTokenRequest: {},
  }))

  const queueModule = require('@/util/token-refresh-queue')
  const system = require('@/constants/system')

  return { queueModule, system }
}

function createDeferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (error: Error) => void

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

describe('util/token-refresh-queue', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
    window.location.href = 'http://localhost/'
  })

  it('refreshToken stores new auth data and resets flags on success', async () => {
    const { queueModule, system } = loadTokenRefreshQueueModule()
    const deferred = createDeferred<any>()
    mockRefresh.mockReturnValueOnce(deferred.promise)

    localStorage.setItem(
      system.AUTH_INFO_KEY,
      JSON.stringify({ refresh_token: 'refresh-1' }),
    )

    const tokenPromise = queueModule.refreshToken()

    expect(queueModule.isRefreshingToken()).toBe(true)
    expect(queueModule.isTokenExpired()).toBe(true)

    deferred.resolve({
      data: {
        access_token: 'new-token',
        refresh_token: 'refresh-2',
      },
    })

    await expect(tokenPromise).resolves.toBe('new-token')
    expect(mockRefresh).toHaveBeenCalledWith({ refreshToken: 'refresh-1' })
    expect(localStorage.getItem(system.TOKEN_KEY)).toBe('new-token')
    expect(JSON.parse(localStorage.getItem(system.AUTH_INFO_KEY)!)).toEqual({
      access_token: 'new-token',
      refresh_token: 'refresh-2',
    })
    expect(queueModule.isRefreshingToken()).toBe(false)
    expect(queueModule.isTokenExpired()).toBe(false)
  })

  it('reuses the same refresh promise when refreshToken is called twice', async () => {
    const { queueModule, system } = loadTokenRefreshQueueModule()
    const deferred = createDeferred<any>()
    mockRefresh.mockReturnValueOnce(deferred.promise)

    localStorage.setItem(
      system.AUTH_INFO_KEY,
      JSON.stringify({ refresh_token: 'refresh-1' }),
    )

    const firstPromise = queueModule.refreshToken()
    const secondPromise = queueModule.refreshToken()

    deferred.resolve({
      data: {
        access_token: 'shared-token',
        refresh_token: 'refresh-2',
      },
    })

    await expect(firstPromise).resolves.toBe('shared-token')
    await expect(secondPromise).resolves.toBe('shared-token')
    expect(mockRefresh).toHaveBeenCalledTimes(1)
  })

  it('rejects when auth information is missing', async () => {
    const { queueModule, system } = loadTokenRefreshQueueModule()

    await expect(queueModule.refreshToken()).rejects.toThrow(
      'Cannot find auth information to refresh',
    )

    expect(localStorage.getItem(system.TOKEN_KEY)).toBeNull()
    expect(localStorage.getItem(system.AUTH_INFO_KEY)).toBeNull()
    expect(queueModule.isRefreshingToken()).toBe(false)
    expect(queueModule.isTokenExpired()).toBe(false)
  })

  it('rejects when refresh token is missing in saved auth info', async () => {
    const { queueModule, system } = loadTokenRefreshQueueModule()

    localStorage.setItem(system.AUTH_INFO_KEY, JSON.stringify({}))

    await expect(queueModule.refreshToken()).rejects.toThrow(
      'Missing refresh token',
    )

    expect(localStorage.getItem(system.TOKEN_KEY)).toBeNull()
    expect(localStorage.getItem(system.AUTH_INFO_KEY)).toBeNull()
  })

  it('refreshTokenAndRetry resolves queued requests after successful refresh', async () => {
    const { queueModule, system } = loadTokenRefreshQueueModule()
    const deferred = createDeferred<any>()
    mockRefresh.mockReturnValueOnce(deferred.promise)

    localStorage.setItem(
      system.AUTH_INFO_KEY,
      JSON.stringify({ refresh_token: 'refresh-1' }),
    )

    const firstConfig = { headers: {} } as any
    const secondConfig = { headers: {} } as any

    const firstPromise = queueModule.refreshTokenAndRetry(firstConfig)
    const secondPromise = queueModule.refreshTokenAndRetry(secondConfig)

    deferred.resolve({
      data: {
        access_token: 'queued-token',
        refresh_token: 'refresh-2',
      },
    })

    await expect(firstPromise).resolves.toBe(firstConfig)
    await expect(secondPromise).resolves.toBe(secondConfig)
    expect(firstConfig.headers.Authorization).toBe('Bearer queued-token')
    expect(secondConfig.headers.Authorization).toBe('Bearer queued-token')
  })

  // redirect-on-failure is covered in a node-environment test file to avoid jsdom
  // "Not implemented: navigation" errors from assigning window.location.href.

  it('addToQueue resolves when refreshTokenAndRetry succeeds', async () => {
    const { queueModule, system } = loadTokenRefreshQueueModule()
    const deferred = createDeferred<any>()
    mockRefresh.mockReturnValueOnce(deferred.promise)

    localStorage.setItem(
      system.AUTH_INFO_KEY,
      JSON.stringify({ refresh_token: 'refresh-1' }),
    )

    const queuedConfig = { headers: {} } as any
    const queuedPromise = queueModule.addToQueue(queuedConfig)

    const triggerConfig = { headers: {} } as any
    const triggerPromise = queueModule.refreshTokenAndRetry(triggerConfig)

    deferred.resolve({
      data: {
        access_token: 'tok',
        refresh_token: 'refresh-2',
      },
    })

    await expect(triggerPromise).resolves.toBe(triggerConfig)
    await expect(queuedPromise).resolves.toBe(queuedConfig)
    expect(queuedConfig.headers.Authorization).toBe('Bearer tok')
  })

  it('addToQueue rejects when refreshTokenAndRetry fails', async () => {
    const { queueModule, system } = loadTokenRefreshQueueModule()
    const deferred = createDeferred<any>()
    mockRefresh.mockReturnValueOnce(deferred.promise)

    localStorage.setItem(
      system.AUTH_INFO_KEY,
      JSON.stringify({ refresh_token: 'refresh-1' }),
    )

    const queuedConfig = { headers: {} } as any
    const queuedPromise = queueModule.addToQueue(queuedConfig)

    const triggerConfig = { headers: {} } as any
    const triggerPromise = queueModule.refreshTokenAndRetry(triggerConfig)

    // jsdom logs "navigation not implemented" when code assigns window.location.href.
    // Silence only for this test's failure path.
    const originalConsoleError = console.error
    ;(console as any).error = jest.fn()

    deferred.reject(new Error('boom'))

    await expect(triggerPromise).rejects.toThrow('boom')
    await expect(queuedPromise).rejects.toThrow('boom')

    console.error = originalConsoleError
  })

  it('creates a new Error when refreshTokenAndRetry throws a non-Error value', async () => {
    const { queueModule, system } = loadTokenRefreshQueueModule()
    ;(mockRefresh as any).mockRejectedValueOnce('not-error')

    localStorage.setItem(
      system.AUTH_INFO_KEY,
      JSON.stringify({ refresh_token: 'refresh-1' }),
    )

    // jsdom logs "navigation not implemented" when code assigns window.location.href.
    // Silence in this test as well.
    const originalConsoleError = console.error
    ;(console as any).error = jest.fn()
    try {
      await expect(
        queueModule.refreshTokenAndRetry({ headers: {} } as any),
      ).rejects.toThrow('not-error')
    } finally {
      console.error = originalConsoleError
    }
  })

  it('does not redirect when window is undefined (jsdom)', async () => {
    const { queueModule, system } = loadTokenRefreshQueueModule()
    ;(mockRefresh as any).mockRejectedValueOnce(new Error('boom'))

    localStorage.setItem(
      system.AUTH_INFO_KEY,
      JSON.stringify({ refresh_token: 'refresh-1' }),
    )

    const originalWindow = (global as any).window
    ;(global as any).window = undefined
    try {
      // Keep the test output clean even if jsdom still logs internal redirect warnings.
      const originalConsoleError = console.error
      ;(console as any).error = jest.fn()
      try {
      await expect(
        queueModule.refreshTokenAndRetry({ headers: {} } as any),
      ).rejects.toThrow('boom')
      } finally {
        console.error = originalConsoleError
      }
    } finally {
      ;(global as any).window = originalWindow
    }
  })
})
