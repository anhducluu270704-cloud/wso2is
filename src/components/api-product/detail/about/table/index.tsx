'use client'

import { Operation } from '@/services/api-product/apiProduct.schema'
import { TableView } from '@/share/components/table'
import { useAppTable } from '@/share/components/table/use-app-table'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'

type ApiResourceTableProps = Readonly<{
  resources?: Operation[]
}>

export default function ApiResourceTable({
  resources = [],
}: Readonly<ApiResourceTableProps>) {
  const t = useTranslations('api_product')
  const columnHelper = createColumnHelper<Operation>()

  const columns = [
    columnHelper.accessor('nameApi', {
      header: t('resource_table.name'),
      enableSorting: false,
      meta: 'max-w-[200px]!',
    }),
    columnHelper.accessor('scope', {
      header: t('resource_table.scope'),
      enableSorting: false,
      meta: 'min-w-[190px]!',
    }),
    columnHelper.accessor('verb', {
      header: t('resource_table.verb'),
      enableSorting: false,
      meta: 'min-w-[112px]!',
    }),
    columnHelper.accessor('rateLimit', {
      header: t('resource_table.business_plan'),
      enableSorting: false,
      meta: 'min-w-[154px]! [&>span]:whitespace-break-words!',
    }),
  ]

  const table = useAppTable<Operation>({
    data: resources,
    columns: columns as ColumnDef<Operation>[],
  })

  return <TableView className="p-0!" table={table} header={true} />
}
