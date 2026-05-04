import { APIListResponseSchema, APIResponseSchema } from '@/models/api/common'
import { z } from 'zod'

export const ApiProductTypeSchema = z.enum([
  'APIPRODUCT',
  'retail',
  'corporate',
])

export type ApiProductType = z.infer<typeof ApiProductTypeSchema>

export const AdvertiseInfoSchema = z.object({
  advertised: z.boolean(),
  apiExternalProductionEndpoint: z.string().nullable(),
  apiExternalSandboxEndpoint: z.string().nullable(),
  originalDevPortalUrl: z.string().nullable(),
  apiOwner: z.string().nullable(),
  vendor: z.string(),
})

export const BusinessInformationSchema = z.object({
  businessOwner: z.string().nullable(),
  businessOwnerEmail: z.string().nullable(),
  technicalOwner: z.string().nullable(),
  technicalOwnerEmail: z.string().nullable(),
})

export const OperationSchema = z.object({
  id: z.string(),
  nameApi: z.string(),
  scope: z.string(),
  version: z.string(),
  rateLimit: z.string(),
  verb: z.string(),
})

export type Operation = z.infer<typeof OperationSchema>

export const ApiProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  displayName: z.string(),
  description: z.string().nullable(),
  context: z.string(),
  version: z.string(),
  type: ApiProductTypeSchema,
  createdTime: z.string().nullable(),
  provider: z.string(),
  lifeCycleStatus: z.string(),
  thumbnailUri: z.string(),
  avgRating: z.string(),
  throttlingPolicies: z.array(z.string()),
  advertiseInfo: AdvertiseInfoSchema,
  businessInformation: BusinessInformationSchema,
  isSubscriptionAvailable: z.boolean(),
  monetizationLabel: z.string(),
  gatewayType: z.string(),
  gatewayVendor: z.string(),
  additionalProperties: z.array(z.unknown()),
  monetizedInfo: z.boolean(),
  egress: z.boolean(),
  subtype: z.string(),
  imageUrl: z.string().optional(),
  operations: z.array(OperationSchema).optional(),
  tags: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  resourceCount: z.number(),
  aboutDescription: z.string(),
  aboutImage: z.string(),
  bannerDescription: z.string(),
  bannerImage: z.string(),
  documentLink: z.string().optional(),
})
export type GetApiProductResponse = z.infer<typeof ApiProductSchema>

export const ApiProductDetailResponseSchema =
  APIResponseSchema(ApiProductSchema)
export type GetApiProductDetailResponse = z.infer<
  typeof ApiProductDetailResponseSchema
>

export const ApiProductListResponseSchema =
  APIListResponseSchema(ApiProductSchema)
export type GetAllApiProductResponse = z.infer<
  typeof ApiProductListResponseSchema
>

export const ApiCategoryDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
})
export type ApiCategoryDetail = z.infer<typeof ApiCategoryDetailSchema>
export const GetAllApiCategoryDetailSchema = APIListResponseSchema(
  ApiCategoryDetailSchema
)
export type GetAllApiCategoryDetailResponse = z.infer<
  typeof GetAllApiCategoryDetailSchema
>

export const ApiTagDetailSchema = z.object({
  value: z.string(),
  count: z.number(),
})
export type ApiTagDetail = z.infer<typeof ApiTagDetailSchema>
export const GetAllApiTagDetailSchema =
  APIListResponseSchema(ApiTagDetailSchema)
export type GetAllApiTagDetailResponse = z.infer<
  typeof GetAllApiTagDetailSchema
>
