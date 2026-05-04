import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => null),
  usePathname: jest.fn(() => '/vi/api-products/api-1/tryout'),
}))

jest.mock('@/i18n/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('next-intl', () => ({
  useTranslations:
    () => (key: string, values?: { name?: string }) =>
      values?.name ? `${key} ${values.name}` : key,
}))

jest.mock('@/services/scenario/scenario.query-options', () => ({
  useGetDetailScenario: jest.fn(),
  useGetScenarioResource: jest.fn(),
  useGetScenarioStatus: jest.fn(),
}))

jest.mock('../list-tab', () => ({
  __esModule: true,
  default: () => <div data-testid="tryout-list-tab" />,
}))

jest.mock('@/share/components/full-page/loading', () => ({
  __esModule: true,
  default: () => <div data-testid="full-loading" />,
}))

jest.mock('@/share/icons', () => ({
  AlertInfo: () => <span data-testid="alert-info-icon" />,
}))

import { notFound, usePathname } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'
import ApiProductTryouWrapper from '../index'

const scenarioQuery = jest.requireMock(
  '@/services/scenario/scenario.query-options',
) as {
  useGetDetailScenario: jest.Mock
  useGetScenarioResource: jest.Mock
  useGetScenarioStatus: jest.Mock
}

const mockNotFound = notFound as jest.Mock
const mockUsePathname = usePathname as jest.Mock
const mockUseRouter = useRouter as jest.Mock

const scenarioDetail = {
  id: 's1',
  scenario_key: 'k',
  scenario_name: 'n',
  active_version_id: 'v1',
  active_version: 1,
  api_id: 'api-1',
  api_name: 'My API',
}

const resourceData = {
  scenario_id: 's1',
  scenario_key: 'k',
  scenario_name: 'n',
  version_id: 'v1',
  version_number: 1,
  api_id: 'api-1',
  api_name: 'My API',
  total_cases: 0,
  resource_groups: [],
}

const statusResponse = {
  message: 'OK',
  code: '200',
  data: [] as { caseId: string; caseName: string; status: 'PASS' }[],
}

function loadingReturn() {
  return {
    isLoading: true,
    isError: false,
    isSuccess: false,
    data: undefined,
  }
}

function successDetail() {
  return {
    isLoading: false,
    isError: false,
    isSuccess: true,
    data: {
      message: 'OK',
      code: '200',
      data: scenarioDetail,
    },
  }
}

function successResource() {
  return {
    isLoading: false,
    isError: false,
    isSuccess: true,
    data: {
      message: 'OK',
      code: '200',
      data: resourceData,
    },
  }
}

function successStatus() {
  return {
    isLoading: false,
    isError: false,
    isSuccess: true,
    data: statusResponse,
  }
}

function setupSuccessView() {
  scenarioQuery.useGetDetailScenario.mockReturnValue(successDetail())
  scenarioQuery.useGetScenarioResource.mockReturnValue(successResource())
  scenarioQuery.useGetScenarioStatus.mockReturnValue(successStatus())
}

describe('ApiProductTryouWrapper', () => {
  let mockPush: jest.Mock

  beforeEach(() => {
    mockPush = jest.fn()
    mockUseRouter.mockReturnValue({ push: mockPush })
    mockUsePathname.mockReturnValue('/vi/api-products/api-1/tryout')
    mockNotFound.mockClear()
    scenarioQuery.useGetDetailScenario.mockReset()
    scenarioQuery.useGetScenarioResource.mockReset()
    scenarioQuery.useGetScenarioStatus.mockReset()
  })

  it('hiển thị LoadingPage khi đang tải scenario', () => {
    scenarioQuery.useGetDetailScenario.mockReturnValue(loadingReturn())
    scenarioQuery.useGetScenarioResource.mockReturnValue(loadingReturn())
    scenarioQuery.useGetScenarioStatus.mockReturnValue(loadingReturn())

    render(
      <ApiProductTryouWrapper api_id="api-1" app_id="app-1" case_id="c1" />,
    )
    expect(screen.getByTestId('full-loading')).toBeInTheDocument()
  })

  it('hiển thị LoadingPage khi detail xong nhưng resource đang load', () => {
    scenarioQuery.useGetDetailScenario.mockReturnValue(successDetail())
    scenarioQuery.useGetScenarioResource.mockReturnValue(loadingReturn())
    scenarioQuery.useGetScenarioStatus.mockReturnValue(successStatus())

    render(
      <ApiProductTryouWrapper api_id="api-1" app_id="app-1" case_id="c1" />,
    )
    expect(screen.getByTestId('full-loading')).toBeInTheDocument()
  })

  it('calls notFound when scenario detail fails', () => {
    scenarioQuery.useGetDetailScenario.mockReturnValue({
      isLoading: false,
      isError: true,
      isSuccess: false,
      data: undefined,
    })
    scenarioQuery.useGetScenarioResource.mockReturnValue(successResource())
    scenarioQuery.useGetScenarioStatus.mockReturnValue(successStatus())

    render(
      <ApiProductTryouWrapper api_id="api-1" app_id="app-1" case_id="c1" />,
    )
    expect(mockNotFound).toHaveBeenCalled()
  })

  it('calls notFound when scenario resource fails', () => {
    setupSuccessView()
    scenarioQuery.useGetScenarioResource.mockReturnValue({
      isLoading: false,
      isError: true,
      isSuccess: false,
      data: undefined,
    })

    render(
      <ApiProductTryouWrapper api_id="api-1" app_id="app-1" case_id="c1" />,
    )
    expect(mockNotFound).toHaveBeenCalled()
  })

  it('render tryout header và list tab khi thành công', () => {
    setupSuccessView()

    render(
      <ApiProductTryouWrapper api_id="api-1" app_id="app-1" case_id="c1" />,
    )

    expect(screen.getByText('tryout.header')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /btn\.back My API/ }),
    ).toBeInTheDocument()
    expect(screen.getByTestId('tryout-list-tab')).toBeInTheDocument()
  })

  it('Back button strips /tryout and locale then router.push', async () => {
    setupSuccessView()
    mockUsePathname.mockReturnValue(
      '/vi/api-products/api-1/application/app-99/tryout',
    )

    render(
      <ApiProductTryouWrapper api_id="api-1" app_id="app-1" case_id="c1" />,
    )

    await userEvent.click(
      screen.getByRole('button', { name: /btn\.back My API/ }),
    )
    expect(mockPush).toHaveBeenCalledWith(
      '/api-products/api-1/application/app-99',
    )
  })

  it('Back button uses /api-products when stripped path is empty', async () => {
    setupSuccessView()
    mockUsePathname.mockReturnValue('/tryout')

    render(
      <ApiProductTryouWrapper api_id="api-1" app_id="app-1" case_id="c1" />,
    )

    await userEvent.click(
      screen.getByRole('button', { name: /btn\.back My API/ }),
    )
    expect(mockPush).toHaveBeenCalledWith('/api-products')
  })

  it('nút support trong info box gọi router.push', async () => {
    setupSuccessView()

    render(
      <ApiProductTryouWrapper api_id="api-1" app_id="app-1" case_id="c1" />,
    )

    await userEvent.click(screen.getByRole('button', { name: 'tryout.info.link' }))
    expect(mockPush).toHaveBeenCalledWith('/support')
  })
})
