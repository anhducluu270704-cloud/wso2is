/* eslint-disable */
'use client'

import { BaseAPIResponse } from '@/models/api/common'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { ReactNode, useMemo } from 'react'
import { toast } from 'sonner'
import { useAuth } from './auth-provider'

export default function ReactQueryProvider({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const queryClient = useMemo(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          retry: (failureCount, error) => {
            const axiosError = error as AxiosError<BaseAPIResponse>
            const statusCode = axiosError.response?.status

            if (statusCode === 401) {
              return false
            }

            return failureCount < 1
          },
          refetchOnWindowFocus: false,
          staleTime: 1000 * 60 * 5, // 5 phút
        },
      },
      queryCache: new QueryCache({
        onError: (error, query) => {
          const axiosError = error as AxiosError<BaseAPIResponse>
          const statusCode = Number(axiosError.response?.data.code)
          const { logout } = useAuth()

          if (statusCode === 401) {
            logout()
            return
          }
          if (
            query.state.data !== undefined &&
            statusCode &&
            statusCode > 400
          ) {
            toast.error(axiosError.response?.data?.error ?? axiosError.message)
          }
        },
      }),
    })
  }, [])

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
