'use client'

import { useRouter } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_START } from '@/constants/system'
import { Pagination } from '@/models/api/common'

export function usePaginationRouter({ limit, total, offset }: Pagination) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const onPageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (limit != DEFAULT_PAGE_SIZE) params.set('limit', String(limit))
    else params.delete('limit')
    params.set('page', String(page + DEFAULT_PAGE_START))
    router.push(`?${params.toString()}`)
  }
  const currentPage = Math.floor(offset / limit)
  const totalPages = Math.ceil(total / limit)
  const pageSize = limit
  return { onPageChange, currentPage, totalPages, pageSize }
}
