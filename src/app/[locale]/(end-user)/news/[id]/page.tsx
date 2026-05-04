
import NewsDetailWrapper from '@/components/news/detail'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('layout.header')

  return {
    title: t('news'),
    description: '',
  }
}

export default async function NewsDetailPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>
}>) {
  const { id } = await params

  return <NewsDetailWrapper id={id} />
}

