import { useQuery } from '@tanstack/react-query'
import newsApi from './news.service'

export const newsKeys = {
  all: ['news'] as const,
  highlights: () => [...newsKeys.all, 'highlights'] as const,
  categories: () => [...newsKeys.all, 'categories'] as const,
  listByCategory: (
    categoryId: string,
    limit: number,
    offset: number,
  ) => [...newsKeys.all, 'list', categoryId, limit, offset] as const,
  detail: (id: string) => [...newsKeys.all, id, 'detail'] as const,
}

export function useGetHighlights() {
  return useQuery({
    queryKey: newsKeys.highlights(),
    queryFn: () => newsApi.getHighlights(),
  })
}

export function useGetNewsCategories() {
  return useQuery({
    queryKey: newsKeys.categories(),
    queryFn: () => newsApi.getCategories(),
  })
}

export type NewsByCategoryQueryParams = Readonly<{
  limit: number
  offset: number
}>

/** `categoryId` rỗng sẽ tắt query; `options.enabled` gating thêm (vd. chờ load categories). */
export function useGetNewsByCategory(
  categoryId: string | undefined,
  { limit, offset }: NewsByCategoryQueryParams,
  options?: Readonly<{ enabled?: boolean }>,
) {
  const id = categoryId?.trim()
  const allowFetch = options?.enabled ?? true

  return useQuery({
    queryKey: newsKeys.listByCategory(id ?? '', limit, offset),
    queryFn: () =>
      newsApi.getNewsByCategory({
        categoryId: id!,
        limit,
        offset,
      }),
    enabled: !!id && allowFetch,
  })
}

export function useGetNewsDetail(id: string) {
  return useQuery({
    queryKey: newsKeys.detail(id),
    queryFn: () => newsApi.getDetail(id),
    enabled: !!id,
  })
}
