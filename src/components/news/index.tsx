'use client'

import {
  NewsSectionCard,
  NewsSectionWrapper,
} from '@/components/news/container'
import { NewsHighlights } from '@/components/news/highlights'
import { NEWS_ITEMS_PER_SECTION_DEFAULT } from '@/constants/news'
import newsApi from '@/services/news/news.service'
import {
  getNewsCategoryLabel,
  highlightItemToNewsItem,
} from '@/services/news/news-display'
import {
  newsKeys,
  useGetHighlights,
  useGetNewsCategories,
} from '@/services/news/news.query-options'
import EUPageLayout from '@/share/layout/end-user/page'
import { useQueries } from '@tanstack/react-query'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo } from 'react'

type NewsWrapperProps = Readonly<{
  limit?: number
}>

export default function NewsWrapper({ limit: limitProp }: NewsWrapperProps) {
  const limit = limitProp ?? NEWS_ITEMS_PER_SECTION_DEFAULT
  const t = useTranslations('layout.header')
  const locale = useLocale()

  const { data: highlightsRes } = useGetHighlights()
  const highlightItems = useMemo(
    () => highlightsRes?.data.map(highlightItemToNewsItem) ?? [],
    [highlightsRes?.data],
  )

  const { data: categoriesRes } = useGetNewsCategories()
  const categories = categoriesRes?.data ?? []

  const categoryQueries = useQueries({
    queries: categories.map((cat) => ({
      queryKey: newsKeys.listByCategory(cat.categoryId, limit, 0),
      queryFn: () =>
        newsApi.getNewsByCategory({
          categoryId: cat.categoryId,
          limit,
          offset: 0,
        }),
      enabled: categories.length > 0,
    })),
  })

  return (
    <EUPageLayout
      title={t('news')}
      headerImageSrc="/images/news/banner-news.png"
      background=""
    >
      <NewsHighlights items={highlightItems} />

      {categories.map((cat, index) => {
        const q = categoryQueries[index]
        if (!q || q.isPending) return null

        const items = (q.data?.data.list ?? [])
          .map(highlightItemToNewsItem)
          .slice(0, limit)
        if (items.length === 0) return null

        const title = getNewsCategoryLabel(cat, locale)

        return (
          <NewsSectionWrapper
            key={cat.categoryId}
            title={title}
            seeAllHref={`/news/category/${cat.categoryId}`}
            background={index % 2 === 0 ? 'grey-11' : undefined}
          >
            <div className="grid gap-6 md:grid-cols-3">
              {items.map((item) => (
                <NewsSectionCard key={item.id} item={item} />
              ))}
            </div>
          </NewsSectionWrapper>
        )
      })}
    </EUPageLayout>
  )
}
