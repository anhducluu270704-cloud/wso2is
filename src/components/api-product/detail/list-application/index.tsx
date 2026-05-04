'use client'

import { DEFAULT_PAGE_SIZE } from '@/constants/system'
import { FilterSearchParam } from '@/models/api/common'
import { useAuthSession } from '@/providers/auth-session-provider'
import { FilterProvider } from '@/providers/filter-provider'
import EmptyState from '@/share/components/empty-state'
import { useGetUrlLoginMutation } from '@/share/layout/end-user/header/hook'
import { parseFilterSearchParams } from '@/util/filter'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import ListingView from '../../../application/listing'

export default function ListApplication({
  api_id,
  api_product_name,
  inlinetoasttype,
  inlinetoastmsgkey,
}: Readonly<{
  api_id: string
  api_product_name: string
  inlinetoasttype: string
  inlinetoastmsgkey: string
}>) {
  const t = useTranslations('application')
  const { authSession } = useAuthSession()
  const searchParams = useSearchParams()
  const mutate = useGetUrlLoginMutation()

  const paramsWithLimit = useMemo(() => {
    const page = searchParams.get('page')
    const limit = searchParams.get('limit')
    return {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : DEFAULT_PAGE_SIZE,
    }
  }, [searchParams])

  const parseResult = useMemo(
    () => parseFilterSearchParams(paramsWithLimit as FilterSearchParam),
    [paramsWithLimit]
  )

  if (!authSession) {
    return (
      <EmptyState
        header={t('listing.header')}
        title={t('listing.not_auth.title')}
        buttonTitle={t('btn.login')}
        onClick={() => mutate.mutate()}
      />
    )
  }

  if (parseResult.error) {
    return <div>Invalid Query Params</div>
  }

  return (
    <FilterProvider filter={parseResult.data}>
      <ListingView
        api_id={api_id}
        api_product_name={api_product_name}
        inlinetoasttype={inlinetoasttype}
        inlinetoastmsgkey={inlinetoastmsgkey}
      />
    </FilterProvider>
  )
}
