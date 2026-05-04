
import React from 'react'
import { render, screen } from '@testing-library/react'
import ApplicationOverviewCards from '../index'

const mockApplicationData = {
  name: 'App',
  applicationId: 'app-1',
  tier: 'SANDBOX',
  throttlingPolicy: '10 per min',
  tier: 'SANDBOX',
  description: null,
  status: 'ACTIVE',
  groups: [],
  subscriptionCount: 0,
  attributes: {},
  owner: 'Owner Name',
  tokenType: 'JWT',
} as any

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('@/share/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" data-class={className}>
      {children}
    </div>
  ),
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <div>{children}</div>,
}))

jest.mock('@/share/icons', () => ({
  Speedometer: () => <span>SpeedIcon</span>,
  AppWindow: () => <span>AppIcon</span>,
  UserCircle: () => <span>UserIcon</span>,
  ShareNetwork: () => <span>ShareIcon</span>,
}))

describe('ApplicationOverviewCards', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders four overview cards with labels and values', () => {
    render(
      <ApplicationOverviewCards applicationData={mockApplicationData} />
    )

    // 4 cards rendered
    const cards = screen.getAllByTestId('card')
    expect(cards).toHaveLength(4)

    // labels (keys from translator)
    expect(
      screen.getByText('overview.access_token_quota')
    ).toBeInTheDocument()
    expect(screen.getByText('overview.tier')).toBeInTheDocument()
    expect(screen.getByText('overview.owner')).toBeInTheDocument()
    expect(screen.getByText('overview.workflow_status')).toBeInTheDocument()

    // values from application data
    expect(screen.getByText('10 per min')).toBeInTheDocument()
    expect(screen.getByText('Sandbox')).toBeInTheDocument()
    expect(screen.getByText('Owner Name')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()

    // container div has base grid classes
    const wrapper = cards[0].parentElement as HTMLElement
    expect(wrapper.className).toContain(
      'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'
    )
  })
})

