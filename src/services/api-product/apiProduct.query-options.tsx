import { API_PRODUCT_LOAD_MORE_SIZE } from '@/constants/api-product'
import { Filter } from '@/models/api/common'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import apiProductApi from './apiProduct.service'

export function toApiProductInfiniteListKey(filter: Filter) {
  const { limit: _limit, offset: _offset, ...rest } = filter
  return rest
}

export const apiProductKeys = {
  all: ['apiProducts'] as const,
  getAll: (filter: Filter) =>
    [...apiProductKeys.all, filter, 'getAll'] as const,
  getAllInfinite: (filter: Filter) =>
    [
      ...apiProductKeys.all,
      toApiProductInfiniteListKey(filter),
      'getAllInfinite',
    ] as const,
  detail: (id: string) => [...apiProductKeys.all, id, 'detail'] as const,
  thumbnail: (id: string) => [...apiProductKeys.all, id, 'thumbnail'] as const,
  categories: () => [...apiProductKeys.all, 'categories'] as const,
}

export function useGetAllApiProducts(filter: Filter) {
  return useQuery({
    queryKey: apiProductKeys.getAll(filter),
    queryFn: () => apiProductApi.getAll(filter),
  })
}

export function useGetAllApiProductsInfinite(filter: Filter) {
  return useInfiniteQuery({
    queryKey: apiProductKeys.getAllInfinite(filter),
    queryFn: ({ pageParam }) => {
      const { limit: _limit, offset: _offset, ...listFilter } = filter
      return apiProductApi.getAll({
        ...listFilter,
        offset: pageParam,
        limit: pageParam === 0 ? filter.limit : API_PRODUCT_LOAD_MORE_SIZE,
      })
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { offset, limit, total } = lastPage.data.pagination
      const nextOffset = offset + limit
      return nextOffset < total ? nextOffset : undefined
    },
  })
}

export function useGetApiProductDetail(id: string) {
  return useQuery({
    queryKey: apiProductKeys.detail(id),
    queryFn: () => apiProductApi.getDetail(id),
    enabled: !!id,
  })
}

export function useGetApiProductThumbnail(id: string) {
  return useQuery({
    queryKey: apiProductKeys.thumbnail(id),
    queryFn: () => apiProductApi.getThumbnail(id),
    enabled: !!id,
  })
}

export function useGetApiProductCategories() {
  return useQuery({
    queryKey: apiProductKeys.categories(),
    queryFn: () => apiProductApi.getCategories(),
  })
}
