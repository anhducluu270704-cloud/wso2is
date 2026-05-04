'use client'

import { useRouter } from '@/i18n/navigation'
import { useSubscribeApiMutation } from '@/services/application/application.mutations'
import { ApplicationDetail } from '@/services/application/application.schema'
import ConfirmModal from '@/share/components/modal/confirm'
import { Badge } from '@/share/ui/badge'
import { Button } from '@/share/ui/button'
import { Card, CardContent, CardFooter } from '@/share/ui/card'
import { formatStatusLabel } from '@/util'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

type ApplicationCardProps = Readonly<{
  application: ApplicationDetail
  api_id: string
  hasAnySubscribed: boolean
  onSubscribeSuccess?: (
    message: string,
    options?: { durationMs?: number }
  ) => void
  onSubscribeError?: (
    message: string,
    options?: { durationMs?: number }
  ) => void
  api_product_name: string
}>

export default function ApplicationCard({
  application,
  api_id,
  hasAnySubscribed,
  onSubscribeSuccess,
  onSubscribeError,
  api_product_name,
}: Readonly<ApplicationCardProps>) {
  const t = useTranslations('application')
  const router = useRouter()
  const [openConfirm, setOpenConfirm] = useState(false)

  const subscribeMutation = useSubscribeApiMutation(application.name, {
    onSuccess: onSubscribeSuccess,
    onError: onSubscribeError,
  })

  const detailUrl = `/api-products/${api_id}/application/${application.applicationId}?api_product_name=${api_product_name}`

  return (
    <>
      <Card
        size="sm"
        className="gap-6! justify-between bg-white rounded-md ring-0 shadow-none p-6!"
      >
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-title-md-emphasize text-black-1 truncate">
              {application.name}
            </span>
            {application.registeredThisApi && (
              <Badge variant="active" className="text-black-1">
                {t('card.badge.subscribed')}
              </Badge>
            )}
          </div>
          <div className="flex justify-between text-body-body text-grey-6">
            <span>{t('card.fields.tier')}</span>
            <span className="text-black-1">
              {formatStatusLabel(application.tier)}
            </span>
          </div>
          <div className="flex justify-between text-body-body text-grey-6">
            <span>{t('card.fields.subscription')}</span>
            <span className="text-black-1">
              {application.subscriptionCount}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {application.tier === 'SANDBOX' && (
            <>
              {application.registeredThisApi ? (
                <Button
                  rounded
                  size="lg"
                  fullWidth
                  disabled={subscribeMutation.isPending}
                  onClick={() =>
                    router.push(
                      `/api-products/${api_id}/tryout?app_id=${application.applicationId}`
                    )
                  }
                >
                  {t('btn.test_sandbox')}
                </Button>
              ) : (
                <Button
                  onClick={() => setOpenConfirm(true)}
                  rounded
                  size="lg"
                  fullWidth
                  disabled={subscribeMutation.isPending || hasAnySubscribed}
                >
                  {subscribeMutation.isPending
                    ? t('mess.subscribe.loading')
                    : t('btn.subscribe')}
                </Button>
              )}
            </>
          )}
          <Button
            variant="secondary"
            linked
            size="sm"
            fullWidth
            onClick={() => router.push(detailUrl)}
          >
            {t('btn.detail')}
          </Button>
        </CardFooter>
      </Card>
      <ConfirmModal
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        title={
          <div className="text-left! max-w-full">
            {t('confirm_subscribe.title')}
          </div>
        }
        description={t('confirm_subscribe.description')}
        onConfirm={() => {
          subscribeMutation.mutate({
            applicationId: application.applicationId,
            body: {
              apiId: api_id,
              throttlingPolicy: application.throttlingPolicy,
            },
          })
        }}
        cancelTitle={t('btn.close')}
        confirmTitle={t('btn.continue')}
        className="md:max-w-[412px]!"
      />
    </>
  )
}
