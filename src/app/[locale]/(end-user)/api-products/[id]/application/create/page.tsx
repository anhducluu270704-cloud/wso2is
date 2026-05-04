import CreateApplicationWrapper from '@/components/application/create'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('layout')

  return {
    title: t('header.application'),
    description: '',
  }
}
export default async function CreateApplicationPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ callback: string }> }>) {
  const { callback } = await searchParams
  return <CreateApplicationWrapper callback={callback} />
}
