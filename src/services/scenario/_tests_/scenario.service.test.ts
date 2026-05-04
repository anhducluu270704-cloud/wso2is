import { SCENARIO_ENVIRONMENT } from '@/constants/scenario'
import scenarioApi from '../scenario.service'

const axiosGet = jest.fn()

jest.mock('@/libs/axiosClient', () => ({
  __esModule: true,
  default: {
    get: (...args: unknown[]) => axiosGet(...args),
  },
}))

describe('services/scenario/scenario.service', () => {
  beforeEach(() => {
    axiosGet.mockReset()
  })

  it('getDetailScenario gọi đúng URL', async () => {
    axiosGet.mockResolvedValue({})
    await scenarioApi.getDetailScenario('api-1')
    expect(axiosGet).toHaveBeenCalledWith(
      '/self-service/scenarios/latest?apiId=api-1'
    )
  })

  it('getScenarioResource gọi GET path + params', async () => {
    axiosGet.mockResolvedValue({})
    await scenarioApi.getScenarioResource('sc1', 'v1', 'api-1')
    expect(axiosGet).toHaveBeenCalledWith(
      '/self-service/scenarios/sc1/resources',
      { params: { versionId: 'v1', apiId: 'api-1' } }
    )
  })

  it('getScenarioSwaggerSpec gọi GET path + params', async () => {
    axiosGet.mockResolvedValue({})
    await scenarioApi.getScenarioSwaggerSpec('sc1', 'case1', 'v1', 'api-1')
    expect(axiosGet).toHaveBeenCalledWith(
      '/self-service/scenarios/sc1/cases/case1/openapi',
      {
        params: {
          versionId: 'v1',
          apiId: 'api-1',
          environmentName: SCENARIO_ENVIRONMENT,
        },
      }
    )
  })

  it('getScenarioStatus gọi GET path + params', async () => {
    axiosGet.mockResolvedValue({})
    await scenarioApi.getScenarioStatus('app1', 'sc1', 'v1', 'api-1')
    expect(axiosGet).toHaveBeenCalledWith(
      '/self-service/test-verification/result',
      {
        params: {
          scenarioId: 'sc1',
          versionId: 'v1',
          applicationId: 'app1',
          apiId: 'api-1',
        },
      }
    )
  })

  it('getScenarioCertificate gọi GET path + params', async () => {
    axiosGet.mockResolvedValue({})
    await scenarioApi.getScenarioCertificate('app1', 'sc1', 'v1', 'api-1')
    expect(axiosGet).toHaveBeenCalledWith(
      '/self-service/test-scenarios/certificates',
      {
        params: {
          scenarioId: 'sc1',
          versionId: 'v1',
          applicationId: 'app1',
          apiId: 'api-1',
        },
      }
    )
  })

  it('generateScenarioCertificate gọi GET blob', async () => {
    axiosGet.mockResolvedValue(new Blob())
    await scenarioApi.generateScenarioCertificate('cert-1')
    expect(axiosGet).toHaveBeenCalledWith(
      '/self-service/test-scenarios/certificates/cert-1/download',
      { responseType: 'blob' }
    )
  })

  it('getScenarioPostmanCollection encode scenario_id và case_id trong URL', async () => {
    axiosGet.mockResolvedValue({})
    await scenarioApi.getScenarioPostmanCollection(
      'sc/1',
      'case space',
      'v1',
      'api-1',
    )
    expect(axiosGet).toHaveBeenCalledWith(
      '/self-service/scenarios/sc%2F1/cases/case%20space/postman',
      {
        params: {
          versionId: 'v1',
          apiId: 'api-1',
          environmentName: SCENARIO_ENVIRONMENT,
        },
      },
    )
  })
})
