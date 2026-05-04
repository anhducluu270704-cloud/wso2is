
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Subscription } from '@/services/application/application.schema'

import ApplicationSubscriptionsTable from '../index'

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}))

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}))

jest.mock('@/share/icons', () => ({
  DeleteIcon: () => <span data-testid="delete-icon" />,
}))

jest.mock('@/share/ui/button', () => ({
  Button: ({
    children,
    onClick,
    'aria-label': ariaLabel,
  }: {
    children: React.ReactNode
    onClick?: () => void
    'aria-label'?: string
  }) => (
    <button type="button" aria-label={ariaLabel} onClick={onClick}>
      {children}
    </button>
  ),
}))

jest.mock('@/share/components/table', () => {
  const { flexRender: fr } = require('@tanstack/react-table')
  return {
    TableView: ({ table }: { table: { getRowModel: () => { rows: any[] } } }) => (
      <div data-testid="table-view">
        {table.getRowModel().rows.map((row: any) => (
          <div key={row.id} data-testid={`row-${row.id}`}>
            {row.getVisibleCells().map((cell: any) => (
              <div key={cell.id} data-column={cell.column.id}>
                {cell.column.columnDef.cell
                  ? fr(cell.column.columnDef.cell, cell.getContext())
                  : String(cell.getValue() ?? '')}
              </div>
            ))}
          </div>
        ))}
      </div>
    ),
  }
})

function makeSub(
  id: string,
  apiOverrides: Partial<Subscription['apiInfo']> = {},
  subOverrides: Partial<Subscription> = {},
): Subscription {
  return {
    subscriptionId: id,
    applicationId: 'app-1',
    apiId: `api-${id}`,
    apiInfo: {
      id: `api-${id}`,
      name: `Name ${id}`,
      displayName: null,
      description: null,
      context: '/c',
      version: '1',
      type: 'retail',
      createdTime: null,
      provider: 'p',
      lifeCycleStatus: 'CREATED_STATUS',
      thumbnailUri: null,
      avgRating: '0',
      throttlingPolicies: ['Gold', 'Silver'],
      advertiseInfo: {
        advertised: false,
        apiExternalProductionEndpoint: null,
        apiExternalSandboxEndpoint: null,
        originalDevPortalUrl: null,
        apiOwner: null,
        vendor: 'v',
      },
      businessInformation: {
        businessOwner: null,
        businessOwnerEmail: null,
        technicalOwner: null,
        technicalOwnerEmail: null,
      },
      isSubscriptionAvailable: true,
      monetizationLabel: '',
      gatewayType: null,
      gatewayVendor: null,
      additionalProperties: [],
      monetizedInfo: null,
      egress: false,
      subtype: 's',
      ...apiOverrides,
    },
    applicationInfo: {
      applicationId: 'app-1',
      name: 'App',
      throttlingPolicy: 'Gold',
      status: 'APPROVED',
      groups: [],
      subscriptionCount: 0,
      attributes: {},
      owner: 'o',
      tokenType: 'JWT',
    },
    throttlingPolicy: 'Gold',
    requestedThrottlingPolicy: 'Gold',
    status: 'UNDER_REVIEW',
    redirectionParams: null,
    ...subOverrides,
  }
}

describe('application/detail/subscriptions/table', () => {
  it('hiển thị tên API theo apiInfo.name và format status', () => {
    const subA = makeSub('a', {
      displayName: 'Shown',
      lifeCycleStatus: 'PUBLISHED_OK',
    })
    const subB = makeSub('b', { displayName: null, name: 'OnlyName' })
    const subC = makeSub('c', { displayName: null })
    subC.apiId = 'api-fallback-id'
    ;(subC.apiInfo as { name?: string }).name = undefined

    render(
      <ApplicationSubscriptionsTable
        subscriptions={[subA, subB, subC]}
        onDeleteClick={jest.fn()}
        tier="SANDBOX"
      />,
    )

    expect(screen.getByText('Name a')).toBeInTheDocument()
    expect(screen.getByText('OnlyName')).toBeInTheDocument()
    expect(screen.getByTestId('row-2')).toBeInTheDocument()
    expect(screen.getByText('Published Ok')).toBeInTheDocument()
    expect(screen.getAllByText('Under Review').length).toBeGreaterThanOrEqual(1)
  })

  it('hiển thị plan từ throttlingPolicy (read-only)', () => {
    const sub = makeSub('z', { throttlingPolicies: ['Gold'] }, {
      requestedThrottlingPolicy: '',
      throttlingPolicy: 'Silver',
    })

    render(
      <ApplicationSubscriptionsTable
        subscriptions={[sub]}
        onDeleteClick={jest.fn()}
        tier="SANDBOX"
      />,
    )

    expect(screen.getByText('Silver')).toBeInTheDocument()
  })

  it('delete gọi onDeleteClick', async () => {
    const user = userEvent.setup()
    const onDelete = jest.fn()
    const sub = makeSub('d')

    render(
      <ApplicationSubscriptionsTable
        subscriptions={[sub]}
        onDeleteClick={onDelete}
        tier="SANDBOX"
      />,
    )

    expect(screen.getByText('Gold')).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', {
        name: 'detail.api_registration.table.delete',
      }),
    )

    expect(onDelete).toHaveBeenCalledWith(
      expect.objectContaining({ subscriptionId: 'd' }),
    )
  })

  it('render với metadata (pagination)', () => {
    render(
      <ApplicationSubscriptionsTable
        subscriptions={[makeSub('e')]}
        metadata={{
          total: 20,
          offset: 10,
          limit: 10,
          next: '',
          previous: '',
        }}
        onDeleteClick={jest.fn()}
        tier="SANDBOX"
      />,
    )

    expect(screen.getByTestId('table-view')).toBeInTheDocument()
  })

  it('ẩn cột action (delete) khi tier PRODUCTION', () => {
    render(
      <ApplicationSubscriptionsTable
        subscriptions={[makeSub('p')]}
        onDeleteClick={jest.fn()}
        tier="PRODUCTION"
      />,
    )

    expect(
      screen.queryByRole('button', {
        name: 'detail.api_registration.table.delete',
      }),
    ).not.toBeInTheDocument()
  })
})
