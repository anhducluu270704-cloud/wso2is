
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type {
  ApplicationDetail,
  Subscription,
} from '@/services/application/application.schema'

import ApplicationSubscriptions from '../index'

function applicationDataStub(
  overrides: Partial<ApplicationDetail> = {},
): ApplicationDetail {
  return {
    name: 'My App',
    applicationId: 'app-1',
    tier: 'SANDBOX',
    throttlingPolicy: '10PerMin',
    description: null,
    status: 'APPROVED',
    groups: [],
    subscriptionCount: 1,
    attributes: {},
    owner: 'owner',
    tokenType: 'JWT',
    ...overrides,
  }
}

const mockUseGetAllSubscriptions = jest.fn()
const mockMutate = jest.fn()

const deleteMutation = {
  isPending: false,
  mutate: (...args: unknown[]) => mockMutate(...args),
}

jest.mock('../table', () => ({
  __esModule: true,
  default: ({
    subscriptions,
    onDeleteClick,
  }: {
    subscriptions: Subscription[]
    onDeleteClick: (s: Subscription) => void
  }) => (
    <div data-testid="subs-table-mock">
      {subscriptions.map((s) => (
        <button
          key={s.subscriptionId}
          type="button"
          onClick={() => onDeleteClick(s)}
        >
          {`delete-${s.subscriptionId}`}
        </button>
      ))}
    </div>
  ),
}))

jest.mock('@/services/application/application.query-options', () => ({
  useGetAllSubscriptions: (id: string) => mockUseGetAllSubscriptions(id),
}))

jest.mock('@/services/application/application.mutations', () => ({
  useDeleteSubscriptionMutation: () => deleteMutation,
}))

jest.mock('@/share/ui/spinner', () => ({
  SpinnerCustom: ({ className }: { className?: string }) => (
    <div data-testid="spinner" className={className} />
  ),
}))

jest.mock('@/share/components/modal/confirm', () => ({
  __esModule: true,
  default: ({
    open,
    onConfirm,
    onOpenChange,
    title,
    description,
  }: {
    open: boolean
    onConfirm: () => void
    onOpenChange: (v: boolean) => void
    title: React.ReactNode
    description: React.ReactNode
  }) =>
    open ? (
      <div data-testid="confirm-modal">
        <div data-testid="confirm-title">{title}</div>
        <div>{description}</div>
        <button type="button" onClick={() => onOpenChange(false)}>
          close
        </button>
        <button type="button" data-testid="confirm-delete" onClick={onConfirm}>
          confirm-delete
        </button>
      </div>
    ) : null,
}))

jest.mock('@/share/icons', () => ({
  DeleteDocument: () => <span>DelDoc</span>,
}))

jest.mock('next-intl', () => ({
  useTranslations: () =>
    Object.assign((k: string) => k, {
      rich: (
        key: string,
        values: Record<string, unknown> & {
          api_name_value?: string
          app_name_value?: string
        },
      ) => (
        <span data-testid="rich-title">
          {key}:{values.api_name_value}:{values.app_name_value}
        </span>
      ),
    }),
}))

function subscriptionStub(overrides: Partial<Subscription> = {}): Subscription {
  return {
    subscriptionId: 'sub-1',
    applicationId: 'app-1',
    apiId: 'api-x',
    apiInfo: {
      id: 'api-x',
      name: 'Payments API',
      displayName: 'Payments Display',
      description: null,
      context: '/pay',
      version: '1',
      type: 'retail',
      createdTime: null,
      provider: 'TCB',
      lifeCycleStatus: 'PUBLISHED',
      thumbnailUri: null,
      avgRating: '0',
      throttlingPolicies: ['10PerMin'],
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
    },
    applicationInfo: {
      applicationId: 'app-1',
      name: 'My App',
      throttlingPolicy: '10PerMin',
      status: 'APPROVED',
      groups: [],
      subscriptionCount: 1,
      attributes: {},
      owner: 'o',
      tokenType: 'JWT',
    },
    throttlingPolicy: '10PerMin',
    requestedThrottlingPolicy: '10PerMin',
    status: 'ACTIVE',
    redirectionParams: null,
    ...overrides,
  }
}

describe('application/detail/subscriptions', () => {
  beforeEach(() => {
    mockUseGetAllSubscriptions.mockReset()
    mockMutate.mockReset()
    deleteMutation.isPending = false
    mockUseGetAllSubscriptions.mockReturnValue({
      data: {
        data: {
          list: [subscriptionStub()],
          pagination: {
            total: 1,
            offset: 0,
            limit: 10,
            next: '',
            previous: '',
          },
        },
      },
      isLoading: false,
    })
  })

  it('loading: render SpinnerCustom', () => {
    mockUseGetAllSubscriptions.mockReturnValue({
      data: undefined,
      isLoading: true,
    })

    render(
      <ApplicationSubscriptions
        applicationData={applicationDataStub({
          applicationId: 'a1',
          name: 'App',
        })}
      />,
    )

    expect(screen.getByTestId('spinner')).toBeInTheDocument()
    expect(screen.queryByTestId('subs-table-mock')).not.toBeInTheDocument()
  })

  it('đã load: heading, table mock và truyền useGetAllSubscriptions(applicationId)', () => {
    render(
      <ApplicationSubscriptions
        applicationData={applicationDataStub({
          applicationId: 'app-z',
          name: 'N1',
        })}
      />,
    )

    expect(
      screen.getByRole('heading', {
        name: 'detail.sections.api_registration',
      }),
    ).toBeInTheDocument()
    expect(screen.getByTestId('subs-table-mock')).toBeInTheDocument()
    expect(screen.getByText('delete-sub-1')).toBeInTheDocument()
    expect(mockUseGetAllSubscriptions).toHaveBeenCalledWith('app-z')
  })

  it('mở confirm và gọi mutate; onSuccess đóng modal', async () => {
    const user = userEvent.setup()
    mockMutate.mockImplementation((_payload: unknown, opts: { onSuccess?: () => void }) => {
      opts.onSuccess?.()
    })

    render(
      <ApplicationSubscriptions
        applicationData={applicationDataStub({
          applicationId: 'app-1',
          name: 'App One',
        })}
      />,
    )

    await user.click(screen.getByText('delete-sub-1'))

    expect(screen.getByTestId('confirm-modal')).toBeInTheDocument()
    expect(screen.getByTestId('rich-title')).toHaveTextContent(
      'detail.api_registration.confirm_delete.title:Payments API:App One',
    )

    await user.click(screen.getByTestId('confirm-delete'))

    expect(mockMutate).toHaveBeenCalledWith(
      { applicationId: 'app-1', subscriptionId: 'sub-1' },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    )
    expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument()
  })

  it('khi isPending: onConfirm không gọi mutate thêm', async () => {
    const user = userEvent.setup()
    deleteMutation.isPending = true

    render(
      <ApplicationSubscriptions applicationData={applicationDataStub()} />,
    )

    await user.click(screen.getByText('delete-sub-1'))
    await user.click(screen.getByTestId('confirm-delete'))

    expect(mockMutate).not.toHaveBeenCalled()
  })

  it('đóng confirm (onOpenChange false) reset selection và có thể mở lại', async () => {
    const user = userEvent.setup()

    render(
      <ApplicationSubscriptions applicationData={applicationDataStub()} />,
    )

    await user.click(screen.getByText('delete-sub-1'))
    expect(screen.getByTestId('confirm-modal')).toBeInTheDocument()

    await user.click(screen.getByText('close'))

    expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument()

    await user.click(screen.getByText('delete-sub-1'))
    expect(screen.getByTestId('confirm-modal')).toBeInTheDocument()
  })
})
