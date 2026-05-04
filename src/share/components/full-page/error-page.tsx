import NextLink from 'next/link'
import { Error404 } from '@/share/icons'
import { Button } from '@/share/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/share/ui/empty'
import ErrorPageLayout from './error-layout'
import { useTranslations } from 'next-intl'

type ErrorPageProps = Readonly<{
  message?: string
  code?: string
  defaultCode: string
}>

export default function ErrorPage({
  message,
  code,
  defaultCode,
}: ErrorPageProps) {
  const t = useTranslations('common')

  return (
    <ErrorPageLayout>
      <Empty>
        <EmptyHeader>
          <Error404 className="size-[144px]" />
        </EmptyHeader>
        <EmptyContent>
          <EmptyTitle>{t('error.title')}</EmptyTitle>
          <EmptyDescription>{message ?? t('error.description')}</EmptyDescription>
          <EmptyDescription className="text-grey-6">
            {t('error.code')}: {code ?? defaultCode}
          </EmptyDescription>
        </EmptyContent>
        <Button variant="default" size="sm" rounded asChild>
          <NextLink href="/">{t('btn.got_it')}</NextLink>
        </Button>
      </Empty>
    </ErrorPageLayout>
  )
}
