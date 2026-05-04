export const MOCK_APPLICATION_DETAIL = {
  name: 'Test App',
  applicationId: 'app-123',
  tier: 'SANDBOX' as const,
  throttlingPolicy: '10PerMin',
  description: 'Test description',
  status: 'APPROVED',
  groups: ['group1'],
  subscriptionCount: 2,
  attributes: {},
  owner: 'owner1',
  tokenType: 'JWT',
  keys: [],
  subscriptionScopes: [],
  hashEnabled: false,
  visibility: 'public',
  createdTime: '2024-01-01T00:00:00Z',
  updatedTime: '2024-01-02T00:00:00Z',
  subscribedApiIds: ['api-1'],
}

export const MOCK_APPLICATION_REQUEST = {
  name: 'New Application',
  throttlingPolicy: '10PerMin',
  description: 'Optional description',
}

export const MOCK_THROTTLING_POLICIES = [
  {
    name: '10PerMin',
    description: '10 requests per minute',
    policyLevel: 'application',
    attributes: {},
    requestCount: 10,
    dataUnit: null,
    unitTime: 1,
    timeUnit: 'min',
    rateLimitCount: 10,
    rateLimitTimeUnit: 'min',
    quotaPolicyType: 'requestCount',
    tierPlan: null,
    stopOnQuotaReach: true,
    monetizationAttributes: {},
    throttlingPolicyPermissions: { type: 'allow', roles: ['user'] },
  },
]

export const MOCK_APPLICATION_LIST_RESPONSE = {
  message: 'OK',
  code: '200',
  data: {
    count: 1,
    list: [MOCK_APPLICATION_DETAIL],
    pagination: {
      offset: 0,
      limit: 10,
      total: 1,
      next: '',
      previous: '',
    },
  },
}
