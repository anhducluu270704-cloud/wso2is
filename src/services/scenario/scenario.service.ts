import { SCENARIO_ENVIRONMENT } from '@/constants/scenario'
import axiosClient from '@/libs/axiosClient'
import {
  GetScenarioCertificateResponse,
  ScenarioDetailResponse,
  ScenarioOpenAPISpecResponse,
  ScenarioPostmanCollectionResponse,
  ScenarioResourceResponse,
  ScenarioResultDetail,
} from './scenario.schema'

const scenarioApi = {
  getDetailScenario(apiId: string): Promise<ScenarioDetailResponse> {
    const url = `/self-service/scenarios/latest?apiId=${apiId}`
    return axiosClient.get(url)
  },
  getScenarioResource(
    scenario_id: string,
    version_id: string,
    api_id: string
  ): Promise<ScenarioResourceResponse> {
    const url = `/self-service/scenarios/${encodeURIComponent(scenario_id)}/resources`
    return axiosClient.get(url, {
      params: { versionId: version_id, apiId: api_id },
    })
  },
  getScenarioSwaggerSpec(
    scenario_id: string,
    case_id: string,
    version_id: string,
    api_id: string
  ): Promise<ScenarioOpenAPISpecResponse> {
    const url = `/self-service/scenarios/${encodeURIComponent(scenario_id)}/cases/${encodeURIComponent(case_id)}/openapi`
    return axiosClient.get(url, {
      params: {
        versionId: version_id,
        apiId: api_id,
        environmentName: SCENARIO_ENVIRONMENT,
      },
    })
  },
  getScenarioStatus(
    app_id: string,
    scenario_id: string,
    version_id: string,
    api_id: string
  ): Promise<{ data: ScenarioResultDetail[] }> {
    const url = `/self-service/test-verification/result`
    return axiosClient.get(url, {
      params: {
        scenarioId: scenario_id,
        versionId: version_id,
        applicationId: app_id,
        apiId: api_id,
      },
    })
  },
  getScenarioCertificate(
    app_id: string,
    scenario_id: string,
    version_id: string,
    api_id: string
  ): Promise<GetScenarioCertificateResponse> {
    const url = `/self-service/test-scenarios/certificates`
    return axiosClient.get(url, {
      params: {
        scenarioId: scenario_id,
        versionId: version_id,
        applicationId: app_id,
        apiId: api_id,
      },
    })
  },
  generateScenarioCertificate(cert_id: string): Promise<Blob> {
    const url = `/self-service/test-scenarios/certificates/${encodeURIComponent(cert_id)}/download`
    return axiosClient.get(url, { responseType: 'blob' })
  },
  getScenarioPostmanCollection(
    scenario_id: string,
    case_id: string,
    version_id: string,
    api_id: string
  ): Promise<ScenarioPostmanCollectionResponse> {
    const url = `/self-service/scenarios/${encodeURIComponent(scenario_id)}/cases/${encodeURIComponent(case_id)}/postman`
    return axiosClient.get(url, {
      params: {
        versionId: version_id,
        apiId: api_id,
        environmentName: SCENARIO_ENVIRONMENT,
      },
    })
  },
}

export default scenarioApi
