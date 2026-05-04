'use client'

import ApplicationForm from '@/components/application/create/form'
import { useRouter } from '@/i18n/navigation'
import FullPageLayout from '@/share/components/full-page/full-layout'
import { Button } from '@/share/ui/button'
import { Card, CardContent } from '@/share/ui/card'
import { ChevronLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function CreateApplicationWrapper({
  callback,
}: Readonly<{ callback: string }>) {
  const t = useTranslations('application')
  const router = useRouter()

  return (
    <FullPageLayout>
      <div className="flex flex-col gap-6 container mx-auto">
        <Button
          variant="secondary"
          size="sm"
          className="p-0 h-auto"
          rounded
          linked
          onClick={() => router.back()}
        >
          <ChevronLeft className="size-5 !text-black" />
          {t('btn.default_back')}
        </Button>

        <div className="text-title-lg-emphasize text-black">
          {t('create.header')}
        </div>

        <Card
          size="xl"
          className="rounded-2xl !px-4 !py-6 sm:!px-8 sm:!py-8 lg:!px-16 lg:!py-8"
        >
          <CardContent>
            <ApplicationForm callback={callback} />
          </CardContent>
        </Card>
      </div>
    </FullPageLayout>
  )
}
