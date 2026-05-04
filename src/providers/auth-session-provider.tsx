'use client'

import { AuthFullInfo } from '@/services/auth/auth.schema'
import React, { createContext, useContext, useMemo } from 'react'

const AuthSessionContext = createContext<{
  authSession: AuthFullInfo | null
} | null>(null)

export const AuthSessionProvider = ({
  authSession,
  children,
}: Readonly<{
  authSession: AuthFullInfo | null
  children: React.ReactNode
}>) => {
  const value = useMemo(
    () => ({ authSession }),
    [authSession],
  )
  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  )
}

export const useAuthSession = () => {
  const ctx = useContext(AuthSessionContext)
  if (ctx === null) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
