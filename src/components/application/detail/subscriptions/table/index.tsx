'use client'

import { Pagination } from '@/models/api/common'
import { Subscription } from '@/services/application/application.schema'
import { TableView } from '@/share/components/table'
import { useAppTable } from '@/share/components/table/use-app-table'
import { DeleteIcon } from '@/share/icons'
import { Button } from '@/share/ui/button'
import { tableActionMeta } from '@/share/ui/table'
import { formatStatusLabel } from '@/util'
import { ColumnDef, createColumnHelper, type Row } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { useCallback, useMemo, useState } from 'react'

type ApplicationSubscriptionsTableProps = Readonly<{
  subscriptions: Subscription[]
  metadata?: Pagination
  onDeleteClick: (subscription: Subscription) => void
  tier: 'SANDBOX' | 'PRODUCTION'
}>

type SubscriptionTableDeleteCellProps = Readonly<{
  subscription: Subscription
  onDeleteClick: (subscription: Subscription) => void
  deleteAriaLabel: string
}>

function SubscriptionTableDeleteCell({
  subscription,
  onDeleteClick,
  deleteAriaLabel,
}: SubscriptionTableDeleteCellProps) {
  const handleClick = () => {
    onDeleteClick(subscription)
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={deleteAriaLabel}
      onClick={handleClick}
    >
      <DeleteIcon className="size-5 text-black-1" />
    </Button>
  )
}

function renderDeleteColumnCell(
  row: Row<Subscription>,
  onDeleteClick: (subscription: Subscription) => void,
  deleteAriaLabel: string
) {
  return (
    <SubscriptionTableDeleteCell
      subscription={row.original}
      onDeleteClick={onDeleteClick}
      deleteAriaLabel={deleteAriaLabel}
    />
  )
}

export default function ApplicationSubscriptionsTable({
  subscriptions,
  metadata,
  onDeleteClick,
  tier,
}: ApplicationSubscriptionsTableProps) {
  const t = useTranslations('application')
  const columnHelper = createColumnHelper<Subscription>()
  const [selectedPolicies, setSelectedPolicies] = useState<
    Record<string, string>
  >({})

  const defaultSelectedPolicies = useMemo(
    () =>
      Object.fromEntries(
        subscriptions.map((subscription) => [
          subscription.subscriptionId,
          subscription.requestedThrottlingPolicy ||
            subscription.throttlingPolicy,
        ])
      ),
    [subscriptions]
  )

  const handlePolicyChange = useCallback(
    (subscriptionId: string, policy: string) => {
      setSelectedPolicies((prev) => ({
        ...prev,
        [subscriptionId]: policy,
      }))
    },
    []
  )

  const planAriaLabel = t('detail.api_registration.table.plan')
  const deleteAriaLabel = t('detail.api_registration.table.delete')

  const columns = useMemo(
    () => [
      columnHelper.accessor('apiInfo.name', {
        header: t('detail.api_registration.table.api'),
        enableSorting: false,
      }),
      columnHelper.accessor('apiInfo.lifeCycleStatus', {
        header: t('detail.api_registration.table.api_status'),
        cell: ({ getValue }) => formatStatusLabel(getValue()),
        enableSorting: false,
        meta: 'min-w-[152px]!',
      }),
      columnHelper.accessor('throttlingPolicy', {
        header: t('detail.api_registration.table.plan'),
        cell: ({ getValue }) => formatStatusLabel(getValue()),
        enableSorting: false,
        meta: 'min-w-[154px]!',
      }),
      columnHelper.accessor('status', {
        header: t('detail.api_registration.table.subscription_status'),
        cell: ({ getValue }) => formatStatusLabel(getValue()),
        enableSorting: false,
        meta: 'min-w-[152px]! whitespace-nowrap!',
      }),
      columnHelper.display({
        id: 'action',
        header: t('detail.api_registration.table.action'),
        cell: ({ row }) =>
          renderDeleteColumnCell(row, onDeleteClick, deleteAriaLabel),
        enableSorting: false,
        meta: tableActionMeta,
      }),
    ],
    [
      columnHelper,
      defaultSelectedPolicies,
      deleteAriaLabel,
      handlePolicyChange,
      onDeleteClick,
      planAriaLabel,
      selectedPolicies,
      t,
      tier,
    ]
  )

  const table = useAppTable<Subscription>({
    data: subscriptions,
    columns: columns as ColumnDef<Subscription>[],
    metadata,
    initialColumnVisibility: {
      action: tier === 'SANDBOX',
    },
  })

  return (
    <TableView
      className="p-0!"
      table={table}
      header={true}
      emptyTitle={t('detail.api_registration.empty_title')}
      emptyDescription={t('detail.api_registration.empty_description')}
    />
  )
}
