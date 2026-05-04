import React from 'react'
import { render, screen } from '@testing-library/react'

const mockNotFound = jest.fn(() => null)
const mockBack = jest.fn()

jest.mock('next/navigation', () => ({
  notFound: () => mockNotFound(),
  useRouter: () => ({ back: mockBack }),
}))

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}))

jest.mock('@/share/components/full-page/loading', () => ({
  __esModule: true,
  default: () => <div data-testid="loading" />,
}))

jest.mock('../form', () => ({
  __esModule: true,
  default: () => <div data-testid="reg-form" />,
}))

const mockUseGetScenarioCertificate = jest.fn()

jest.mock('@/services/scenario/scenario.query-options', () => ({
  useGetScenarioCertificate: (...a: unknown[]) =>
    mockUseGetScenarioCertificate(...a),
}))

import CreateRegTicketWrapper from '../index'

describe('CreateRegTicketWrapper', () => {
  beforeEach(() => {
    mockNotFound.mockClear()
    mockUseGetScenarioCertificate.mockReset()
  })

  it('LoadingPage khi đang fetch certificate', () => {
    mockUseGetScenarioCertificate.mockReturnValue({
      isLoading: true,
      isError: false,
      isSuccess: false,
    })
    render(
      <CreateRegTicketWrapper
        scenario_id="s"
        version_id="v"
        application_id="app"
        api_id="api"
      />,
    )
    expect(screen.getByTestId('loading')).toBeInTheDocument()
  })

  it('notFound khi lỗi', () => {
    mockUseGetScenarioCertificate.mockReturnValue({
      isLoading: false,
      isError: true,
      isSuccess: false,
    })
    render(
      <CreateRegTicketWrapper
        scenario_id="s"
        version_id="v"
        application_id="app"
        api_id="api"
      />,
    )
    expect(mockNotFound).toHaveBeenCalled()
  })

  it('notFound khi data null', () => {
    mockUseGetScenarioCertificate.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: { data: null },
    })
    render(
      <CreateRegTicketWrapper
        scenario_id="s"
        version_id="v"
        application_id="app"
        api_id="api"
      />,
    )
    expect(mockNotFound).toHaveBeenCalled()
  })

  it('render form khi có certificate', () => {
    mockUseGetScenarioCertificate.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: {
        data: {
          id: 'cid',
          certificateNumber: 'n',
          scenarioName: 'sn',
          apiName: 'an',
          apiId: 'api',
          applicationId: 'app',
          issueDate: 'd',
          status: 'ACTIVE',
        },
      },
    })
    render(
      <CreateRegTicketWrapper
        scenario_id="s"
        version_id="v"
        application_id="app"
        api_id="api"
      />,
    )
    expect(screen.getByTestId('reg-form')).toBeInTheDocument()
    expect(screen.getByText('create.header')).toBeInTheDocument()
  })
})
