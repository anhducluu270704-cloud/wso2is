'use client'

import ErrorPageLayout from '@/share/components/full-page/error-layout'
import { useRouter } from '@/i18n/navigation'
import { EndTime } from '@/share/icons'
import { Button } from '@/share/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/share/ui/empty'
import { useTranslations } from 'next-intl'

export default function ExpiredStatus() {
  const t = useTranslations('signup')
  const router = useRouter()

  return (
    <ErrorPageLayout>
      <Empty className="gap-4">
        <EmptyHeader>
          <EndTime className="size-[144px] shrink-0" />
        </EmptyHeader>
        <EmptyContent className="max-w-md gap-2">
          <EmptyTitle>{t('callback.expired.title')}</EmptyTitle>
          <EmptyDescription>{t('callback.expired.description')}</EmptyDescription>
        </EmptyContent>
        <Button
          type="button"
          variant="default"
          size="sm"
          className="min-w-[343px]"
          rounded
          onClick={() => router.push('/signup')}
        >
          {t('callback.expired.btn.signup')}
        </Button>
      </Empty>
    </ErrorPageLayout>
  )
}
