import {
  AUTH_INFO_KEY,
  ERROR_CODES,
  isAuthRefreshRequest,
  isAuthRequest,
  LOCALE_SELECTED_KEY,
  TOKEN_KEY,
} from '@/constants/system'
import { BaseAPIResponse } from '@/models/api/common'
import { refreshTokenAndRetry } from '@/util/token-refresh-queue'
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

const isSameOriginApi =
  process.env.NEXT_PUBLIC_USE_SAME_ORIGIN_API === 'true' ||
  !process.env.NEXT_PUBLIC_BACK_END_DOMAIN

const axiosClient = axios.create({
  baseURL: isSameOriginApi
    ? '/api/v1'
    : process.env.NEXT_PUBLIC_BACK_END_DOMAIN,
  headers: {},
  timeout: !isNaN(Number(process.env.NEXT_PUBLIC_TIME_OUT_API))
    ? Number(process.env.NEXT_PUBLIC_TIME_OUT_API)
    : 60000,
})

axiosClient.interceptors.request.use(
  function (config: InternalAxiosRequestConfig) {
    if (!isAuthRequest(config.url)) {
      const token = localStorage.getItem(TOKEN_KEY)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    const lang = localStorage.getItem(LOCALE_SELECTED_KEY)
    if (lang) {
      config.headers['Accept-Language'] = lang
    }
    return config
  },
  function (error: unknown) {
    return Promise.reject(
      error instanceof Error ? error : new Error(String(error))
    )
  }
)

axiosClient.interceptors.response.use(
  function (response: AxiosResponse) {
    return response.data
  },
  async function (error: AxiosError<BaseAPIResponse>) {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (
      error.response?.status === 401 &&
      originalRequest &&
      isAuthRefreshRequest(originalRequest.url)
    ) {
      return Promise.reject(error)
    }

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      const apiErrorCode = error.response?.data?.code
      if (apiErrorCode === ERROR_CODES['PERMISSION_DENIED']) {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(AUTH_INFO_KEY)
        if (typeof window !== 'undefined') {
          window.location.href = '/?err=PERMISSION_DENIED'
        }
        return Promise.reject(error)
      }

      originalRequest._retry = true

      try {
        const newConfig = await refreshTokenAndRetry(originalRequest)
        return axiosClient(newConfig)
      } catch (refreshError) {
        return Promise.reject(
          refreshError instanceof Error
            ? refreshError
            : new Error(String(refreshError))
        )
      }
    }

    return Promise.reject(error)
  }
)

export default axiosClient
