'use client'

import LoadingPage from '@/share/components/full-page/loading'
import { useRouter } from '@/i18n/navigation'
import { ToastSuccess } from '@/share/icons'
import { useGetUrlLoginMutation } from '@/share/layout/end-user/header/hook'
import { Button } from '@/share/ui/button'
import { Card, CardContent } from '@/share/ui/card'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { useParseToken } from './hook'

export default function SignUpStatusWrapper({
  token,
}: Readonly<{ token: string }>) {
  const router = useRouter()
  const { data, isLoading, isSuccess, isError } = useParseToken(token)

  useEffect(() => {
    if (isLoading) return
    if (isError) return router.replace('/signup')
    const showSuccess = isSuccess && data?.data?.status === 'PENDING'
    if (showSuccess) return
    router.replace('/signup')
  }, [isLoading, isSuccess, data, router, isError])

  if (isLoading) {
    return <LoadingPage />
  }

  if (isSuccess && data?.data?.status === 'PENDING') {
    return <SignUpStatus />
  }

  return null
}

function SignUpStatus() {
  const t = useTranslations('signup')
  const mutate = useGetUrlLoginMutation()

  return (
    <div className="flex flex-1 flex-col justify-center">
      <Card size="xl" className="w-full max-w-[500px] rounded-2xl bg-white">
        <CardContent className="flex flex-col gap-9">
          <div>
            <h1 className="w-full text-left text-title-lg-emphasize text-black">
              {t('status.title')}
            </h1>
          </div>

          <div className="flex flex-col items-center gap-12">
            <div className="flex flex-col items-center gap-6">
              <div className="flex justify-center">
                <ToastSuccess className="size-24 shrink-0" />
              </div>
              <p className="text-center text-body-helptext-emphasize text-base text-black">
                {t('status.description')}
              </p>
            </div>

            <Button
              type="button"
              variant="default"
              size="lg"
              className="w-full rounded-full px-6 h-10 text-body-helptext-emphasize"
              onClick={() => mutate.mutate()}
            >
              {t('status.button')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
