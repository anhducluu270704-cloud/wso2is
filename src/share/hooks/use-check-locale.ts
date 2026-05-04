'use client'

import { useLocale } from 'next-intl'

export function useCheckLocale(locale: string): boolean {
  return useLocale() === locale
}
