import ApiProductTryouWrapper from '@/components/api-product/tryout'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('layout')

  return {
    title: t('header.tryout'),
    description: '',
  }
}

export default async function ApiProductTryoutPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ id: string }>
  searchParams: Promise<{ app_id: string; case_id: string }>
}>) {
  const { id } = await params
  const { app_id, case_id } = await searchParams

  if (!id || !app_id) {
    return notFound()
  }

  return (
    <ApiProductTryouWrapper api_id={id} app_id={app_id} case_id={case_id} />
  )
}
