'use client'

import { useAuth } from '@/providers/auth-provider'
import LoadingPage from '@/share/components/full-page/loading'
import { useGetUrlLoginMutation } from '@/share/layout/end-user/header/hook'
import { useEffect, useRef } from 'react'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { isLoading, authInfo } = useAuth()
  const mutate = useGetUrlLoginMutation()

  const mutateRef = useRef(mutate)
  mutateRef.current = mutate

  useEffect(() => {
    if (!isLoading && !authInfo?.role) {
      mutateRef.current.mutate()
    }
  }, [isLoading, authInfo])

  if (isLoading) {
    return <LoadingPage />
  }

  return children
}
