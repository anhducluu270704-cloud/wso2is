import NewsCategories from '@/components/news/categories'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('layout')

  return {
    title: t('header.news'),
    description: '',
  }
}

export default async function NewsCategoryPage({
  params,
}: Readonly<{
  params: Promise<{ categoryId: string }>
}>) {
  const { categoryId } = await params

  return <NewsCategories categoryId={categoryId} />
}
