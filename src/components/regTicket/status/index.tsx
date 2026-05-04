'use client'

import { useRouter } from '@/i18n/navigation'
import FullPageLayout from '@/share/components/full-page/full-layout'
import { ToastSuccess } from '@/share/icons'
import { Button } from '@/share/ui/button'
import { Card, CardContent } from '@/share/ui/card'
import { ChevronLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function CertificateStatus() {
  const t = useTranslations('regTicket')
  const router = useRouter()

  return (
    <FullPageLayout>
      <div className="container mx-auto flex justify-center item-center">
        <div className="max-w-[500px] flex flex-col items-start gap-6">
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
          <div className="flex flex-1 flex-col justify-center">
            <Card
              size="xl"
              className="w-full min-w-[500px] rounded-2xl bg-white shadow-lg"
            >
              <CardContent className="flex flex-col gap-9">
                <div>
                  <h1 className="w-full text-left text-title-lg-emphasize text-black">
                    {t('create.status.title')}
                  </h1>
                </div>

                <div className="flex flex-col items-center gap-12">
                  <div className="flex flex-col items-center gap-6">
                    <div className="flex justify-center">
                      <ToastSuccess className="size-24 shrink-0" />
                    </div>
                    <p className="text-center text-body-body">
                      {t('create.status.description')}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    fullWidth
                    rounded
                    // className="w-full rounded-full px-6 h-10 text-body-helptext-emphasize"
                    onClick={() => router.push('/')}
                  >
                    {t('btn.compelete')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </FullPageLayout>
  )
}
