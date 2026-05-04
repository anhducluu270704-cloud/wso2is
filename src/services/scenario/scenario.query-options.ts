import { useQuery } from '@tanstack/react-query'
import scenarioApi from './scenario.service'

export const scenarioKeys = {
  all: ['scenario'] as const,
  detail: (apiId: string) => [...scenarioKeys.all, apiId, 'detail'] as const,
  resource: (scenario_id: string, version_id: string, api_id: string) =>
    [...scenarioKeys.all, 'resource', scenario_id, version_id, api_id] as const,
  swaggerSpec: (
    scenario_id: string,
    case_id: string,
    version_id: string,
    api_id: string
  ) =>
    [
      ...scenarioKeys.all,
      'swaggerSpec',
      scenario_id,
      case_id,
      version_id,
      api_id,
    ] as const,
  status: (
    app_id: string,
    api_id: string,
    scenario_id: string,
    version_id: string
  ) =>
    [
      ...scenarioKeys.all,
      'status',
      app_id,
      api_id,
      scenario_id,
      version_id,
    ] as const,
  certificate: (
    app_id: string,
    scenario_id: string,
    version_id: string,
    api_id: string
  ) =>
    [
      ...scenarioKeys.all,
      'certificate',
      app_id,
      scenario_id,
      version_id,
      api_id,
    ] as const,
  generateCertificate: (id: string) =>
    [...scenarioKeys.all, id, 'generateCertificate'] as const,
}

export function useGetDetailScenario(api_id: string) {
  return useQuery({
    queryKey: scenarioKeys.detail(api_id),
    queryFn: () => scenarioApi.getDetailScenario(api_id),
  })
}

export function useGetScenarioResource(
  scenario_id: string,
  version_id: string,
  api_id: string,
  enabled = true
) {
  return useQuery({
    queryKey: scenarioKeys.resource(scenario_id, version_id, api_id),
    queryFn: () =>
      scenarioApi.getScenarioResource(scenario_id, version_id, api_id),
    enabled,
  })
}

export function useGetScenarioSwaggerSpec(
  scenario_id: string,
  case_id: string,
  version_id: string,
  api_id: string
) {
  return useQuery({
    queryKey: scenarioKeys.swaggerSpec(
      scenario_id,
      case_id,
      version_id,
      api_id
    ),
    queryFn: () =>
      scenarioApi.getScenarioSwaggerSpec(
        scenario_id,
        case_id,
        version_id,
        api_id
      ),
  })
}

export function useGetScenarioStatus(
  app_id: string,
  scenario_id: string,
  version_id: string,
  api_id: string,
  enabled = true
) {
  return useQuery({
    queryKey: scenarioKeys.status(app_id, api_id, scenario_id, version_id),
    queryFn: () =>
      scenarioApi.getScenarioStatus(app_id, scenario_id, version_id, api_id),
    enabled,
  })
}

export function useGetScenarioCertificate(
  app_id: string,
  scenario_id: string,
  version_id: string,
  api_id: string,
  enabled = true
) {
  return useQuery({
    queryKey: scenarioKeys.certificate(app_id, scenario_id, version_id, api_id),
    queryFn: () =>
      scenarioApi.getScenarioCertificate(
        app_id,
        scenario_id,
        version_id,
        api_id
      ),
    enabled,
  })
}

export function useGenrateCertifiate(cert_id: string) {
  return useQuery({
    queryKey: scenarioKeys.generateCertificate(cert_id),
    queryFn: () => scenarioApi.generateScenarioCertificate(cert_id),
    enabled: !!cert_id,
    structuralSharing: false,
  })
}
