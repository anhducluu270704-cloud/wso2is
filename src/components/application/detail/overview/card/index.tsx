'use client'

import { ApplicationDetail } from '@/services/application/application.schema'
import { AppWindow, ShareNetwork, Speedometer, UserCircle } from '@/share/icons'
import { cn } from '@/share/lib/utils'
import { Card, CardContent, CardTitle } from '@/share/ui/card'
import { useTranslations } from 'next-intl'
import { APPLICATION_TIER } from '@/constants/application'
import { formatStatusLabel } from '@/util'

export type ApplicationOverviewCardsProps = Readonly<{
  applicationData: ApplicationDetail
}>

export default function ApplicationOverviewCards({
  applicationData,
}: Readonly<ApplicationOverviewCardsProps>) {
  const t = useTranslations('application')
  const applicationTier = applicationData.tier || APPLICATION_TIER[0]

  const status = [
    {
      id: 'accessTokenQuota',
      label: t('overview.access_token_quota'),
      value: applicationData.throttlingPolicy,
      icon: <Speedometer />,
    },
    {
      id: 'tier',
      label: t('overview.tier'),
      value: formatStatusLabel(applicationTier),
      icon: <AppWindow />,
    },
    {
      id: 'applicationOwner',
      label: t('overview.owner'),
      value: applicationData.owner,
      icon: <UserCircle />,
    },
    {
      id: 'workflowStatus',
      label: t('overview.workflow_status'),
      value: formatStatusLabel(applicationData.status),
      icon: <ShareNetwork />,
    },
  ] as const

  return (
    <div className="flex flex-col gap-6">
      <div className="text-title-lg-emphasize text-black-1">
        {t('detail.sections.overview')}
      </div>
      <div
        className={cn(
          'grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'
        )}
      >
        {status.map((item) => (
          <Card
            key={item.id}
            size="sm"
            className="rounded-xl shadow-none bg-grey-12 border-0 px-6!"
          >
            <CardContent className="flex flex-col gap-1">
              {item.icon && (
                <div className="flex size-6 items-center justify-start">
                  {item.icon}
                </div>
              )}
              <CardTitle className="text-body-helptext-emphasize text-grey-6">
                {item.label}
              </CardTitle>
              <div className="text-body-emphasize text-black-1">
                {item.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
