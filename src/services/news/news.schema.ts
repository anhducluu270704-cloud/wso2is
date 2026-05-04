import { z } from 'zod'
import { APIResponseSchema } from '@/models/api/common'

/** Tin highlight — khớp `GET /news/highlight` (thường ≤ 4 bản tin). */
export const NewsHighlightItemSchema = z.object({
  id: z.string(),
  thumbnailUrl: z.string(),
  articleTitleVi: z.string(),
  articleTitleEn: z.string(),
  categoryEn: z.string(),
  categoryVi: z.string(),
  descriptionEn: z.string(),
  descriptionVi: z.string(),
  createdAt: z.string(),
})

export type NewsHighlightItem = z.infer<typeof NewsHighlightItemSchema>

/** Tin trong danh mục — `GET /news?categoryId=…` có cùng payload từng dòng như highlight. */
export const NewsArticleItemSchema = NewsHighlightItemSchema
export type NewsArticleItem = NewsHighlightItem

export const NewsHighlightResponseSchema = APIResponseSchema(
  z.array(NewsHighlightItemSchema).max(4),
)
export type NewsHighlightResponse = z.infer<typeof NewsHighlightResponseSchema>

/** `GET /news/categories`. */
export const NewsCategorySchema = z.object({
  categoryId: z.string(),
  categoryNameEn: z.string(),
  categoryNameVi: z.string(),
})

export type NewsCategory = z.infer<typeof NewsCategorySchema>

export const NewsCategoriesResponseSchema = APIResponseSchema(
  z.array(NewsCategorySchema),
)
export type NewsCategoriesResponse = z.infer<
  typeof NewsCategoriesResponseSchema
>

export const NewsPaginationSchema = z.object({
  limit: z.coerce.number(),
  total: z.coerce.number(),
  offset: z.coerce.number(),
})

export type NewsPagination = z.infer<typeof NewsPaginationSchema>

export const NewsPaginatedBodySchema = z.object({
  count: z.coerce.number(),
  list: z.array(NewsArticleItemSchema),
  pagination: NewsPaginationSchema,
})

export type NewsPaginatedBody = z.infer<typeof NewsPaginatedBodySchema>

export const NewsByCategoryResponseSchema =
  APIResponseSchema(NewsPaginatedBodySchema)
export type NewsByCategoryResponse = z.infer<
  typeof NewsByCategoryResponseSchema
>

/** Tin UI legacy / mock chi tiết — map từ `NewsArticleItem` qua `highlightItemToNewsItem`. */
export const NewsItemSchema = z.object({
  id: z.string(),
  titleEn: z.string(),
  titleVi: z.string(),
  categoryEn: z.string(),
  categoryVi: z.string(),
  imageUrl: z.string(),
  descriptionEn: z.string(),
  descriptionVi: z.string(),
  createDate: z.string(),
})

export type NewsItem = z.infer<typeof NewsItemSchema>

/** Legacy — mảng `NewsItem`; API thật danh mục dùng `NewsByCategoryResponse`. */
export const NewsListResponseSchema = APIResponseSchema(z.array(NewsItemSchema))
export type NewsListResponse = z.infer<typeof NewsListResponseSchema>

export const NewsDetailResponseSchema =
  APIResponseSchema(NewsArticleItemSchema)
export type NewsDetailResponse = z.infer<typeof NewsDetailResponseSchema>
