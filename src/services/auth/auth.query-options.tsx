// hooks/useAuth.ts

import {
  AUTH_INFO_KEY,
  AUTH_REFRESH_FAILED_EVENT,
  TOKEN_KEY,
} from '@/constants/system'
import { useRouter } from '@/i18n/navigation'
import { BaseAPIResponse } from '@/models/api/common'
import { useGetUrlLoginMutation } from '@/share/layout/end-user/header/hook'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useCallback } from 'react'
import {
  AuthInfoBase,
  AuthInfoBaseResponse,
  AuthInfoFullSchema,
  LogoutRequest,
  RefreshTokenRequest,
} from './auth.schema'
import authApi from './auth.service'

export const authKeys = {
  all: ['auth'] as const,
  verifyToken: (token?: string) =>
    [...authKeys.all, token, 'verifyToken'] as const,
}

export function useVerifyToken(token: string) {
  return useQuery({
    queryKey: authKeys.verifyToken(token),
    queryFn: () => authApi.verifyToken(token),
    retry: false,
  })
}

const clearAuthAndLogout = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(AUTH_INFO_KEY)
}

export const useRefresh = (
  onSuccessCallback: (data: AuthInfoBase) => void,
  onErrorCallback: () => void
) => {
  return useMutation<
    AuthInfoBaseResponse,
    AxiosError,
    { body: RefreshTokenRequest }
  >({
    mutationFn: ({ body }) => authApi.refresh(body),
    onSuccess: (data) => onSuccessCallback(data.data),
    onError: () => {
      clearAuthAndLogout()
      onErrorCallback()
    },
  })
}
export const useLogout = (onSuccess: () => void) => {
  const mutate = useGetUrlLoginMutation()
  return useMutation<BaseAPIResponse, AxiosError, LogoutRequest>({
    mutationFn: (body) => authApi.logout(body),
    onSuccess: () => {
      onSuccess()
      mutate.mutate()
    },
  })
}

export const useTokenRefresh = () => {
  const router = useRouter()
  const refreshToken = useCallback(async (): Promise<AuthInfoBaseResponse> => {
    const savedAuthInfoLocal = localStorage.getItem(AUTH_INFO_KEY)
    if (!savedAuthInfoLocal) {
      throw new Error('Cannot find auth information to refresh')
    }
    const authInfo = JSON.parse(savedAuthInfoLocal)

    const refreshBody: RefreshTokenRequest = {
      refreshToken: authInfo.refresh_token,
    }
    try {
      const newAuthInfo = await authApi.refresh(refreshBody)
      localStorage.setItem(TOKEN_KEY, newAuthInfo.data.access_token)
      const newAuthInfoFull = AuthInfoFullSchema.parse({
        ...newAuthInfo.data,
        user_info: authInfo.user_info,
      })
      localStorage.setItem(AUTH_INFO_KEY, JSON.stringify(newAuthInfoFull))
      return newAuthInfo
    } catch (e) {
      if (
        e instanceof AxiosError &&
        e.response?.status === 401 &&
        typeof window !== 'undefined'
      ) {
        window.dispatchEvent(new CustomEvent(AUTH_REFRESH_FAILED_EVENT))
      }
      throw e
    }
  }, [])

  const refreshTokenWithRetry = useCallback(
    async (onSuccess?: () => void) => {
      try {
        await refreshToken()
        onSuccess?.()
      } catch (refreshError) {
        clearAuthAndLogout()
        throw refreshError
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router]
  )

  return {
    refreshToken,
    refreshTokenWithRetry,
    clearAuthAndLogout,
  }
}
