import {
  ScenarioCertificateDetailSchema,
  ScenarioDetailSchema,
  ScenarioOpenAPISpecSchema,
  ScenarioResourceSchema,
  ScenarioResultDetailSchema,
  GetScenarioCertificateResponseSchema,
} from '../scenario.schema'

describe('scenario.schema', () => {
  it('ScenarioDetailSchema parse hợp lệ', () => {
    const r = ScenarioDetailSchema.safeParse({
      id: '1',
      scenario_key: 'k',
      scenario_name: 'n',
      active_version_id: 'v',
      active_version: 2,
      api_id: 'a',
      api_name: 'api',
    })
    expect(r.success).toBe(true)
  })

  it('ScenarioResultDetailSchema cần status enum', () => {
    const ok = ScenarioResultDetailSchema.safeParse({
      caseId: 'c',
      caseName: 'n',
      status: 'PASS',
    })
    const bad = ScenarioResultDetailSchema.safeParse({
      caseId: 'c',
      caseName: 'n',
      status: 'UNKNOWN',
    })
    expect(ok.success).toBe(true)
    expect(bad.success).toBe(false)
  })

  it('ScenarioCertificateDetailSchema', () => {
    const r = ScenarioCertificateDetailSchema.safeParse({
      id: 'i',
      certificateNumber: 'cn',
      scenarioName: 's',
      apiName: 'a',
      apiId: 'aid',
      applicationId: 'apid',
      applicationName: 'AppName',
      issueDate: 'd',
      status: 'ACTIVE',
    })
    expect(r.success).toBe(true)
  })

  it('GetScenarioCertificateResponseSchema với data null', () => {
    const r = GetScenarioCertificateResponseSchema.safeParse({
      message: 'ok',
      code: '200',
      data: null,
    })
    expect(r.success).toBe(true)
  })

  it('ScenarioResourceSchema', () => {
    const r = ScenarioResourceSchema.safeParse({
      scenario_id: 's',
      scenario_key: 'k',
      scenario_name: 'n',
      version_id: 'v',
      version_number: 1,
      api_id: 'a',
      api_name: 'an',
      total_cases: 0,
      resource_groups: [],
    })
    expect(r.success).toBe(true)
  })

  it('ScenarioOpenAPISpecSchema tối thiểu', () => {
    const r = ScenarioOpenAPISpecSchema.safeParse({
      openapi: '3.0.0',
      info: { title: 't', version: '1' },
      paths: { '/x': { get: {} } },
    })
    expect(r.success).toBe(true)
  })
})
