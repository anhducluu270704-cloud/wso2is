'use client'

import { createContext, useContext, useMemo, useState } from 'react'

type TryoutDetailContextValue = {
  securitySchemeType: string
  setSecuritySchemeType: (value: string) => void
  selectedEnvironment: string
  setSelectedEnvironment: (value: string) => void
  accessToken: string
  setAccessToken: (value: string) => void
}

const TryoutDetailContext = createContext<TryoutDetailContextValue | null>(null)

export function TryoutDetailProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [securitySchemeType, setSecuritySchemeType] = useState('OAUTH')
  const [selectedEnvironment, setSelectedEnvironment] = useState('sandbox')
  const [accessToken, setAccessToken] = useState('')

  const value = useMemo(
    () => ({
      securitySchemeType,
      setSecuritySchemeType,
      selectedEnvironment,
      setSelectedEnvironment,
      accessToken,
      setAccessToken,
    }),
    [securitySchemeType, selectedEnvironment, accessToken]
  )

  return (
    <TryoutDetailContext.Provider value={value}>
      {children}
    </TryoutDetailContext.Provider>
  )
}

export function useTryoutDetailContext() {
  const ctx = useContext(TryoutDetailContext)
  if (!ctx) {
    throw new Error(
      'useTryoutDetailContext must be used within TryoutDetailProvider'
    )
  }
  return ctx
}
