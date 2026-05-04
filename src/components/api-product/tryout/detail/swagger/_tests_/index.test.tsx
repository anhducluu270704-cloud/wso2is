import React, { useEffect } from 'react'
import { render, screen } from '@testing-library/react'

const mockNotFound = jest.fn(() => null)
const mockInvalidateQueries = jest.fn()

jest.mock('next/navigation', () => ({
  notFound: () => mockNotFound(),
}))

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries: mockInvalidateQueries }),
}))

let capturedSwaggerProps: Record<string, unknown> | null = null

jest.mock('swagger-ui-react', () => ({
  __esModule: true,
  default: function SwaggerUIMock(props: Record<string, unknown>) {
    capturedSwaggerProps = props
    return <div data-testid="swagger-ui-mock" />
  },
}))

const mockUseGetScenarioSwaggerSpec = jest.fn()

jest.mock('@/services/scenario/scenario.query-options', () => ({
  scenarioKeys: { all: ['scenario'] },
  useGetScenarioSwaggerSpec: (...a: unknown[]) =>
    mockUseGetScenarioSwaggerSpec(...a),
}))

jest.mock('@/share/ui/spinner', () => ({
  SpinnerCustom: () => <div data-testid="swagger-spin" />,
}))

import { TryoutDetailProvider, useTryoutDetailContext } from '../../provider'
import SwaggerSection from '../index'

function SeedSecurity({
  scheme,
  accessToken = '',
}: {
  scheme: string
  accessToken?: string
}) {
  const { setSecuritySchemeType, setAccessToken } = useTryoutDetailContext()
  useEffect(() => {
    setSecuritySchemeType(scheme)
    setAccessToken(accessToken)
  }, [scheme, accessToken, setSecuritySchemeType, setAccessToken])
  return null
}

describe('SwaggerSection', () => {
  beforeEach(() => {
    mockNotFound.mockClear()
    mockInvalidateQueries.mockClear()
    capturedSwaggerProps = null
    mockUseGetScenarioSwaggerSpec.mockReset()
    mockUseGetScenarioSwaggerSpec.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: { openapi: '3.0.0', info: { title: 'T', version: '1' }, paths: {} },
    })
  })

  it('spinner khi loading spec', () => {
    mockUseGetScenarioSwaggerSpec.mockReturnValue({
      isLoading: true,
      isError: false,
      isSuccess: false,
    })
    render(
      <TryoutDetailProvider>
        <SwaggerSection
          scenario_id="s"
          version_id="v"
          api_id="a"
          case_id="c"
        />
      </TryoutDetailProvider>,
    )
    expect(screen.getByTestId('swagger-spin')).toBeInTheDocument()
  })

  it('notFound khi lỗi spec', () => {
    mockUseGetScenarioSwaggerSpec.mockReturnValue({
      isLoading: false,
      isError: true,
      isSuccess: false,
    })
    render(
      <TryoutDetailProvider>
        <SwaggerSection
          scenario_id="s"
          version_id="v"
          api_id="a"
          case_id="c"
        />
      </TryoutDetailProvider>,
    )
    expect(mockNotFound).toHaveBeenCalled()
  })

  it('requestInterceptor gắn Authorization Bearer cho OAUTH', () => {
    render(
      <TryoutDetailProvider>
        <SeedSecurity scheme="OAUTH" accessToken="tok" />
        <SwaggerSection
          scenario_id="s"
          version_id="v"
          api_id="a"
          case_id="c"
        />
      </TryoutDetailProvider>,
    )
    const ri = capturedSwaggerProps?.requestInterceptor as (r: {
      url?: string
      headers?: Record<string, string>
    }) => unknown
    const req = { url: '/x', headers: {} as Record<string, string> }
    ri(req)
    expect(req.headers.Authorization).toBe('Bearer tok')
  })

  it('requestInterceptor gắn apikey header cho API_KEY', () => {
    render(
      <TryoutDetailProvider>
        <SeedSecurity scheme="API_KEY" accessToken="my-key" />
        <SwaggerSection
          scenario_id="s"
          version_id="v"
          api_id="a"
          case_id="c"
        />
      </TryoutDetailProvider>,
    )
    const ri = capturedSwaggerProps?.requestInterceptor as (r: {
      headers?: Record<string, string>
    }) => unknown
    const req = { headers: {} as Record<string, string> }
    ri(req)
    expect(req.headers.apikey).toBe('my-key')
  })

  it('requestInterceptor không gắn header khi scheme không hỗ trợ', () => {
    render(
      <TryoutDetailProvider>
        <SeedSecurity scheme="BASIC" accessToken="ignored" />
        <SwaggerSection
          scenario_id="s"
          version_id="v"
          api_id="a"
          case_id="c"
        />
      </TryoutDetailProvider>,
    )
    const ri = capturedSwaggerProps?.requestInterceptor as (r: {
      headers?: Record<string, string>
    }) => unknown
    const req = { headers: {} as Record<string, string> }
    ri(req)
    expect(req.headers.Authorization).toBeUndefined()
    expect(req.headers.apikey).toBeUndefined()
  })

  it('responseInterceptor gọi invalidateQueries', () => {
    jest.useFakeTimers()
    render(
      <TryoutDetailProvider>
        <SwaggerSection
          scenario_id="s"
          version_id="v"
          api_id="a"
          case_id="c"
        />
      </TryoutDetailProvider>,
    )
    const respInt = capturedSwaggerProps?.responseInterceptor as (
      r: unknown,
    ) => unknown
    const fakeRes = { ok: true }
    const out = respInt(fakeRes)
    expect(out).toBe(fakeRes)
    expect(mockInvalidateQueries).not.toHaveBeenCalled()
    jest.advanceTimersByTime(500)
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ['scenario'],
    })
    jest.useRealTimers()
  })
})
