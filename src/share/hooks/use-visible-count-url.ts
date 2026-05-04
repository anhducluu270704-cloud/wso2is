'use client'

import { DEFAULT_PAGE_START } from '@/constants/system'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export type UseVisibleCountUrlSyncOptions = {
  defaultPageSize: number
}

function buildNextSearchParams(
  source: URLSearchParams,
  nextLimit: number,
  defaultPageSize: number
): URLSearchParams | null {
  const params = new URLSearchParams(source.toString())
  const rawLimit = params.get('limit')
  const currentLimit = rawLimit ? Number(rawLimit) : defaultPageSize
  const currentPageRaw = params.get('page')
  const currentPageIsFirst =
    currentPageRaw == null || currentPageRaw === String(DEFAULT_PAGE_START)

  params.delete('page')

  if (nextLimit > defaultPageSize) {
    params.set('limit', String(nextLimit))
  } else {
    params.delete('limit')
  }

  const nextLimitParam = params.get('limit')
  const nextLimitComparable = nextLimitParam
    ? Number(nextLimitParam)
    : defaultPageSize

  const unchanged = nextLimitComparable === currentLimit && currentPageIsFirst

  return unchanged ? null : params
}

export function useVisibleCountUrlSync({
  defaultPageSize,
}: UseVisibleCountUrlSyncOptions) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const syncVisibleWindowToUrl = useCallback(
    (visibleCount: number, total?: number) => {
      const safeTotal =
        total != null && Number.isFinite(total) && total > 0 ? total : Infinity
      const nextLimit = Math.min(
        Math.max(Math.floor(visibleCount), 1),
        safeTotal
      )

      const source = new URLSearchParams(searchParams.toString())

      const params = buildNextSearchParams(source, nextLimit, defaultPageSize)
      if (params === null) return

      const query = params.toString()
      const nextHref = query ? `${pathname}?${query}` : pathname
      router.replace(nextHref, { scroll: false })
    },
    [defaultPageSize, pathname, router, searchParams]
  )

  const resetVisibleCountInUrl = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('limit')
    params.delete('page')
    const query = params.toString()
    const nextHref = query ? `${pathname}?${query}` : pathname
    router.replace(nextHref, { scroll: true })
  }, [pathname, router, searchParams])

  return { syncVisibleWindowToUrl, resetVisibleCountInUrl }
}
