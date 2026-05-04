'use client'

import { NewsSectionCard } from '@/components/news/container'
import { ITEMS_PER_PAGE } from '@/constants/news'
import {
  getNewsCategoryLabel,
  highlightItemToNewsItem,
} from '@/services/news/news-display'
import {
  useGetNewsByCategory,
  useGetNewsCategories,
} from '@/services/news/news.query-options'
import PaginationView from '@/share/components/pagination'
import EUPageLayout from '@/share/layout/end-user/page'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'

const HEADER_IMAGE = '/images/news/categories-banner.png'

type NewsCategoriesProps = Readonly<{
  categoryId: string
}>

export default function NewsCategories({
  categoryId,
}: NewsCategoriesProps) {
  const locale = useLocale()
  const t = useTranslations('layout.header')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const categoriesQuery = useGetNewsCategories()
  const resolved = categoriesQuery.data?.data.find(
    (c) => c.categoryId === categoryId,
  )

  const currentPage = useMemo(() => {
    const page = searchParams.get('page')
    const parsed = page ? parseInt(page, 10) : 1
    return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed
  }, [searchParams])

  const offset = (currentPage - 1) * ITEMS_PER_PAGE
  const canFetchArticles = categoriesQuery.isSuccess && !!resolved

  const articlesQuery = useGetNewsByCategory(
    categoryId,
    { limit: ITEMS_PER_PAGE, offset },
    { enabled: canFetchArticles },
  )

  const onPageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString())
      if (page === 1) {
        params.delete('page')
      } else {
        params.set('page', String(page))
      }
      const query = params.toString()
      router.push(query ? `${pathname}?${query}` : pathname)
    },
    [router, pathname, searchParams],
  )

  if (categoriesQuery.isPending) {
    return null
  }

  if (categoriesQuery.isError || !resolved) {
    return null
  }

  if (articlesQuery.isPending) {
    return null
  }

  if (articlesQuery.isError) {
    return null
  }

  const title = getNewsCategoryLabel(resolved, locale)
  const payload = articlesQuery.data?.data
  const paginatedItems =
    payload?.list.map(highlightItemToNewsItem) ??
    []
  const total = payload?.pagination.total ?? 0
  const totalPages =
    total > 0 ? Math.ceil(total / ITEMS_PER_PAGE) : 0

  return (
    <EUPageLayout
      title={title}
      headerImageSrc={HEADER_IMAGE}
      background=""
      breadcrumbTrail={[
        { label: t('news'), href: '/news' },
        { label: title },
      ]}
    >
      <div className="flex flex-1 flex-col h-full py-16 bg-white">
        <div className="container mx-auto flex flex-col gap-8">
          <div className="grid gap-6 md:grid-cols-3">
            {paginatedItems.map((item) => (
              <NewsSectionCard key={item.id} item={item} variant="default" />
            ))}
          </div>
          {totalPages > 1 && (
            <PaginationView
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </div>
      </div>
    </EUPageLayout>
  )
}
