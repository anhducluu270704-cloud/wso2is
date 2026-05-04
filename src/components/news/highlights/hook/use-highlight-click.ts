'use client'

import { useRouter } from '@/i18n/navigation'

export function useHighlightClick(id: string) {
  const router = useRouter()
  return {
    onClick: () => router.push(`/news/${id}`),
  }
}
