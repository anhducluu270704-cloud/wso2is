import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}))

const mockUseGetOauthKeys = jest.fn()
const mockUseGetApplication = jest.fn()
const mockUseGetScenarioSwaggerSpec = jest.fn()
const mockDownloadPostmanMutate = jest.fn()
const mockDownloadJsonFile = jest.fn()

jest.mock('@/util/download', () => ({
  downloadJsonFile: (...args: unknown[]) => mockDownloadJsonFile(...args),
}))

jest.mock('@/services/application/application.query-options', () => ({
  useGetOauthKeys: (...a: unknown[]) => mockUseGetOauthKeys(...a),
  useGetApplication: (...a: unknown[]) => mockUseGetApplication(...a),
}))

jest.mock('@/services/scenario/scenario.query-options', () => ({
  useGetScenarioSwaggerSpec: (...a: unknown[]) =>
    mockUseGetScenarioSwaggerSpec(...a),
}))

jest.mock('@/services/scenario/scenario.mutations', () => ({
  useDownloadPostmanCollectionMutation: () => ({
    mutate: mockDownloadPostmanMutate,
  }),
}))

jest.mock('../access-token', () => ({
  __esModule: true,
  default: () => <div data-testid="access-token-mock" />,
}))

jest.mock('@/share/ui/spinner', () => ({
  SpinnerCustom: () => <div data-testid="sec-spinner" />,
}))

jest.mock('@/share/icons', () => ({
  PostmanIcon: () => <span data-testid="postman-icon" />,
  SwaggerIcon: () => <span data-testid="swagger-icon" />,
}))

import { TryoutDetailProvider } from '../../provider'
import SecuritySection from '../index'

function loadedOauth() {
  return {
    isLoading: false,
    isError: false,
    isSuccess: true,
    data: {
      data: {
        list: [
          {
            keyType: 'SANDBOX',
            keyManager: 'Resident Key Manager',
            keyMappingId: 'km-1',
            consumerSecret: 'cs',
            additionalProperties: {},
          },
        ],
      },
    },
  }
}

describe('SecuritySection', () => {
  beforeEach(() => {
    mockDownloadJsonFile.mockReset()
    mockUseGetScenarioSwaggerSpec.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: { data: { openapi: '3.0.0', info: { title: 'Spec' } } },
    })
    mockUseGetOauthKeys.mockReturnValue(loadedOauth())
    mockUseGetApplication.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: { data: { name: 'MyApp' } },
    })
  })

  it('hiển thị OAuth và AccessToken mặc định', () => {
    render(
      <TryoutDetailProvider>
        <SecuritySection
          app_id="app-1"
          scenario_id="sc-1"
          version_id="v-1"
          api_id="api-1"
          case_id="case-1"
          case_name="case-a"
        />
      </TryoutDetailProvider>,
    )
    expect(screen.getByText('MyApp')).toBeInTheDocument()
    expect(screen.getByText('OAuth')).toBeInTheDocument()
    expect(screen.getByTestId('access-token-mock')).toBeInTheDocument()
  })

  it('spinner khi đang load', () => {
    mockUseGetOauthKeys.mockReturnValue({
      isLoading: true,
      isError: false,
      isSuccess: false,
    })
    render(
      <TryoutDetailProvider>
        <SecuritySection
          app_id="app-1"
          scenario_id="sc-1"
          version_id="v-1"
          api_id="api-1"
          case_id="case-1"
          case_name="case-a"
        />
      </TryoutDetailProvider>,
    )
    expect(screen.getByTestId('sec-spinner')).toBeInTheDocument()
  })

  it('click Swagger button gọi downloadJsonFile với spec và tên file', () => {
    const swaggerInner = { openapi: '3.0.0', info: { title: 'Spec' } }
    mockUseGetScenarioSwaggerSpec.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: { data: swaggerInner },
    })

    render(
      <TryoutDetailProvider>
        <SecuritySection
          app_id="app-1"
          scenario_id="sc-1"
          version_id="v-1"
          api_id="api-1"
          case_id="case-1"
          case_name="case-a"
        />
      </TryoutDetailProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: /Swagger/ }))

    expect(mockDownloadJsonFile).toHaveBeenCalledTimes(1)
    expect(mockDownloadJsonFile).toHaveBeenCalledWith(
      swaggerInner,
      'case-a.swagger.json',
    )
  })

  it('click Postman button calls download mutation', () => {
    render(
      <TryoutDetailProvider>
        <SecuritySection
          app_id="app-1"
          scenario_id="sc-1"
          version_id="v-1"
          api_id="api-1"
          case_id="case-1"
          case_name="case-a"
        />
      </TryoutDetailProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: /Postman Collection/ }))
    expect(mockDownloadPostmanMutate).toHaveBeenCalledTimes(1)
  })

  it('trả về null khi swagger spec lỗi', () => {
    mockUseGetScenarioSwaggerSpec.mockReturnValue({
      isLoading: false,
      isError: true,
      isSuccess: false,
    })
    const { container } = render(
      <TryoutDetailProvider>
        <SecuritySection
          app_id="app-1"
          scenario_id="sc-1"
          version_id="v-1"
          api_id="api-1"
          case_id="case-1"
          case_name="case-a"
        />
      </TryoutDetailProvider>,
    )
    expect(container.firstChild).toBeNull()
  })

  it('trả về null khi oauth keys lỗi', () => {
    mockUseGetOauthKeys.mockReturnValue({
      isLoading: false,
      isError: true,
      isSuccess: false,
    })
    const { container } = render(
      <TryoutDetailProvider>
        <SecuritySection
          app_id="app-1"
          scenario_id="sc-1"
          version_id="v-1"
          api_id="api-1"
          case_id="case-1"
          case_name="case-a"
        />
      </TryoutDetailProvider>,
    )
    expect(container.firstChild).toBeNull()
  })

  it('trả về null khi application detail lỗi', () => {
    mockUseGetApplication.mockReturnValue({
      isLoading: false,
      isError: true,
      isSuccess: false,
    })
    const { container } = render(
      <TryoutDetailProvider>
        <SecuritySection
          app_id="app-1"
          scenario_id="sc-1"
          version_id="v-1"
          api_id="api-1"
          case_id="case-1"
          case_name="case-a"
        />
      </TryoutDetailProvider>,
    )
    expect(container.firstChild).toBeNull()
  })

  it('Swagger: không gọi downloadJsonFile khi swaggerSpec.data thiếu', () => {
    mockUseGetScenarioSwaggerSpec.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: { data: null },
    })

    render(
      <TryoutDetailProvider>
        <SecuritySection
          app_id="app-1"
          scenario_id="sc-1"
          version_id="v-1"
          api_id="api-1"
          case_id="case-1"
          case_name="case-a"
        />
      </TryoutDetailProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: /Swagger/ }))
    expect(mockDownloadJsonFile).not.toHaveBeenCalled()
  })
})
