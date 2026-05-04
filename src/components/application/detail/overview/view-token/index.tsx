'use client'

import { SubscriptionScopes } from '@/services/application/application.schema'
import { TableView } from '@/share/components/table'
import { useAppTable } from '@/share/components/table/use-app-table'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'

export default function ViewToken({
  scopes,
}: {
  scopes: { scope: string; value: string }[]
}) {
  const t = useTranslations('application')

  const columnHelper = createColumnHelper<{ scope: string; value: string }>()

  const columns = [
    columnHelper.accessor('scope', {
      meta: 'w-[185px]',
      header: t('keys.view_token_scope'),
    }),
    columnHelper.accessor('value', {
      meta: 'text-start!',
    }),
  ]
  const table = useAppTable<{ scope: string; value: string }>({
    data: scopes,
    columns: columns as ColumnDef<{ scope: string; value: string }>[],
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-title-md text-black-1">
          {t('keys.view_token_title')}
        </h2>
        <p className="text-body-body text-grey-5">
          {t('keys.view_token_description')}
        </p>
      </div>

      <TableView table={table} className="p-0!" />
    </div>
  )
}
