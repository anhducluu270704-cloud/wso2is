
/**
 * Unit test: services/application - schema validation
 */
import {
  APPLICATION_DESCRIPTION_MAX_LENGTH,
  APPLICATION_NAME_MAX_LENGTH,
  APPLICATION_NAME_MIN_LENGTH,
  APPLICATION_STATUS,
} from '@/constants/application'
import {
  ApplicationRequestSchema,
  ApplicationDetailSchema,
  ApplicationDetailResponseSchema,
  GetAllApplicationsSchema,
  SubscribeApiRequestSchema,
  ThrottlingPoliciesDetailSchema,
  GetAllThrottlingPoliciesResponseSchema,
} from '../application.schema'

describe('services/application/application.schema', () => {
  const baseApplicationDetail = {
    name: 'App',
    applicationId: 'app-1',
    tier: 'SANDBOX',
    throttlingPolicy: '10PerMin',
    status: 'APPROVED',
    groups: [],
    subscriptionCount: 0,
    attributes: {},
    owner: 'o1',
    tokenType: 'JWT',
    subscriptionScopes: [],
  }

  describe('ApplicationRequestSchema', () => {
    it('chấp nhận name, throttlingPolicy, description optional', () => {
      const result = ApplicationRequestSchema.safeParse({
        name: 'App1',
        throttlingPolicy: '10PerMin',
      })
      expect(result.success).toBe(true)
    })
    it('từ chối name rỗng', () => {
      expect(
        ApplicationRequestSchema.safeParse({
          name: '',
          throttlingPolicy: '10PerMin',
        }).success
      ).toBe(false)
    })

    it('min/max độ dài name tính theo chuỗi đã trim (bỏ khoảng trắng đầu cuối)', () => {
      expect(
        ApplicationRequestSchema.safeParse({
          name: `  ${'a'.repeat(APPLICATION_NAME_MIN_LENGTH)}  `,
          throttlingPolicy: '10PerMin',
        }).success,
      ).toBe(true)

      expect(
        ApplicationRequestSchema.safeParse({
          name: `  ${'a'.repeat(APPLICATION_NAME_MIN_LENGTH - 1)}  `,
          throttlingPolicy: '10PerMin',
        }).success,
      ).toBe(false)

      expect(
        ApplicationRequestSchema.safeParse({
          name: `  ${'a'.repeat(APPLICATION_NAME_MAX_LENGTH)}  `,
          throttlingPolicy: '10PerMin',
        }).success,
      ).toBe(true)

      expect(
        ApplicationRequestSchema.safeParse({
          name: `  ${'a'.repeat(APPLICATION_NAME_MAX_LENGTH + 1)}  `,
          throttlingPolicy: '10PerMin',
        }).success,
      ).toBe(false)
    })

    it('name: regex và kiểm tra rỗng áp dụng sau trim', () => {
      expect(
        ApplicationRequestSchema.safeParse({
          name: '  App 1  ',
          throttlingPolicy: '10PerMin',
        }).success,
      ).toBe(true)
    })

    it('description: max độ dài tính theo chuỗi đã trim', () => {
      const body = 'x'.repeat(APPLICATION_DESCRIPTION_MAX_LENGTH)
      expect(
        ApplicationRequestSchema.safeParse({
          name: 'App1',
          throttlingPolicy: '10PerMin',
          description: `  ${body}  `,
        }).success,
      ).toBe(true)

      expect(
        ApplicationRequestSchema.safeParse({
          name: 'App1',
          throttlingPolicy: '10PerMin',
          description: `  ${'x'.repeat(APPLICATION_DESCRIPTION_MAX_LENGTH + 1)}  `,
        }).success,
      ).toBe(false)
    })
  })

  describe('ApplicationDetailSchema status', () => {
    it('chấp nhận APPLICATION_STATUS và từ chối giá trị không hợp lệ', () => {
      for (const status of APPLICATION_STATUS) {
        expect(
          ApplicationDetailSchema.safeParse({ ...baseApplicationDetail, status })
            .success
        ).toBe(true)
      }
      expect(
        ApplicationDetailSchema.safeParse({
          ...baseApplicationDetail,
          status: 'UNKNOWN',
        }).success
      ).toBe(false)
    })
  })

  describe('ApplicationDetailSchema', () => {
    it('parse application detail từ API', () => {
      const result = ApplicationDetailSchema.safeParse(baseApplicationDetail)
      expect(result.success).toBe(true)
    })

    it('parse application detail với optional fields', () => {
      expect(
        ApplicationDetailSchema.safeParse({
          ...baseApplicationDetail,
          description: null,
          keys: [],
          subscriptionScopes: [],
          hashEnabled: true,
          visibility: 'PUBLIC',
          createdTime: null,
          updatedTime: null,
          subscribedApiIds: ['api-1'],
        }).success
      ).toBe(true)
    })
  })

  describe('SubscribeApiRequestSchema', () => {
    it('cần apiId và throttlingPolicy', () => {
      expect(
        SubscribeApiRequestSchema.safeParse({ apiId: 'api-1', throttlingPolicy: '10PerMin' }).success
      ).toBe(true)
      expect(SubscribeApiRequestSchema.safeParse({ apiId: '' }).success).toBe(false)
    })
  })

  describe('ApplicationDetailResponseSchema', () => {
    it('parse response có message, code, data', () => {
      const result = ApplicationDetailResponseSchema.safeParse({
        message: 'OK',
        code: '200',
        data: baseApplicationDetail,
      })
      expect(result.success).toBe(true)
    })
  })

  describe('GetAllApplicationsSchema', () => {
    it('parse list response có count, list, pagination', () => {
      const result = GetAllApplicationsSchema.safeParse({
        message: 'OK',
        code: '200',
        data: {
          count: 0,
          countActive: 0,
          list: [],
          pagination: { offset: 0, limit: 10, total: 0, next: '', previous: '' },
        },
      })
      expect(result.success).toBe(true)
    })
  })

  describe('ThrottlingPolicies schemas', () => {
    it('parse throttling policy detail', () => {
      expect(
        ThrottlingPoliciesDetailSchema.safeParse({
          name: 'Gold',
          description: 'High quota',
          policyLevel: 'APPLICATION',
          attributes: {},
          requestCount: 1000,
          dataUnit: null,
          unitTime: 1,
          timeUnit: 'min',
          rateLimitCount: 10,
          rateLimitTimeUnit: null,
          quotaPolicyType: null,
          tierPlan: null,
          stopOnQuotaReach: true,
          monetizationAttributes: {},
          throttlingPolicyPermissions: {
            type: 'ALLOW',
            roles: ['admin'],
          },
        }).success
      ).toBe(true)
    })

    it('parse throttling policies list response', () => {
      expect(
        GetAllThrottlingPoliciesResponseSchema.safeParse({
          message: 'OK',
          code: '200',
          data: {
            count: 1,
            countActive: 1,
            list: [
              {
                name: 'Gold',
                description: 'High quota',
                policyLevel: 'APPLICATION',
                attributes: {},
                requestCount: 1000,
                dataUnit: 'MB',
                unitTime: 1,
                timeUnit: 'min',
                rateLimitCount: 10,
                rateLimitTimeUnit: 'sec',
                quotaPolicyType: 'REQUESTCOUNTLIMIT',
                tierPlan: 'FREE',
                stopOnQuotaReach: false,
                monetizationAttributes: {},
                throttlingPolicyPermissions: { type: 'ALLOW', roles: [] },
              },
            ],
            pagination: { offset: 0, limit: 10, total: 1, next: '', previous: '' },
          },
        }).success
      ).toBe(true)
    })
  })
})