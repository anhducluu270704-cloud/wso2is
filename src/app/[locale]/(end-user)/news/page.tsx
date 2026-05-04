import NewsWrapper from '@/components/news'
import { NEWS_ITEMS_PER_SECTION_DEFAULT } from '@/constants/news'
import { FilterSearchParam } from '@/models/api/common'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('layout')

  return {
    title: t('header.news'),
    description: '',
  }
}

export default async function NewsPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<FilterSearchParam>
}>) {
  const params = await searchParams
  const limit = params.limit ?? NEWS_ITEMS_PER_SECTION_DEFAULT

  return <NewsWrapper limit={limit} />
}

