import {
  SCENARIO_CERTIFICATE_STATUS,
  SCENARIO_STATUS,
} from '@/constants/scenario'
import { APIResponseSchema } from '@/models/api/common'
import z from 'zod'

export const ScenarioDetailSchema = z.object({
  id: z.string(),
  scenario_key: z.string(),
  scenario_name: z.string(),
  active_version_id: z.string(),
  active_version: z.number(),
  api_id: z.string(),
  api_name: z.string(),
})
export type ScenarioDetail = z.infer<typeof ScenarioDetailSchema>
export const ScenarioDetailResponseSchema =
  APIResponseSchema(ScenarioDetailSchema)
export type ScenarioDetailResponse = z.infer<
  typeof ScenarioDetailResponseSchema
>

export const ScenarioResourceCaseSchema = z.object({
  stepName: z.string(),
  case_id: z.string(),
  case_name: z.string(),
  step_order: z.number(),
  expected_status: z.number(),
  has_request_body: z.boolean(),
  openapi_url: z.string(),
})
export type ScenarioResourceCase = z.infer<typeof ScenarioResourceCaseSchema>

export const ScenarioResourceGroupSchema = z.object({
  resource_key: z.string(),
  path: z.string(),
  http_method: z.string(),
  case_count: z.number(),
  cases: z.array(ScenarioResourceCaseSchema),
})
export type ScenarioResourceGroup = z.infer<typeof ScenarioResourceGroupSchema>
export const ScenarioResourceGroupResponseSchema = APIResponseSchema(
  ScenarioResourceGroupSchema
)
export type ScenarioResourceGroupResponse = z.infer<
  typeof ScenarioResourceGroupResponseSchema
>
export const ScenarioResourceSchema = z.object({
  scenario_id: z.string(),
  scenario_key: z.string(),
  scenario_name: z.string(),
  version_id: z.string(),
  version_number: z.number(),
  api_id: z.string(),
  api_name: z.string(),
  total_cases: z.number(),
  resource_groups: z.array(ScenarioResourceGroupSchema),
})
export type ScenarioResource = z.infer<typeof ScenarioResourceSchema>
export const ScenarioResourceResponseSchema = APIResponseSchema(
  ScenarioResourceSchema
)
export type ScenarioResourceResponse = z.infer<
  typeof ScenarioResourceResponseSchema
>
export const ScenarioOpenAPISpecSchema = z.object({
  openapi: z.string(),
  info: z.object({
    title: z.string(),
    version: z.string(),
    description: z.string().optional(),
  }),
  servers: z.array(z.object({ url: z.string() })).optional(),
  security: z.array(z.record(z.string(), z.array(z.string()))).optional(),
  components: z
    .object({
      securitySchemes: z.record(z.string(), z.unknown()).optional(),
    })
    .optional(),
  paths: z.record(z.string(), z.unknown()),
})
export type ScenarioOpenAPISpec = z.infer<typeof ScenarioOpenAPISpecSchema>
export const ScenarioOpenAPISpecResponseSchema = APIResponseSchema(
  ScenarioOpenAPISpecSchema
)
export type ScenarioOpenAPISpecResponse = z.infer<
  typeof ScenarioOpenAPISpecResponseSchema
>

export const ScenarioPostmanCollectionSchema = z.unknown()

export type ScenarioPostmanCollection = z.infer<
  typeof ScenarioPostmanCollectionSchema
>
export const ScenarioPostmanCollectionResponseSchema = APIResponseSchema(
  ScenarioPostmanCollectionSchema
)
export type ScenarioPostmanCollectionResponse = z.infer<
  typeof ScenarioPostmanCollectionResponseSchema
>

export const ScenarioResultDetailSchema = z.object({
  caseId: z.string(),
  caseName: z.string(),
  status: z.enum(SCENARIO_STATUS),
})
export type ScenarioResultDetail = z.infer<typeof ScenarioResultDetailSchema>
export const ScenarioResultDetailResponseSchema = APIResponseSchema(
  ScenarioResultDetailSchema
)
export type ScenarioResultDetailResponse = z.infer<
  typeof ScenarioResultDetailResponseSchema
>
export const ScenarioCertificateDetailSchema = z.object({
  id: z.string(),
  certificateNumber: z.string(),
  scenarioName: z.string(),
  apiName: z.string(),
  apiId: z.string(),
  applicationId: z.string(),
  applicationName: z.string(),
  issueDate: z.string(),
  status: z.enum(SCENARIO_CERTIFICATE_STATUS),
})
export type ScenarioCertificateDetail = z.infer<
  typeof ScenarioCertificateDetailSchema
>
export const GetScenarioCertificateResponseSchema = APIResponseSchema(
  ScenarioCertificateDetailSchema.nullable().optional()
)
export type GetScenarioCertificateResponse = z.infer<
  typeof GetScenarioCertificateResponseSchema
>
export const ScenarioCertificateDetailResponseSchema = APIResponseSchema(
  ScenarioCertificateDetailSchema
)
export type ScenarioCertificateDetailResponse = z.infer<
  typeof ScenarioCertificateDetailResponseSchema
>
