import {
  APPLICATION_DESCRIPTION_MAX_LENGTH,
  APPLICATION_NAME_MAX_LENGTH,
  APPLICATION_NAME_MIN_LENGTH,
  APPLICATION_STATUS,
  APPLICATION_TIER,
} from '@/constants/application'
import { APPLICATION_NAME_REGEX, INPUT_EMPTY_REGEX } from '@/constants/regex'
import { APIListResponseSchema, APIResponseSchema } from '@/models/api/common'
import {
  AdvertiseInfoSchema,
  BusinessInformationSchema,
} from '@/services/api-product/apiProduct.schema'
import { z } from 'zod'

export const ApiKeyRequestSchema = z.object({
  validityPeriod: z.coerce.number(),
  additionalProperties: z.object({
    permittedIP: z.string(),
    permittedReferer: z.string(),
  }),
})

export type ApiKeyRequest = z.infer<typeof ApiKeyRequestSchema>

export const GenerateApiKeySchema = z.object({
  apikey: z.string(),
  validityTime: z.coerce.number(),
})

export type GenerateApiKey = z.infer<typeof GenerateApiKeySchema>

export const GenerateApiKeyResponseSchema =
  APIResponseSchema(GenerateApiKeySchema)

export type GenerateApiKeyResponse = z.infer<
  typeof GenerateApiKeyResponseSchema
>

export const ApplicationGeneratedKeyTokenSchema = z.object({
  accessToken: z.string(),
  tokenScopes: z.array(z.string()),
  validityTime: z.number(),
})

export type ApplicationGeneratedKeyToken = z.infer<
  typeof ApplicationGeneratedKeyTokenSchema
>

export const ConfigurationDetailSchema = z.object({
  name: z.string(),
  label: z.string(),
  type: z.string(),
  required: z.boolean(),
  mask: z.boolean(),
  multiple: z.boolean(),
  tooltip: z.string(),
  values: z.array(z.string()).optional(),
  default: z.union([z.string(), z.number(), z.boolean()]).optional(),
})

export type ConfigurationDetail = z.infer<typeof ConfigurationDetailSchema>

export const PropertyKeySchema = z.record(z.string(), z.unknown())

export type PropertyKey = z.infer<typeof PropertyKeySchema>

export const GenerateKeysSchema = z.object({
  keyMappingId: z.string(),
  keyManager: z.string(),
  consumerKey: z.string(),
  consumerSecret: z.string(),
  supportedGrantTypes: z.array(z.string()),
  callbackUrl: z.string(),
  keyState: z.string(),
  keyType: z.enum(APPLICATION_TIER),
  mode: z.string(),
  groupId: z.string().nullable(),
  token: ApplicationGeneratedKeyTokenSchema,
  additionalProperties: PropertyKeySchema,
})

export type GenerateKeys = z.infer<typeof GenerateKeysSchema>

export const GenerateKeysResponseSchema = APIResponseSchema(GenerateKeysSchema)

export type GenerateKeysResponse = z.infer<typeof GenerateKeysResponseSchema>

export const GenerateKeysRequestSchema = z.object({
  additionalProperties: PropertyKeySchema,
  callbackUrl: z.string(),
  grantTypesToBeSupported: z.array(z.string()),
  keyManager: z.string(),
  keyType: z.enum(APPLICATION_TIER),
})

export type GenerateKeysRequest = z.infer<typeof GenerateKeysRequestSchema>

export const UpdateConfigurationRequestSchema = z.object({
  additionalProperties: PropertyKeySchema,
  callbackUrl: z.string(),
  supportedGrantTypes: z.array(z.string()),
  keyManager: z.string(),
  keyType: z.enum(APPLICATION_TIER),
})

export type UpdateConfigurationRequest = z.infer<
  typeof UpdateConfigurationRequestSchema
>

export const SubscriptionScopesSchema = z.object({
  key: z.string(),
  name: z.string(),
  description: z.string(),
  role: z.array(z.string()),
})

export type SubscriptionScopes = z.infer<typeof SubscriptionScopesSchema>

export const ApplicationDetailSchema = z.object({
  name: z.string(),
  applicationId: z.string(),
  tier: z.enum(APPLICATION_TIER),
  throttlingPolicy: z.string(),
  description: z.string().nullable().optional(),
  status: z.enum(APPLICATION_STATUS),
  groups: z.array(z.string()),
  subscriptionCount: z.number(),
  attributes: z.record(z.string(), z.unknown()),
  owner: z.string(),
  tokenType: z.string(),
  keys: z.array(z.unknown()).optional(),
  subscriptionScopes: z.array(SubscriptionScopesSchema),
  hashEnabled: z.boolean().nullable().optional(),
  visibility: z.string().optional(),
  createdTime: z.string().nullable().optional(),
  updatedTime: z.string().nullable().optional(),
  subscribedApiIds: z.array(z.string()).optional(),
  registeredThisApi: z.boolean().optional(),
})

export type ApplicationDetail = z.infer<typeof ApplicationDetailSchema>

export const ApplicationDetailResponseSchema = APIResponseSchema(
  ApplicationDetailSchema
)
export type GetApplicationDetailResponse = z.infer<
  typeof ApplicationDetailResponseSchema
>

export const GetAllApplicationsSchema = APIListResponseSchema(
  ApplicationDetailSchema
)
export type GetAllApplicationsResponse = z.infer<
  typeof GetAllApplicationsSchema
>

export const ApplicationRequestSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'error.application.name.valid' })
    .transform((v) => v.trim())
    .pipe(
      z
        .string()
        .min(APPLICATION_NAME_MIN_LENGTH, {
          message: 'error.application.name.length',
        })
        .max(APPLICATION_NAME_MAX_LENGTH, {
          message: 'error.application.name.length',
        })
        .regex(APPLICATION_NAME_REGEX, {
          message: 'error.application.name.invalid',
        })
        .refine((v) => !INPUT_EMPTY_REGEX.test(v), {
          message: 'error.application.name.valid',
        })
    ),
  throttlingPolicy: z.string(),
  description: z.optional(
    z
      .string()
      .transform((v) => v.trim())
      .pipe(
        z.string().max(APPLICATION_DESCRIPTION_MAX_LENGTH, {
          message: 'error.application.description.length',
        })
      )
  ),
})

export type ApplicationRequest = z.infer<typeof ApplicationRequestSchema>

export const SubscribeApiRequestSchema = z.object({
  apiId: z.string().min(1),
  throttlingPolicy: z.string().min(1),
})

export type SubscribeApiRequest = z.infer<typeof SubscribeApiRequestSchema>

export const SubscribeApiSchema = z.object({
  subscriptionId: z.string(),
  applicationId: z.string(),
  throttlingPolicy: z.string(),
  status: z.string(),
})

export type SubscribeApi = z.infer<typeof SubscribeApiSchema>

export const SubscribeApiResponseSchema = APIResponseSchema(SubscribeApiSchema)
export type SubscribeApiResponse = z.infer<typeof SubscribeApiResponseSchema>

export const SubscriptionApiInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  displayName: z.string().nullable(),
  description: z.string().nullable(),
  context: z.string(),
  version: z.string(),
  type: z.string(),
  createdTime: z.string().nullable(),
  provider: z.string(),
  lifeCycleStatus: z.string(),
  thumbnailUri: z.string().nullable(),
  avgRating: z.string(),
  throttlingPolicies: z.array(z.string()),
  advertiseInfo: AdvertiseInfoSchema,
  businessInformation: BusinessInformationSchema,
  isSubscriptionAvailable: z.boolean(),
  monetizationLabel: z.string(),
  gatewayType: z.string().nullable(),
  gatewayVendor: z.string().nullable(),
  additionalProperties: z.array(z.unknown()),
  monetizedInfo: z.unknown().nullable(),
  egress: z.boolean(),
  subtype: z.string(),
})

export type SubscriptionApiInfo = z.infer<typeof SubscriptionApiInfoSchema>

export const SubscriptionApplicationInfoSchema = z.object({
  applicationId: z.string(),
  name: z.string(),
  throttlingPolicy: z.string(),
  description: z.string().optional(),
  status: z.enum(APPLICATION_STATUS),
  groups: z.array(z.string()),
  subscriptionCount: z.number(),
  attributes: z.record(z.string(), z.unknown()),
  owner: z.string(),
  tokenType: z.string(),
  createdTime: z.string().nullable().optional(),
  updatedTime: z.string().nullable().optional(),
})

export type SubscriptionApplicationInfo = z.infer<
  typeof SubscriptionApplicationInfoSchema
>

export const SubscriptionSchema = z.object({
  subscriptionId: z.string(),
  applicationId: z.string(),
  apiId: z.string(),
  apiInfo: SubscriptionApiInfoSchema,
  applicationInfo: SubscriptionApplicationInfoSchema,
  throttlingPolicy: z.string(),
  requestedThrottlingPolicy: z.string(),
  status: z.string(),
  redirectionParams: z.unknown().nullable(),
})

export type Subscription = z.infer<typeof SubscriptionSchema>

export const GetApplicationSubscriptionsResponseSchema =
  APIListResponseSchema(SubscriptionSchema)
export type GetApplicationSubscriptionsResponse = z.infer<
  typeof GetApplicationSubscriptionsResponseSchema
>

export const ThrottlingPoliciesDetailSchema = z.object({
  name: z.string(),
  description: z.string(),
  policyLevel: z.string(),
  attributes: z.record(z.string(), z.unknown()),
  requestCount: z.number(),
  dataUnit: z.string().nullable().optional(),
  unitTime: z.number(),
  timeUnit: z.string(),
  rateLimitCount: z.number(),
  rateLimitTimeUnit: z.string().nullable().optional(),
  quotaPolicyType: z.string().nullable().optional(),
  tierPlan: z.string().nullable().optional(),
  stopOnQuotaReach: z.boolean(),
  monetizationAttributes: z.record(z.string(), z.unknown()),
  throttlingPolicyPermissions: z.object({
    type: z.string(),
    roles: z.array(z.string()),
  }),
})

export type ThrottlingPoliciesDetail = z.infer<
  typeof ThrottlingPoliciesDetailSchema
>

export const GetAllThrottlingPoliciesResponseSchema = APIListResponseSchema(
  ThrottlingPoliciesDetailSchema
)
export type GetAllThrottlingPoliciesResponse = z.infer<
  typeof GetAllThrottlingPoliciesResponseSchema
>

export const KeyManagerDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  displayName: z.string(),
  description: z.string(),
  enabled: z.boolean(),
  availableGrantTypes: z.array(z.string()),
  tokenEndpoint: z.string(),
  revokeEndpoint: z.string(),
  userInfoEndpoint: z.string().nullable(),
  enableTokenGeneration: z.boolean(),
  enableTokenEncryption: z.boolean(),
  enableTokenHashing: z.boolean(),
  enableOAuthAppCreation: z.boolean(),
  enableMapOAuthConsumerApps: z.boolean(),
  applicationConfiguration: z.array(ConfigurationDetailSchema),
  alias: z.string().nullable(),
  additionalProperties: z.record(z.string(), z.unknown()),
  tokenType: z.string(),
})

export type KeyManagerDetail = z.infer<typeof KeyManagerDetailSchema>

export const GetAllKeyMangerResponseSchema = APIListResponseSchema(
  KeyManagerDetailSchema
)
export type GetAllKeyMangerResponse = z.infer<
  typeof GetAllKeyMangerResponseSchema
>

export const OauthKeyDetailSchema = z.object({
  keyMappingId: z.string(),
  keyManager: z.string(),
  consumerKey: z.string(),
  consumerSecret: z.string(),
  supportedGrantTypes: z.array(z.string()),
  callbackUrl: z.string(),
  keyState: z.string(),
  keyType: z.enum(APPLICATION_TIER),
  mode: z.string(),
  groupId: z.string().nullable(),
  token: z.object({
    accessToken: z.string().nullable(),
    tokenScopes: z.array(z.string()),
    validityTime: z.number(),
  }),
  additionalProperties: PropertyKeySchema,
})

export type OauthKeyDetail = z.infer<typeof OauthKeyDetailSchema>

export const GetAllOauthKeyResponseSchema =
  APIListResponseSchema(OauthKeyDetailSchema)
export type GetAllOauthKeyResponse = z.infer<
  typeof GetAllOauthKeyResponseSchema
>

export const AccessTokenDetailSchema = z.object({
  accessToken: z.string(),
  tokenScopes: z.array(z.string()),
  validityTime: z.number(),
})

export const GenerateAccessTokenDetailSchema = APIResponseSchema(
  AccessTokenDetailSchema
)
export type GenerateAccessTokenDetail = z.infer<
  typeof GenerateAccessTokenDetailSchema
>

export const RevokeAccessTokenRequestSchema = z.object({
  consumerSecret: z.string(),
  validityPeriod: z.number(),
  revokeToken: z.string().nullable(),
  scopes: z.array(z.string()),
  additionalProperties: PropertyKeySchema,
})

export type RevokeAccessTokenRequest = z.infer<
  typeof RevokeAccessTokenRequestSchema
>
