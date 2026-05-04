'use client'

import { type ReactNode, useCallback, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  ApplicationDetail,
  Subscription,
} from '@/services/application/application.schema'
import { useDeleteSubscriptionMutation } from '@/services/application/application.mutations'
import ConfirmModal from '@/share/components/modal/confirm'
import { DeleteDocument } from '@/share/icons'
import { SpinnerCustom } from '@/share/ui/spinner'
import { useGetAllSubscriptions } from '@/services/application/application.query-options'
import ApplicationSubscriptionsTable from './table'

function subscriptionConfirmDeleteTitleChunk(chunks: ReactNode) {
  return (
    <span className="inline-block min-w-0 max-w-[240px] truncate align-bottom">
      {chunks}
    </span>
  )
}

type ApplicationSubscriptionsProps = Readonly<{
  applicationData: ApplicationDetail
}>

export default function ApplicationSubscriptions({
  applicationData,
}: ApplicationSubscriptionsProps) {
  const t = useTranslations('application')
  const deleteSubscriptionMutation = useDeleteSubscriptionMutation()
  const { data, isLoading } = useGetAllSubscriptions(
    applicationData.applicationId
  )
  const [openConfirm, setOpenConfirm] = useState(false)
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null)
  const subscriptions = data?.data.list ?? []
  const metadata = data?.data.pagination
  const handleDeleteClick = useCallback((subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setOpenConfirm(true)
  }, [])

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl flex flex-col gap-6">
        <SpinnerCustom className="py-12" />
      </div>
    )
  }

  return (
    <div className="flex flex-1 max-w-full! flex-col gap-12 bg-white px-12 py-8 rounded-2xl">
      <h2 className="text-title-lg-emphasize text-black-1">
        {t('detail.sections.api_registration')}
      </h2>
      <ApplicationSubscriptionsTable
        subscriptions={subscriptions}
        metadata={metadata}
        onDeleteClick={handleDeleteClick}
        tier={applicationData.tier}
      />
      <ConfirmModal
        open={openConfirm}
        onOpenChange={(nextOpen) => {
          setOpenConfirm(nextOpen)
          if (!nextOpen) setSelectedSubscription(null)
        }}
        title={
          <span className="inline max-w-full">
            {t.rich('detail.api_registration.confirm_delete.title', {
              api_name: subscriptionConfirmDeleteTitleChunk,
              app_name: subscriptionConfirmDeleteTitleChunk,
              api_name_value: selectedSubscription?.apiInfo.name ?? '',
              app_name_value: applicationData.name,
            })}
          </span>
        }
        description={t('detail.api_registration.confirm_delete.description')}
        onConfirm={() => {
          if (!selectedSubscription) return
          if (deleteSubscriptionMutation.isPending) return

          deleteSubscriptionMutation.mutate(
            {
              applicationId: applicationData.applicationId,
              subscriptionId: selectedSubscription.subscriptionId,
            },
            {
              onSuccess: () => {
                setOpenConfirm(false)
                setSelectedSubscription(null)
              },
            }
          )
        }}
        cancelTitle={t('btn.cancel')}
        confirmTitle={t('btn.delete')}
        icon={<DeleteDocument className="size-36" />}
        className="max-w-xl w-full"
      />
    </div>
  )
}
