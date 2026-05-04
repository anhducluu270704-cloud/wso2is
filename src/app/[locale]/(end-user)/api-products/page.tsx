import ApiProductWrapper from '@/components/api-product'
import { ITEMS_PER_PAGE } from '@/constants/api-product'
import { FilterSearchParam } from '@/models/api/common'
import { FilterProvider } from '@/providers/filter-provider'
import { parseFilterSearchParams } from '@/util/filter'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('layout')

  return {
    title: t('header.apiproducts'),
    description: '',
  }
}

export default async function ApiProductsPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<FilterSearchParam>
}>) {
  const params = await searchParams
  const paramsWithLimit = {
    ...params,
    limit: params.limit ?? ITEMS_PER_PAGE,
  }
  const parseResult = parseFilterSearchParams(paramsWithLimit)

  if (parseResult.error) return <div>Invalid Query Params</div>
  return (
    <FilterProvider filter={parseResult.data}>
      <ApiProductWrapper />
    </FilterProvider>
  )
}
