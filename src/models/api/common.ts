import { z } from "zod"
import {
  DEFAULT_PAGE_SIZE,
  ENUM_DIR_SORT,
  ENUM_TYPE_QUERY,
} from "@/constants/system"

export const BaseAPIResponseSchema = z.object({
  message: z.string(),
  code: z.string(),
  error: z.string().optional(),
})

export type BaseAPIResponse = z.infer<typeof BaseAPIResponseSchema>

export const APIResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  BaseAPIResponseSchema.extend({
    data: dataSchema,
  })

export const APIListResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  APIResponseSchema(z.object({
    count: z.number(),
    countActive: z.number(),
    list: z.array(dataSchema),
    pagination: PaginationSchema,
  }))

export const PaginationSchema = z.object({
  offset: z.number(),
  limit: z.number(),
  total: z.number(),
  next: z.string(),
  previous: z.string(),
})

export type Pagination = z.infer<typeof PaginationSchema>

export const PutFilterSchema = z.object({
  limit: z.coerce.number().min(1).max(50).default(10),
  offset: z.coerce.number().default(0),
})

export type PutFilterQuery = z.infer<typeof PutFilterSchema>

//For filter param
export const FilterQuerySchema = z.object({
  name: z.string(),
  type: z.enum(ENUM_TYPE_QUERY),
  value: z.union([z.string(), z.array(z.string()), z.boolean()]),
  sub: z.string().optional(),
})
export const FilterSortSchema = z.object({
  name: z.string(),
  dir: z.enum(ENUM_DIR_SORT),
})
export const FilterSchema = z.object({
  limit: z.coerce.number().min(1).max(50).default(DEFAULT_PAGE_SIZE),
  offset: z.coerce.number().default(0),
  keyword: z.string().optional(),
  category: z.string().optional(),
  certificateStatus: z.string().optional(),
  query: z.array(FilterQuerySchema).optional(),
  sort: FilterSortSchema.optional(),
})

export type FilterQuery = z.infer<typeof FilterQuerySchema>
export type FilterSort = z.infer<typeof FilterSortSchema>
export type Filter = z.infer<typeof FilterSchema>
export type FilterSearchParam = Partial<{
  limit: number
  page: number
  keyword: string
  category: string
  sort: string
  query: string
  certStatus?: string | string[]
}>