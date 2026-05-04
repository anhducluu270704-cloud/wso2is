import SupportWrapper from '@/components/support'
import { FilterSearchParam } from '@/models/api/common'
import { FilterProvider } from '@/providers/filter-provider'
import { parseFilterSearchParams } from '@/util/filter'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('layout')

  return {
    title: t('header.support'),
    description: '',
  }
}

export default async function SupportPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<FilterSearchParam>
}>) {
  const params = await searchParams
  const parseResult = parseFilterSearchParams(params)

  if (parseResult.error) return <div>Invalid Query Params</div>
  return (
    <FilterProvider filter={parseResult.data}>
      <SupportWrapper />
    </FilterProvider>
  )
}
