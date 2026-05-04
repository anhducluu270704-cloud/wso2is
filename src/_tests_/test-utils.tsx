
import React from 'react'

const noop = () => {}

export const mockUseRouter = () => ({
  push: noop,
  replace: noop,
  back: noop,
  refresh: noop,
})

export const mockUseTranslations = () => (key: string) => key

export const MockProviders = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
)
