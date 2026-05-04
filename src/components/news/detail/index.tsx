'use client'

import EUPageLayout from '@/share/layout/end-user/page'
import {
  getNewsDisplayFields,
  highlightItemToNewsItem,
} from '@/services/news/news-display'
import {
  useGetHighlights,
  useGetNewsDetail,
} from '@/services/news/news.query-options'
import { useLocale, useTranslations } from 'next-intl'
import { notFound } from 'next/navigation'
import { useMemo } from 'react'
import { NewsDetailContent } from './content'

type NewsDetailWrapperProps = Readonly<{ id: string }>

export default function NewsDetailWrapper({
  id,
}: NewsDetailWrapperProps) {
  const locale = useLocale()
  const t = useTranslations('layout.header')

  const detailQuery = useGetNewsDetail(id)
  const highlightsQuery = useGetHighlights()

  const article = detailQuery.data?.data

  const relatedArticles = useMemo(() => {
    if (!article) return []

    const others =
      highlightsQuery.data?.data.filter((h) => h.id !== article.id) ?? []

    return others.slice(0, 3).map(highlightItemToNewsItem)
  }, [article, highlightsQuery.data?.data])

  if (detailQuery.isPending) {
    return null
  }

  if (detailQuery.isError || !article) {
    notFound()
  }

  const mapped = highlightItemToNewsItem(article)
  const fields = getNewsDisplayFields(mapped, locale)

  return (
    <EUPageLayout
      title=""
      headerImageSrc={fields.imageUrl}
      background=""
      breadcrumbTrail={[
        { label: t('news'), href: '/news' },
        { label: fields.title },
      ]}
      className="min-h-[500px]"
    >
      <NewsDetailContent
        title={fields.title}
        date={fields.dateLabel}
        content={fields.description}
        relatedArticles={relatedArticles}
      />
    </EUPageLayout>
  )
}
