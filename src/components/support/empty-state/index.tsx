'use client'

import { useTranslations } from 'next-intl'

type SupportEmptyStateProps = Readonly<{
  searchQuery: string
}>

export function SupportEmptyState({
  searchQuery,
}: Readonly<SupportEmptyStateProps>) {
  const t = useTranslations('support.empty')

  return (
    <div className="flex flex-col gap-8 pb-8">
      <p className="text-body-body text-black-1">
        {t('no_result_before')}
        {searchQuery}
        {t('no_result_after')}
      </p>
    </div>
  )
}
