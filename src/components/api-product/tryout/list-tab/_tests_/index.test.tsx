import React from 'react'
import { render, screen } from '@testing-library/react'

const mockReplace = jest.fn()
const mockPush = jest.fn()

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  usePathname: () => '/vi/x/tryout',
}))

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(''),
}))

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}))

jest.mock('../../detail', () => ({
  __esModule: true,
  default: () => <div data-testid="tryout-detail-stub" />,
}))

jest.mock('../../certificate', () => ({
  __esModule: true,
  default: () => <div data-testid="tryout-cert-stub" />,
}))

jest.mock('@/services/scenario/scenario.query-options', () => ({
  useGetScenarioCertificate: () => ({
    data: { message: 'OK', code: '200', data: null },
    isLoading: false,
    isError: false,
    isSuccess: true,
  }),
}))

jest.mock('@/share/icons', () => ({
  CaseSuccess: () => <span data-testid="case-ok" />,
  Lock: () => <span data-testid="lock-icon" />,
}))

jest.mock('@/share/ui/accordion', () => ({
  Accordion: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="accordion">{children}</div>
  ),
  AccordionItem: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AccordionTrigger: ({ children }: { children: React.ReactNode }) => (
    <button type="button">{children}</button>
  ),
  AccordionContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

jest.mock('@/share/ui/tabs', () => ({
  Tabs: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tabs-root">{children}</div>
  ),
  TabsList: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsTrigger: ({
    children,
    value,
  }: {
    children: React.ReactNode
    value: string
  }) => (
    <button type="button" data-tvalue={value}>
      {children}
    </button>
  ),
  TabsContent: ({
    children,
    value,
  }: {
    children: React.ReactNode
    value: string
  }) => (
    <div data-tabs-content={value}>{children}</div>
  ),
}))

import TryoutListTab from '../index'

const scenarioDetailWrapped = {
  message: 'OK',
  code: '200',
  data: {
    id: 's1',
    scenario_key: 'k',
    scenario_name: 'n',
    active_version_id: 'v1',
    active_version: 1,
    api_id: 'api-1',
    api_name: 'API',
  },
}

const resourceGroups = [
  {
    resource_key: 'rk',
    path: '/pets',
    http_method: 'GET',
    case_count: 1,
    cases: [
      {
        stepName: 'step',
        case_id: 'case-a',
        case_name: 'Case A',
        step_order: 1,
        expected_status: 200,
        has_request_body: false,
        openapi_url: 'http://localhost/oas',
      },
    ],
  },
]

describe('TryoutListTab', () => {
  beforeEach(() => {
    mockReplace.mockClear()
    mockPush.mockClear()
  })

  it('render nhóm case và tab certificate', () => {
    render(
      <TryoutListTab
        resourceGroups={resourceGroups}
        scenarioDetail={scenarioDetailWrapped}
        api_id="api-1"
        app_id="app-1"
        case_id="case-a"
        scenarioStatusData={[
          { caseId: 'case-a', caseName: 'Case A', status: 'PASS' as const },
        ]}
      />,
    )

    expect(screen.getByText('/pets')).toBeInTheDocument()
    expect(screen.getByText('Case A')).toBeInTheDocument()
    expect(screen.getByTestId('tryout-detail-stub')).toBeInTheDocument()
    expect(screen.getByText('tryout.tabs.certificate')).toBeInTheDocument()
  })
})
