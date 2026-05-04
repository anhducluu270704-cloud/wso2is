'use client'

import {
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  Empty,
} from '@/share/ui/empty'
import { Button } from '@/share/ui/button'
import ErrorPageLayout from '@/share/components/full-page/error-layout'
import { useTranslations } from 'next-intl'
import { createContext, useContext } from 'react'
import { Error404 } from '@/share/icons'
import NextLink from 'next/link'

function DescriptionParagraph({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <p className="mt-4">{children}</p>
}

const ResetContext = createContext<(() => void) | null>(null)

function RetryButton({ children }: Readonly<{ children: React.ReactNode }>) {
  const reset = useContext(ResetContext)
  if (!reset) return <>{children}</>
  return (
    <button
      className="text-white underline underline-offset-2"
      onClick={reset}
      type="button"
    >
      {children}
    </button>
  )
}

function renderDescriptionP(chunks: React.ReactNode) {
  return <DescriptionParagraph>{chunks}</DescriptionParagraph>
}

function renderRetry(chunks: React.ReactNode) {
  return <RetryButton>{chunks}</RetryButton>
}

const ERROR_RICH_CONFIG = {
  p: renderDescriptionP,
  retry: renderRetry,
}

type Props = Readonly<{
  error: Error
  reset: () => void
}>

export default function ErrorPage({ error, reset }: Props) {
  const t = useTranslations('common')

  return (
    <ResetContext.Provider value={reset}>
      <ErrorPageLayout>
        <Empty>
          <EmptyHeader>
            <Error404 className="size-[144px]" />
          </EmptyHeader>
          <EmptyContent>
            <EmptyTitle>{t('error.title')}</EmptyTitle>
            <EmptyDescription>
              <div>{t.rich('error.description', ERROR_RICH_CONFIG)}</div>
            </EmptyDescription>
          </EmptyContent>
          <Button variant="default" size="sm" rounded asChild>
            <NextLink href="/">{t('btn.got_it')}</NextLink>
          </Button>
        </Empty>
      </ErrorPageLayout>
    </ResetContext.Provider>
  )
}
