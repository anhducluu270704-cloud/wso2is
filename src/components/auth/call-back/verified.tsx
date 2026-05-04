'use client'

import ErrorPageLayout from '@/share/components/full-page/error-layout'
import { VerifySuccess } from '@/share/icons'
import { useGetUrlLoginMutation } from '@/share/layout/end-user/header/hook'
import { Button } from '@/share/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/share/ui/empty'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'

const COUNTDOWN_SECONDS = 3

export default function VerifiedStatus() {
  const t = useTranslations('signup')
  const { mutate: loginMutate } = useGetUrlLoginMutation()
  const loginMutateRef = useRef(loginMutate)
  loginMutateRef.current = loginMutate
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS)

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timer)
          loginMutateRef.current()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const countdownLabel = t('callback.verified.countdown', { count: secondsLeft })

  return (
    <ErrorPageLayout>
      <Empty className="gap-4">
        <EmptyHeader>
          <VerifySuccess className="h-40 w-[227px] shrink-0" />
        </EmptyHeader>
        <EmptyContent className="max-w-md gap-2">
          <EmptyTitle>{t('callback.verified.title')}</EmptyTitle>
          <EmptyDescription>
            {t('callback.verified.redirectlead')}{' '}
            <span className="font-semibold text-foreground">{countdownLabel}</span>
            {t('callback.verified.redirecttrail')}
          </EmptyDescription>
        </EmptyContent>
        <Button
          type="button"
          variant="default"
          size="sm"
          className="min-w-[343px]"
          rounded
          onClick={() => loginMutate()}
        >
          {t('callback.verified.btn.login')}
        </Button>
      </Empty>
    </ErrorPageLayout>
  )
}
