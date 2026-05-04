'use client'

import { Button } from '@/share/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { notFound, useRouter } from 'next/navigation'
import RegTicketForm from './form'
import { useGetScenarioCertificate } from '@/services/scenario/scenario.query-options'
import LoadingPage from '@/share/components/full-page/loading'
import FullPageLayout from '@/share/components/full-page/full-layout'

export default function CreateRegTicketWrapper({
  scenario_id,
  version_id,
  application_id,
  api_id,
}: Readonly<{
  scenario_id: string
  version_id: string
  application_id: string
  api_id: string
}>) {
  const router = useRouter()
  const t = useTranslations('regTicket')
  const {
    data: scenarioCertificate,
    isLoading: isLoadingScenarioCertificate,
    isError: isErrorScenarioCertificate,
    isSuccess: isSuccessScenarioCertificate,
  } = useGetScenarioCertificate(application_id, scenario_id, version_id, api_id)

  if (isLoadingScenarioCertificate) return <LoadingPage />
  if (isErrorScenarioCertificate) return notFound()
  if (!isSuccessScenarioCertificate) return null

  const certificateDetail = scenarioCertificate.data
  if (certificateDetail == null) return notFound()

  return (
    <FullPageLayout>
      <div className="container mx-auto flex flex-col gap-6">
        <Button
          variant="secondary"
          size="sm"
          className="font-normal!"
          rounded
          linked
          onClick={() => router.back()}
        >
          <ChevronLeft className="size-5 text-black!" />
          {t('btn.back')}
        </Button>

        <div className="text-headline-lg-mobile text-black">
          {t('create.header')}
        </div>
        <RegTicketForm scenarioCertificate={certificateDetail} />
      </div>
    </FullPageLayout>
  )
}
