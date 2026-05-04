import {
  AUTH_INFO_KEY,
  AUTH_REFRESH_FAILED_EVENT,
  TOKEN_KEY,
} from '@/constants/system'
import {
  AuthInfoFullSchema,
  RefreshTokenRequest,
} from '@/services/auth/auth.schema'
import authApi from '@/services/auth/auth.service'
import { InternalAxiosRequestConfig, isAxiosError } from 'axios'

type QueuedRequest = {
  resolve: (value: InternalAxiosRequestConfig) => void
  reject: (error: Error) => void
  config: InternalAxiosRequestConfig
}

let isRefreshing = false
let refreshPromise: Promise<string> | null = null
const requestQueue: QueuedRequest[] = []
let tokenExpired = false

async function doRefreshToken(): Promise<string> {
  try {
    const savedAuthInfoLocal = localStorage.getItem(AUTH_INFO_KEY)

    if (!savedAuthInfoLocal) {
      throw new Error('Cannot find auth information to refresh')
    }

    const authInfo = AuthInfoFullSchema.parse(
      JSON.parse(savedAuthInfoLocal)
    )

    if (!authInfo.refresh_token) {
      throw new Error('Missing refresh token')
    }

    const refreshBody: RefreshTokenRequest = {
      refreshToken: authInfo.refresh_token,
    }

    const newAuthInfo = await authApi.refresh(refreshBody)

    localStorage.setItem(TOKEN_KEY, newAuthInfo.data.access_token)
    
    const newAuthInfoFull = AuthInfoFullSchema.parse({
      ...newAuthInfo.data,
      user_info: authInfo.user_info,
    })
    localStorage.setItem(AUTH_INFO_KEY, JSON.stringify(newAuthInfoFull))

    return newAuthInfo.data.access_token
  } catch (error) {
    if (
      isAxiosError(error) &&
      error.response?.status === 401 &&
      typeof window !== 'undefined'
    ) {
      window.dispatchEvent(new CustomEvent(AUTH_REFRESH_FAILED_EVENT))
    }
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(AUTH_INFO_KEY)
    throw error
  }

}
function processQueue(error: Error | null, token: string | null = null) {
  requestQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else if (token) {
      prom.config.headers.Authorization = `Bearer ${token}`
      prom.resolve(prom.config)
    }
  })

  requestQueue.length = 0
}

export function addToQueue(
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> {
  return new Promise((resolve, reject) => {
    requestQueue.push({ resolve, reject, config })
  })
}

function queueIfRefreshing(
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig | null> | null {
  if (!isRefreshing) {
    return null
  }

  if (refreshPromise) {
    return addToQueue(config)
  }

  return new Promise<InternalAxiosRequestConfig | null>((resolve) => {
    setTimeout(() => {
      resolve(isRefreshing ? addToQueue(config) : null)
    }, 10)
  })
}

function redirectWhenRefreshFailed(error: unknown) {
  if (typeof window === 'undefined') {
    return
  }
  const is401 = isAxiosError(error) && error.response?.status === 401
  if (!is401) {
    window.dispatchEvent(new CustomEvent(AUTH_REFRESH_FAILED_EVENT))

    setTimeout(() => {
      if (localStorage.getItem(TOKEN_KEY)) {
        return
      }
      window.location.href = '/'
     }, 1000)
  }
}

export async function refreshTokenAndRetry(
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> {
  const queuedPromise = queueIfRefreshing(config)
  if (queuedPromise) {
    const queuedConfig = await queuedPromise
    if (queuedConfig) {
      return queuedConfig
    }
  }

  isRefreshing = true
  tokenExpired = true
  refreshPromise = doRefreshToken()

  try {
    const newToken = await refreshPromise
    processQueue(null, newToken)
    config.headers.Authorization = `Bearer ${newToken}`
    return config
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error))
    processQueue(err, null)
    redirectWhenRefreshFailed(error)
    return Promise.reject(err)
  } finally {
    isRefreshing = false
    tokenExpired = false
    refreshPromise = null
  }
}

export function isRefreshingToken(): boolean {
  return isRefreshing
}

export function isTokenExpired(): boolean {
  return tokenExpired
}

export async function refreshToken(): Promise<string> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  isRefreshing = true
  tokenExpired = true
  refreshPromise = doRefreshToken()

  try {
    const newToken = await refreshPromise
    processQueue(null, newToken)
    return newToken
  } catch (error) {
    processQueue(error as Error, null)
    throw error
  } finally {
    isRefreshing = false
    tokenExpired = false
    refreshPromise = null
  }
}
