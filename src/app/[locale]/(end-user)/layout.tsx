'use client'

import LoadingPage from '@/share/components/full-page/loading'
import { useAuth } from '@/providers/auth-provider'
import { AuthSessionProvider } from '@/providers/auth-session-provider'
import EUFooter from '@/share/layout/end-user/footer'
import EUHeader from '@/share/layout/end-user/header'

export default function EndUserLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { isLoading, authInfo } = useAuth()

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <AuthSessionProvider authSession={authInfo}>
      <div className="flex flex-col min-h-screen">
        <EUHeader />
        <div className="flex flex-1 flex-col justify-between transition-all duration-300 ease-in-out">
          {children}
          <EUFooter />
        </div>
      </div>
    </AuthSessionProvider>
  )
}
