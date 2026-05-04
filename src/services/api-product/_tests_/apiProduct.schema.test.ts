
import {
  ApiProductTypeSchema,
  AdvertiseInfoSchema,
  BusinessInformationSchema,
  OperationSchema,
  ApiProductSchema,
  ApiCategoryDetailSchema,
  ApiTagDetailSchema,
  ApiProductDetailResponseSchema,
  ApiProductListResponseSchema,
  GetAllApiCategoryDetailSchema,
  GetAllApiTagDetailSchema,
} from '../apiProduct.schema'

describe('services/api-product/apiProduct.schema', () => {
  const sampleOperation = {
    id: 'op-1',
    nameApi: 'Get accounts',
    scope: '/accounts',
    version: '1.0',
    rateLimit: 'default',
    verb: 'GET',
  } as const

  const baseProduct = {
    id: '1',
    name: 'API',
    displayName: 'Display',
    description: null,
    context: '/v1',
    version: '1.0',
    type: 'APIPRODUCT',
    createdTime: null,
    provider: 'P',
    lifeCycleStatus: 'PUBLISHED',
    thumbnailUri: '',
    avgRating: '0',
    throttlingPolicies: [],
    advertiseInfo: {
      advertised: false,
      apiExternalProductionEndpoint: null,
      apiExternalSandboxEndpoint: null,
      originalDevPortalUrl: null,
      apiOwner: null,
      vendor: 'V',
    },
    businessInformation: {
      businessOwner: null,
      businessOwnerEmail: null,
      technicalOwner: null,
      technicalOwnerEmail: null,
    },
    isSubscriptionAvailable: true,
    monetizationLabel: '',
    gatewayType: '',
    gatewayVendor: '',
    additionalProperties: [],
    monetizedInfo: false,
    egress: false,
    subtype: '',
    resourceCount: 0,
    aboutDescription: '',
    aboutImage: '',
    bannerDescription: '',
    bannerImage: '',
  } as const

  it('ApiProductTypeSchema chấp nhận APIPRODUCT, retail, corporate', () => {
    expect(ApiProductTypeSchema.safeParse('APIPRODUCT').success).toBe(true)
    expect(ApiProductTypeSchema.safeParse('retail').success).toBe(true)
    expect(ApiProductTypeSchema.safeParse('corporate').success).toBe(true)
    expect(ApiProductTypeSchema.safeParse('unknown').success).toBe(false)
  })

  it('ApiProductSchema parse product có đủ field bắt buộc', () => {
    expect(ApiProductSchema.safeParse(baseProduct).success).toBe(true)
  })

  it('parse nested schemas trực tiếp', () => {
    expect(
      AdvertiseInfoSchema.safeParse(baseProduct.advertiseInfo).success
    ).toBe(true)
    expect(
      BusinessInformationSchema.safeParse(baseProduct.businessInformation).success
    ).toBe(true)
    expect(OperationSchema.safeParse(sampleOperation).success).toBe(true)
  })

  it('ApiProductSchema parse optional fields', () => {
    expect(
      ApiProductSchema.safeParse({
        ...baseProduct,
        imageUrl: 'https://example.com/thumbnail.png',
        operations: [sampleOperation],
        tags: ['payments'],
        categories: ['retail'],
        resourceCount: 3,
      }).success
    ).toBe(true)
  })

  it('ApiCategoryDetailSchema', () => {
    expect(
      ApiCategoryDetailSchema.safeParse({
        id: '1',
        name: 'Cat',
        description: 'D',
      }).success
    ).toBe(true)
  })

  it('ApiTagDetailSchema', () => {
    expect(ApiTagDetailSchema.safeParse({ value: 'tag', count: 1 }).success).toBe(true)
  })

  it('parse detail/list/category/tag response schemas', () => {
    expect(
      ApiProductDetailResponseSchema.safeParse({
        message: 'OK',
        code: '200',
        data: baseProduct,
      }).success
    ).toBe(true)

    expect(
      ApiProductListResponseSchema.safeParse({
        message: 'OK',
        code: '200',
        data: {
          count: 1,
          countActive: 1,
          list: [baseProduct],
          pagination: { offset: 0, limit: 10, total: 1, next: '', previous: '' },
        },
      }).success
    ).toBe(true)

    expect(
      GetAllApiCategoryDetailSchema.safeParse({
        message: 'OK',
        code: '200',
        data: {
          count: 1,
          countActive: 1,
          list: [{ id: '1', name: 'Category', description: 'Desc' }],
          pagination: { offset: 0, limit: 10, total: 1, next: '', previous: '' },
        },
      }).success
    ).toBe(true)

    expect(
      GetAllApiTagDetailSchema.safeParse({
        message: 'OK',
        code: '200',
        data: {
          count: 1,
          countActive: 1,
          list: [{ value: 'tag', count: 2 }],
          pagination: { offset: 0, limit: 10, total: 1, next: '', previous: '' },
        },
      }).success
    ).toBe(true)
  })
})