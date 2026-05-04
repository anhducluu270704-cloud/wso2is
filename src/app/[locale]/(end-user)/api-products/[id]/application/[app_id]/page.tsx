import ApplicationDetailWrapper from '@/components/application/detail'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('layout')

  return {
    title: t('header.application'),
    description: '',
  }
}

export default async function ApplicationDetailPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ app_id: string }>
  searchParams: Promise<{ api_product_name: string }>
}>) {
  const { app_id } = await params
  const { api_product_name } = await searchParams

  return (
    <ApplicationDetailWrapper
      api_product_name={api_product_name}
      app_id={app_id}
    />
  )
}
