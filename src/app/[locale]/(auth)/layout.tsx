'use client'

import LoadingPage from '@/share/components/full-page/loading'
import { useRouter } from '@/i18n/navigation'
import { useAuth } from '@/providers/auth-provider'
import { AuthSessionProvider } from '@/providers/auth-session-provider'
import AuthViewLayout from '@/share/layout/auth'
import { useEffect } from 'react'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { isLoading, authInfo } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (authInfo) router.push('/')
  }, [authInfo, router])

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <AuthSessionProvider authSession={authInfo}>
      <AuthViewLayout>{children}</AuthViewLayout>
    </AuthSessionProvider>
  )
}
