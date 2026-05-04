'use client'

import { AUTH_SYNC_EVENT } from '@/constants/auth'
import {
  AUTH_BROADCAST_CHANNEL,
  AUTH_CURRENT_PAGE_KEY,
  AUTH_INFO_KEY,
  AUTH_REFRESH_FAILED_EVENT,
  TOKEN_KEY,
} from '@/constants/system'
import { useRouter } from '@/i18n/navigation'
import { useLogout, useRefresh } from '@/services/auth/auth.query-options'
import {
  AuthContextType,
  AuthFullInfo,
  AuthInfoBase,
  AuthInfoFullSchema,
  RefreshTokenRequest,
} from '@/services/auth/auth.schema'
import { fetchLoginPageUrl } from '@/share/hooks/login-redirect'
import { toastSuccessOptionsForSize } from '@/share/ui/sonner'
import { useLocale, useTranslations } from 'next-intl'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { toast } from 'sonner'

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('layout')
  const [authInfo, setAuthInfo] = useState<AuthFullInfo | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const logoutMutation = useLogout(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(AUTH_INFO_KEY)
    sendAuthEvent('logout')
    setToken(null)
    setAuthInfo(null)
    toast.success(t('mess.logout.success'), toastSuccessOptionsForSize('lg'))
  })

  const login = useCallback(
    async (
      authDataLogin: AuthInfoBase,
      options?: { callback?: () => void; isNotSendBroadcast?: boolean }
    ) => {
      const authLogin = AuthInfoFullSchema.parse(authDataLogin)
      localStorage.setItem(TOKEN_KEY, authDataLogin.access_token)
      localStorage.setItem(AUTH_INFO_KEY, JSON.stringify(authLogin))
      setToken(authLogin.access_token)
      setAuthInfo(authLogin)
      if (!options?.isNotSendBroadcast) sendAuthEvent('changed')
      options?.callback?.()
    },
    []
  )

  const logout = useCallback(
    (options?: {
      callback?: () => void
      isNotSendBroadcast?: boolean
    }) => {
      if (options?.isNotSendBroadcast) {
        if (authInfo) {
          localStorage.removeItem(TOKEN_KEY)
          localStorage.removeItem(AUTH_INFO_KEY)
          setToken(null)
          setAuthInfo(null)
        }
        options?.callback?.()
        return
      }

      if (authInfo) {
        logoutMutation.mutate({
          idToken: authInfo.id_token,
          callback: `${window.location.origin}`,
        })
      }
    },
    [authInfo, logoutMutation]
  )

  const syncAuthFromStorage = useCallback(() => {
    const savedAuthInfoLocal = localStorage.getItem(AUTH_INFO_KEY)
    const savedToken = localStorage.getItem(TOKEN_KEY)
    if (savedToken && savedAuthInfoLocal) {
      const savedAuthInfo = AuthInfoFullSchema.safeParse(
        JSON.parse(savedAuthInfoLocal)
      )
      if (savedAuthInfo.success) {
        setToken(savedToken)
        setAuthInfo(savedAuthInfo.data)
        return
      }
    }
    setToken(null)
    setAuthInfo(null)
  }, [])

  const initAuth = useCallback(() => {
    syncAuthFromStorage()
    setIsLoading(false)
  }, [syncAuthFromStorage])

  const redirectToLoginPage = useCallback(() => {
    void fetchLoginPageUrl(locale).then(
      (url) => {
        window.location.assign(url)
      },
      () => {
        router.replace('/')
      }
    )
  }, [locale, router])

  const refreshMutation = useRefresh(login, logout)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    const onRefreshTokenUnauthorized = () => {
      logout()
    }
    window.addEventListener(
      AUTH_REFRESH_FAILED_EVENT,
      onRefreshTokenUnauthorized,
    )
    return () => {
      window.removeEventListener(
        AUTH_REFRESH_FAILED_EVENT,
        onRefreshTokenUnauthorized,
      )
    }
  }, [logout])

  useEffect(() => {
    initAuth()

    let channel: BroadcastChannel | null = null
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel(AUTH_BROADCAST_CHANNEL)
        channel.onmessage = ({ data }) => {
          try {
            if (sessionStorage.getItem(AUTH_CURRENT_PAGE_KEY) === 'true') {
              return
            }
            switch (data) {
              case 'logout': {
                syncAuthFromStorage()
                redirectToLoginPage()
                break
              }
              case 'changed': {
                syncAuthFromStorage()
                const hasSession = Boolean(localStorage.getItem(TOKEN_KEY))
                if (hasSession) {
                  router.refresh()
                } else {
                  redirectToLoginPage()
                }
                break
              }
            }
          } catch (error) {
            toast.error(String(error))
          }
        }
      }
    } catch (error) {
      toast.error(String(error))
    }

    return () => {
      if (channel) {
        try {
          channel.onmessage = null
          channel.close()
        } catch (error) {
          toast.error(String(error))
        }
      }
    }
  }, [initAuth, redirectToLoginPage, router, syncAuthFromStorage])

  useEffect(() => {
    if (authInfo?.refresh_token && authInfo?.refresh_at) {
      const now = Date.now()
      const delay = authInfo.refresh_at - now
      const handleRefresh = async () => {
        const body: RefreshTokenRequest = {
          refreshToken: authInfo.refresh_token,
        }
        refreshMutation.mutate({
          body,
        })
      }

      const timeout = setTimeout(handleRefresh, delay)

      return () => clearTimeout(timeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authInfo?.refresh_token, authInfo?.refresh_at])

  const value = useMemo(
    () => ({
      authInfo,
      isLoading,
      token,
      login,
      logout,
    }),
    [authInfo, isLoading, token, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function sendAuthEvent(event: AUTH_SYNC_EVENT) {
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel(AUTH_BROADCAST_CHANNEL)
      sessionStorage.setItem(AUTH_CURRENT_PAGE_KEY, 'true')
      setTimeout(() => {
        sessionStorage.removeItem(AUTH_CURRENT_PAGE_KEY)
      }, 1000)
      try {
        channel.postMessage(event)
      } catch (error) {
        toast.error(String(error))
      } finally {
        try {
          channel.close()
        } catch (error) {
          toast.error(String(error))
        }
      }
    }
  } catch (error) {
    toast.error(String(error))
  }
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
