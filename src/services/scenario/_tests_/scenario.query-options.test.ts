import {
  scenarioKeys,
  useGetDetailScenario,
  useGetScenarioResource,
  useGetScenarioSwaggerSpec,
  useGetScenarioStatus,
  useGetScenarioCertificate,
  useGenrateCertifiate,
} from '../scenario.query-options'

jest.mock('@tanstack/react-query', () => ({
  useQuery: (opts: {
    queryKey: readonly unknown[]
    queryFn: () => unknown
    enabled?: boolean
    structuralSharing?: boolean
  }) => opts,
}))

jest.mock('../scenario.service', () => ({
  __esModule: true,
  default: {
    getDetailScenario: jest.fn(),
    getScenarioResource: jest.fn(),
    getScenarioSwaggerSpec: jest.fn(),
    getScenarioStatus: jest.fn(),
    getScenarioCertificate: jest.fn(),
    generateScenarioCertificate: jest.fn(),
  },
}))

const scenarioApi = require('../scenario.service').default

describe('scenario.query-options', () => {
  beforeEach(() => {
    Object.values(scenarioApi).forEach((fn: unknown) => {
      if (jest.isMockFunction(fn)) fn.mockReset()
    })
  })

  it('scenarioKeys', () => {
    expect(scenarioKeys.all).toEqual(['scenario'])
    expect(scenarioKeys.detail('a')).toEqual(['scenario', 'a', 'detail'])
    expect(scenarioKeys.resource('s', 'v', 'api')).toEqual([
      'scenario',
      'resource',
      's',
      'v',
      'api',
    ])
    expect(scenarioKeys.swaggerSpec('s', 'c', 'v', 'api')).toEqual([
      'scenario',
      'swaggerSpec',
      's',
      'c',
      'v',
      'api',
    ])
    expect(scenarioKeys.status('app', 'api', 's', 'v')).toEqual([
      'scenario',
      'status',
      'app',
      'api',
      's',
      'v',
    ])
    expect(scenarioKeys.certificate('app', 's', 'v', 'api')).toEqual([
      'scenario',
      'certificate',
      'app',
      's',
      'v',
      'api',
    ])
    expect(scenarioKeys.generateCertificate('id')).toEqual([
      'scenario',
      'id',
      'generateCertificate',
    ])
  })

  it('useGetDetailScenario queryFn gọi API', async () => {
    scenarioApi.getDetailScenario.mockResolvedValue({})
    const q = useGetDetailScenario('api-1') as {
      queryKey: unknown[]
      queryFn: () => Promise<unknown>
    }
    await q.queryFn()
    expect(scenarioApi.getDetailScenario).toHaveBeenCalledWith('api-1')
  })

  it('useGetScenarioResource', async () => {
    const q = useGetScenarioResource('s', 'v', 'api', true) as {
      queryFn: () => Promise<unknown>
    }
    await q.queryFn()
    expect(scenarioApi.getScenarioResource).toHaveBeenCalledWith('s', 'v', 'api')
  })

  it('useGetScenarioSwaggerSpec', async () => {
    const q = useGetScenarioSwaggerSpec('s', 'c', 'v', 'api') as {
      queryFn: () => Promise<unknown>
    }
    await q.queryFn()
    expect(scenarioApi.getScenarioSwaggerSpec).toHaveBeenCalledWith(
      's',
      'c',
      'v',
      'api',
    )
  })

  it('useGetScenarioStatus', async () => {
    const q = useGetScenarioStatus('app', 's', 'v', 'api', true) as {
      queryFn: () => Promise<unknown>
    }
    await q.queryFn()
    expect(scenarioApi.getScenarioStatus).toHaveBeenCalledWith(
      'app',
      's',
      'v',
      'api',
    )
  })

  it('useGetScenarioCertificate', async () => {
    const q = useGetScenarioCertificate('app', 's', 'v', 'api', true) as {
      queryFn: () => Promise<unknown>
    }
    await q.queryFn()
    expect(scenarioApi.getScenarioCertificate).toHaveBeenCalledWith(
      'app',
      's',
      'v',
      'api',
    )
  })

  it('useGenrateCertifiate', async () => {
    const q = useGenrateCertifiate('cid') as {
      queryFn: () => Promise<unknown>
      enabled: boolean
    }
    expect(q.enabled).toBe(true)
    await q.queryFn()
    expect(scenarioApi.generateScenarioCertificate).toHaveBeenCalledWith('cid')
  })
})
