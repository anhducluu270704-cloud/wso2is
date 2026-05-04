
import React from 'react'
import { render, screen } from '@testing-library/react'
import OverviewSection from '../index'

const mockOverviewCards = jest.fn()
const mockViewToken = jest.fn()

const mockApplicationData = {
  name: 'App',
  applicationId: 'app-123',
  throttlingPolicy: '10PerMin',
  description: null,
  status: 'APPROVED',
  groups: [],
  subscriptionCount: 0,
  attributes: {},
  owner: 'owner',
  tokenType: 'JWT',
  subscriptionScopes: [{ key: 'scope-key', name: 'scope-name', description: '', role: [] }],
} as any

jest.mock('../card', () => ({
  __esModule: true,
  default: (props: { applicationData: unknown }) => {
    mockOverviewCards(props)
    return (
      <div data-testid="overview-cards">
        cards:{(props.applicationData as any)?.applicationId}
      </div>
    )
  },
}))

jest.mock('../view-token', () => ({
  __esModule: true,
  default: () => {
    mockViewToken()
    return <div data-testid="view-token">ViewToken</div>
  },
}))

describe('OverviewSection', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders overview cards and token section with applicationData', () => {
    render(<OverviewSection applicationData={mockApplicationData} />)

    expect(screen.getByTestId('overview-cards')).toHaveTextContent(
      'cards:app-123'
    )
    expect(screen.getByTestId('view-token')).toHaveTextContent('ViewToken')

    expect(mockOverviewCards).toHaveBeenCalledWith({
      applicationData: mockApplicationData,
    })
    expect(mockOverviewCards).toHaveBeenCalledTimes(1)
    expect(mockViewToken).toHaveBeenCalledTimes(1)
  })
})

