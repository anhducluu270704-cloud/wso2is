import { z } from 'zod'
import { EMAIL_REGEX } from '@/constants/regex'
import { APIResponseSchema } from '@/models/api/common'

export type GuideCategory = {
  categoryId: string
  categoryNameEn: string
  categoryNameVi: string
  children: GuideCategory[]
}

export const GuideCategorySchema: z.ZodType<GuideCategory> = z.lazy(() =>
  z.object({
    categoryId: z.string(),
    categoryNameEn: z.string(),
    categoryNameVi: z.string(),
    children: z.array(GuideCategorySchema),
  }),
)

export const GetGuideCategoriesResponseSchema = APIResponseSchema(
  z.array(GuideCategorySchema),
)
export type GetGuideCategoriesResponse = z.infer<
  typeof GetGuideCategoriesResponseSchema
>

export const GuideDocumentSchema = z.object({
  id: z.string(),
  documentTitleEn: z.string(),
  documentTitleVi: z.string(),
  categoryEn: z.string(),
  categoryVi: z.string(),
  descriptionEn: z.string(),
  descriptionVi: z.string(),
  createdAt: z.string(),
})
export type GuideDocument = z.infer<typeof GuideDocumentSchema>

export const GetGuideDocumentsDataSchema = z.object({
  count: z.number(),
  list: z.array(GuideDocumentSchema),
})

export const GetGuideDocumentsResponseSchema = APIResponseSchema(
  GetGuideDocumentsDataSchema,
)
export type GetGuideDocumentsResponse = z.infer<
  typeof GetGuideDocumentsResponseSchema
>

export const FaqArticleSchema = z.object({
  id: z.string(),
  articleTitleVi: z.string(),
  articleTitleEn: z.string(),
  descriptionEn: z.string(),
  descriptionVi: z.string(),
  createdAt: z.string(),
})
export type FaqArticle = z.infer<typeof FaqArticleSchema>

export const FaqCategorySchema = z.object({
  categoryId: z.string(),
  categoryNameVi: z.string(),
  categoryNameEn: z.string(),
  faqArticle: z.array(FaqArticleSchema),
})
export type FaqCategory = z.infer<typeof FaqCategorySchema>

export const GetFaqsDataSchema = z.object({
  count: z.number(),
  list: z.array(FaqCategorySchema),
})

export const GetFaqsResponseSchema = APIResponseSchema(GetFaqsDataSchema)
export type GetFaqsResponse = z.infer<typeof GetFaqsResponseSchema>

export const SupportRequestSchema = z.object({
  full_name: z.string().min(1, { message: 'error.required' }),
  email: z
    .string()
    .min(1, { message: 'error.required' })
    .regex(EMAIL_REGEX, { message: 'Email is not valid' }),
  company_name: z.string().min(1, { message: 'error.required' }),
  phone_number: z.string().min(1, { message: 'error.required' }),
  request_type: z.string().min(1, { message: 'error.required' }),
  description: z.string().max(512).optional(),
})
export type SupportRequest = z.infer<typeof SupportRequestSchema>
