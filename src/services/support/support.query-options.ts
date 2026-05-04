import { useQuery } from '@tanstack/react-query'
import { Filter } from '@/models/api/common'
import supportApi from './support.service'

export const supportKeys = {
  all: ['support'] as const,
  list: (filter: Filter) =>
    [...supportKeys.all, 'list', filter] as const,
  guideCategories: () => [...supportKeys.all, 'guide', 'categories'] as const,
  guideDocuments: (categoryId: string, filter: Filter) =>
    [...supportKeys.all, 'guide', 'documents', categoryId, filter] as const,
}

export function useGetSupportList(filter: Filter) {
  return useQuery({
    queryKey: supportKeys.list(filter),
    queryFn: () => supportApi.getFaqs(filter),
  })
}

export function useGetGuideCategories() {
  return useQuery({
    queryKey: supportKeys.guideCategories(),
    queryFn: () => supportApi.getGuideCategories(),
  })
}

export function useGetGuideDocuments(categoryId: string, filter: Filter) {
  return useQuery({
    queryKey: supportKeys.guideDocuments(categoryId, filter),
    queryFn: () => supportApi.getGuideDocuments(categoryId, filter),
    enabled: Boolean(categoryId?.trim()),
  })
}
