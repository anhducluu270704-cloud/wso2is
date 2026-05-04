import ApiProductDetailWrapper from '@/components/api-product/detail'
import { APPLICATION_LIST_INITIAL_PAGE_SIZE } from '@/constants/application'
import { FilterSearchParam } from '@/models/api/common'
import { FilterProvider } from '@/providers/filter-provider'
import { parseFilterSearchParams } from '@/util/filter'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('layout')

  return {
    title: t('header.apiproducts'),
    description: '',
  }
}

export default async function ApiProductDetailPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ id: string }>
  searchParams: Promise<FilterSearchParam & { inlinetoasttype?: string; inlinetoastmsgkey?: string }>
}>) {
  const { id } = await params
  const { inlinetoasttype, inlinetoastmsgkey, ...filterParams } = await searchParams
  const paramsWithLimit = {
    ...filterParams,
    limit: filterParams.limit ?? APPLICATION_LIST_INITIAL_PAGE_SIZE,
  }
  const parseResult = parseFilterSearchParams(paramsWithLimit)

  if (parseResult.error) return notFound()

  return (
    <FilterProvider filter={parseResult.data}>
      <ApiProductDetailWrapper id={id} inlinetoasttype={inlinetoasttype ?? ''} inlinetoastmsgkey={inlinetoastmsgkey ?? ''} />
    </FilterProvider>
  )
}
