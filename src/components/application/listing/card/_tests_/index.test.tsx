
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ApplicationCard from '../index'
import { MOCK_APPLICATION_DETAIL } from '@/_tests_/mocks'

const mockPush = jest.fn()
jest.mock('@/i18n/navigation', () => ({ useRouter: () => ({ push: mockPush }) }))
jest.mock('next-intl', () => ({ useTranslations: () => (k: string) => k }))
const mockMutate = jest.fn()
const mockUseSubscribeApiMutation = jest.fn()
jest.mock('@/services/application/application.mutations', () => ({
  useSubscribeApiMutation: () => mockUseSubscribeApiMutation(),
}))

const sandboxApp = { ...MOCK_APPLICATION_DETAIL, tier: 'SANDBOX' as const }

describe('application/listing/card', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockMutate.mockClear()
    mockUseSubscribeApiMutation.mockReturnValue({ mutate: mockMutate, isPending: false })
  })

  it('render ApplicationCard', () => {
    render(
      <ApplicationCard
        application={sandboxApp as any}
        api_id="api-1"
        hasAnySubscribed={false}
        api_product_name="Test API"
      />
    )
    expect(screen.getByText(MOCK_APPLICATION_DETAIL.name)).toBeInTheDocument()
  })

  it('render test sandbox khi đã subscribe và click detail', async () => {
    render(
      <ApplicationCard
        application={
          { ...sandboxApp, registeredThisApi: true } as any
        }
        api_id="api-1"
        hasAnySubscribed={false}
        api_product_name="Test API"
      />
    )

    await userEvent.click(screen.getByText('btn.test_sandbox'))
    await userEvent.click(screen.getByText('btn.detail'))

    expect(screen.getByText('btn.test_sandbox')).toBeInTheDocument()
    expect(mockPush).toHaveBeenCalledTimes(2)
    expect(mockPush).toHaveBeenNthCalledWith(
      1,
      '/api-products/api-1/tryout?app_id=app-123',
    )
    expect(mockPush).toHaveBeenNthCalledWith(
      2,
      '/api-products/api-1/application/app-123?api_product_name=Test API',
    )
  })

  it('click subscribe khi chưa subscribe', async () => {
    render(
      <ApplicationCard
        application={{ ...sandboxApp, subscribedApiIds: [] } as any}
        api_id="api-1"
        hasAnySubscribed={false}
        api_product_name="Test API"
      />
    )

    await userEvent.click(screen.getByText('btn.subscribe'))
    await userEvent.click(screen.getByText('btn.continue'))

    expect(mockMutate).toHaveBeenCalledWith({
      applicationId: 'app-123',
      body: { apiId: 'api-1', throttlingPolicy: '10PerMin' },
    })
  })

  it('render loading text khi subscribe pending', () => {
    mockUseSubscribeApiMutation.mockReturnValue({ mutate: mockMutate, isPending: true })

    render(
      <ApplicationCard
        application={{ ...sandboxApp, subscribedApiIds: [] } as any}
        api_id="api-1"
        hasAnySubscribed={false}
        api_product_name="Test API"
      />
    )

    expect(screen.getByText('mess.subscribe.loading')).toBeInTheDocument()
  })
})