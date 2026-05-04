import GuideWrapper from '@/components/support/guide'
import { FilterSearchParam } from '@/models/api/common'
import { FilterProvider } from '@/providers/filter-provider'
import { parseFilterSearchParams } from '@/util/filter'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('support.guide.page')

  return {
    title: t('title'),
    description: '',
  }
}

export default async function SupportGuidePage({
  searchParams,
}: Readonly<{
  searchParams: Promise<FilterSearchParam>
}>) {
  const params = await searchParams
  const parseResult = parseFilterSearchParams(params)

  if (parseResult.error) return <div>Invalid Query Params</div>
  return (
    <FilterProvider filter={parseResult.data}>
      <GuideWrapper />
    </FilterProvider>
  )
}
