
/**
 * Unit test: applicationApi — mọi method gọi axiosClient đúng URL, method và payload.
 */
import { APPLICATION_TIER } from '@/constants/application'
import { trimObject } from '@/util'
import applicationApi from '../application.service'
import type { ApplicationRequest } from '../application.schema'
import {
  MOCK_APPLICATION_DETAIL,
  MOCK_APPLICATION_REQUEST,
} from '@/_tests_/mocks'

jest.mock('@/libs/axiosClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}))

const axiosClient = require('@/libs/axiosClient').default

describe('services/application/application.service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(axiosClient.get as jest.Mock).mockResolvedValue({})
    ;(axiosClient.post as jest.Mock).mockResolvedValue({})
    ;(axiosClient.put as jest.Mock).mockResolvedValue({})
    ;(axiosClient.delete as jest.Mock).mockResolvedValue({})
  })

  describe('getAll', () => {
    it('GET /application/list với filter', async () => {
      await applicationApi.getAll({ offset: 0, limit: 10 })
      expect(axiosClient.get).toHaveBeenCalledWith('/application/list', {
        params: { offset: 0, limit: 10 },
      })
    })

    it('GET /application/list không truyền filter → params rỗng', async () => {
      await applicationApi.getAll()
      expect(axiosClient.get).toHaveBeenCalledWith('/application/list', {
        params: {},
      })
    })
  })

  describe('getAllWithApiStatus', () => {
    it('GET /application/list-with-api-status với offset, limit, apiId', async () => {
      await applicationApi.getAllWithApiStatus({
        offset: 0,
        limit: 10,
        apiId: 'api-1',
      })
      expect(axiosClient.get).toHaveBeenCalledWith(
        '/application/list-with-api-status',
        {
          params: { offset: 0, limit: 10, apiId: 'api-1' },
        },
      )
    })

    it('GET /application/list-with-api-status không filter → params rỗng', async () => {
      await applicationApi.getAllWithApiStatus()
      expect(axiosClient.get).toHaveBeenCalledWith(
        '/application/list-with-api-status',
        { params: {} },
      )
    })
  })

  describe('getDetail', () => {
    it('GET /application/:id', async () => {
      await applicationApi.getDetail('app-123')
      expect(axiosClient.get).toHaveBeenCalledWith('/application/app-123')
    })
  })

  describe('getKeyManger', () => {
    it('GET /application/key-managers', async () => {
      await applicationApi.getKeyManger()
      expect(axiosClient.get).toHaveBeenCalledWith('/application/key-managers')
    })
  })

  describe('getOauthKey', () => {
    it('GET /application/oauth-keys với params appId', async () => {
      await applicationApi.getOauthKey('app-xyz')
      expect(axiosClient.get).toHaveBeenCalledWith('/application/oauth-keys', {
        params: { appId: 'app-xyz' },
      })
    })
  })

  describe('getSubscriptions', () => {
    it('GET /application/subscriptions với params appId', async () => {
      await applicationApi.getSubscriptions('app-subs')
      expect(axiosClient.get).toHaveBeenCalledWith(
        '/application/subscriptions',
        { params: { appId: 'app-subs' } },
      )
    })
  })

  describe('deleteSubscription', () => {
    it('DELETE /application/subscription/:subscriptionId', async () => {
      await applicationApi.deleteSubscription('sub-99')
      expect(axiosClient.delete).toHaveBeenCalledWith(
        '/application/subscription/sub-99',
      )
    })
  })

  describe('create', () => {
    it('POST /application với body đã trimObject(removeEmptyString)', async () => {
      const body: ApplicationRequest = {
        ...MOCK_APPLICATION_REQUEST,
        description: '',
      }
      await applicationApi.create(body)
      expect(axiosClient.post).toHaveBeenCalledWith(
        '/application',
        trimObject(body as unknown as Record<string, unknown>, {
          removeEmptyString: true,
        }) as ApplicationRequest,
      )
    })

    it('POST /application — giữ field khi description không rỗng', async () => {
      await applicationApi.create(MOCK_APPLICATION_REQUEST)
      expect(axiosClient.post).toHaveBeenCalledWith(
        '/application',
        trimObject(
          MOCK_APPLICATION_REQUEST as unknown as Record<string, unknown>,
          { removeEmptyString: true },
        ) as ApplicationRequest,
      )
    })
  })

  describe('getAllThrottlingPolicies', () => {
    it('GET /application/throttling-policies/application', async () => {
      await applicationApi.getAllThrottlingPolicies()
      expect(axiosClient.get).toHaveBeenCalledWith(
        '/application/throttling-policies/application',
      )
    })
  })

  describe('delete', () => {
    it('DELETE /application/:id', async () => {
      await applicationApi.delete('app-1')
      expect(axiosClient.delete).toHaveBeenCalledWith('/application/app-1')
    })
  })

  describe('update', () => {
    it('PUT /application/:id với body đã trimObject(removeEmptyString)', async () => {
      const body: ApplicationRequest = {
        name: 'Updated',
        throttlingPolicy: '20PerMin',
        description: '   ',
      }
      await applicationApi.update('app-up', body)
      expect(axiosClient.put).toHaveBeenCalledWith(
        '/application/app-up',
        trimObject(body as unknown as Record<string, unknown>, {
          removeEmptyString: true,
        }) as ApplicationRequest,
      )
    })
  })

  describe('subscribe', () => {
    it('POST /application/:applicationId/subscribe với body gốc', async () => {
      const subscribeBody = { apiId: 'api-1', throttlingPolicy: '10PerMin' }
      await applicationApi.subscribe('app-1', subscribeBody)
      expect(axiosClient.post).toHaveBeenCalledWith(
        '/application/app-1/subscribe',
        subscribeBody,
      )
    })
  })

  describe('deleteOAuthKey', () => {
    it('DELETE /application/:applicationId/keys/:oauthKeyId', async () => {
      await applicationApi.deleteOAuthKey('app-oauth', 'key-7')
      expect(axiosClient.delete).toHaveBeenCalledWith(
        '/application/app-oauth/keys/key-7',
      )
    })
  })

  describe('generateKeys', () => {
    it('POST /application/:applicationId/generate-keys (body không qua trimObject)', async () => {
      const body = {
        additionalProperties: { a: 1 },
        callbackUrl: 'https://cb',
        grantTypesToBeSupported: ['password'],
        keyManager: 'KM',
        keyType: APPLICATION_TIER[0],
      }
      await applicationApi.generateKeys('app-gen', body)
      expect(axiosClient.post).toHaveBeenCalledWith(
        '/application/app-gen/generate-keys',
        body,
      )
    })
  })

  describe('updateConfiguration', () => {
    it('PUT /application/oauth-keys? với body và params appId & keyMappingId', async () => {
      const body = {
        additionalProperties: {},
        callbackUrl: 'https://cb',
        supportedGrantTypes: ['password'],
        keyManager: 'KM',
        keyType: APPLICATION_TIER[0],
      }
      await applicationApi.updateConfiguration('app-cfg', 'oauth-1', body)
      expect(axiosClient.put).toHaveBeenCalledWith(
        '/application/oauth-keys',
        body,
        { params: { appId: 'app-cfg', keyMappingId: 'oauth-1' } },
      )
    })
  })

  describe('generateAccessToken', () => {
    it('POST /application/:appId/keys/:oauthKeyId/revoke-access-token', async () => {
      const body = {
        consumerSecret: 'sec',
        validityPeriod: 3600,
        revokeToken: null,
        scopes: ['read'],
        additionalProperties: {},
      }
      await applicationApi.generateAccessToken('app-at', 'oauth-at', body)
      expect(axiosClient.post).toHaveBeenCalledWith(
        '/application/app-at/keys/oauth-at/revoke-access-token',
        body,
      )
    })
  })

  describe('trả về promise từ axiosClient', () => {
    it('getDetail trả về kết quả resolve của get', async () => {
      const payload = { data: MOCK_APPLICATION_DETAIL }
      ;(axiosClient.get as jest.Mock).mockResolvedValueOnce(payload)
      await expect(applicationApi.getDetail('x')).resolves.toBe(payload)
    })
  })
})
