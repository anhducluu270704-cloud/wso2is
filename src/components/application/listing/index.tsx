'use client'

import NotFound404 from '@/app/not-found'
import { APPLICATION_LIST_INITIAL_PAGE_SIZE } from '@/constants/application'
import { useRouter } from '@/i18n/navigation'
import { useAuthSession } from '@/providers/auth-session-provider'
import { useFilter } from '@/providers/filter-provider'
import { useGetAllApplicationsInfinite } from '@/services/application/application.query-options'
import EmptyState from '@/share/components/empty-state'
import { ListGrid } from '@/share/components/list-grid'
import { Button } from '@/share/ui/button'
import { SpinnerCustom } from '@/share/ui/spinner'
import { PlusIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import InlineToast, { useApplicationInlineToast } from '../inline-toast'
import ApplicationCard from './card'

export default function ListingView({
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
  const { filter } = useFilter()
  const router = useRouter()
  const createUrl = `/api-products/${api_id}/application/create?callback=${window.location.href}`

  const { inlineToast, isToastExiting, showSuccess, showError, dismissToast } =
    useApplicationInlineToast(inlinetoasttype, inlinetoastmsgkey)

  const applicationsQuery = useGetAllApplicationsInfinite({
    ...filter,
    apiId: api_id,
    limit: Math.max(
      APPLICATION_LIST_INITIAL_PAGE_SIZE,
      Math.floor(filter.limit || APPLICATION_LIST_INITIAL_PAGE_SIZE)
    ),
  })
  const {
    data: applicationsData,
    isFetching,
    isError,
    isSuccess,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = applicationsQuery

  const allApplications = useMemo(
    () => applicationsData?.pages?.flatMap((p) => p.data?.list ?? []) ?? [],
    [applicationsData]
  )

  const hasAnySubscribed = useMemo(
    () =>
      allApplications.some(
        (application) => application.registeredThisApi === true
      ),
    [allApplications]
  )

  if (isFetching && !applicationsData) {
    return (
      <div className="bg-grey-7 rounded-2xl py-8 px-12 flex flex-col gap-6 w-full overflow-hidden">
        <SpinnerCustom />
      </div>
    )
  }

  if (isError) {
    return <NotFound404 />
  }

  if (isSuccess && allApplications.length === 0) {
    return (
      <EmptyState
        header={t('listing.header')}
        title={t('listing.empty.title')}
        description={t('listing.empty.description')}
        buttonTitle={t('listing.btn.create')}
        onClick={() => router.push(createUrl)}
      />
    )
  }

  return (
    <div className="relative bg-grey-7 rounded-2xl py-8 px-12 flex flex-col gap-6 w-full overflow-hidden">
      <InlineToast
        inlineToast={inlineToast}
        isToastExiting={isToastExiting}
        onDismiss={dismissToast}
      />
      <div className="flex items-center justify-between">
        <span className="text-headline-md-mobile md:text-headline-md-desktop">
          {t('listing.header')}
        </span>
        {authSession && (
          <Button
            onClick={() => router.push(createUrl)}
            variant="outline"
            size="lg"
            rounded
          >
            <PlusIcon className="size-6 text-black-1!" />
            {t('btn.create')}
          </Button>
        )}
      </div>
      <ListGrid
        elements={allApplications.map((application) => (
          <ApplicationCard
            key={application.applicationId}
            application={application}
            api_id={api_id}
            api_product_name={api_product_name}
            hasAnySubscribed={hasAnySubscribed}
            onSubscribeSuccess={() =>
              showSuccess(
                t('mess.subscribe.success', {
                  name: application.name,
                })
              )
            }
            onSubscribeError={() => showError(t('mess.subscribe.error'))}
          />
        ))}
        limitPerPage={filter.limit}
        defaultPageSize={APPLICATION_LIST_INITIAL_PAGE_SIZE}
        className="grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        hasNextPage={!!hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  )
}
