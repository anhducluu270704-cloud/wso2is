import {
  APPLICATION_LIST_INITIAL_PAGE_SIZE,
  APPLICATION_LIST_PAGE_SIZE,
} from '@/constants/application'
import { Filter } from '@/models/api/common'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import applicationApi from './application.service'

type ApplicationInfiniteFilter = Filter & {
  apiId: string
}

export function toApplicationInfiniteListKey(
  filter: ApplicationInfiniteFilter
) {
  const { limit: _limit, offset: _offset, ...rest } = filter
  return rest
}

export const applicationKeys = {
  all: ['applications'] as const,
  list: (filter: Filter) => [...applicationKeys.all, 'list', filter] as const,
  listInfinite: (filter: ApplicationInfiniteFilter) =>
    [
      ...applicationKeys.all,
      'list',
      toApplicationInfiniteListKey(filter),
      'listInfinite',
    ] as const,
  detail: (id: string) => [...applicationKeys.all, id, 'detail'] as const,
  getKeyManger: () => [...applicationKeys.all, 'key-manager'] as const,
  oauthKeys: (app_id: string) =>
    [...applicationKeys.all, app_id, 'oauth-keys'] as const,
  subscriptions: (applicationId: string) =>
    [...applicationKeys.all, applicationId, 'subscriptions'] as const,
  throttlingPolicies: () =>
    [...applicationKeys.all, 'throttling-policies'] as const,
}

export function useGetAllApplications(filter: Filter) {
  return useQuery({
    queryKey: applicationKeys.list(filter),
    queryFn: () => applicationApi.getAll(filter),
  })
}

export function useGetKeyManger() {
  return useQuery({
    queryKey: applicationKeys.getKeyManger(),
    queryFn: () => applicationApi.getKeyManger(),
  })
}

export function useGetOauthKeys(app_id: string) {
  return useQuery({
    queryKey: applicationKeys.oauthKeys(app_id),
    queryFn: () => applicationApi.getOauthKey(app_id),
    enabled: !!app_id,
  })
}

export function useGetAllApplicationsInfinite(
  filter: ApplicationInfiniteFilter
) {
  return useInfiniteQuery({
    queryKey: applicationKeys.listInfinite(filter),
    queryFn: ({ pageParam }) => {
      const { limit: _limit, offset: _offset, ...listFilter } = filter
      const safeInitialLimit = Math.max(
        APPLICATION_LIST_INITIAL_PAGE_SIZE,
        Math.floor(filter.limit)
      )
      const limit =
        pageParam === 0 ? safeInitialLimit : APPLICATION_LIST_PAGE_SIZE
      return applicationApi.getAllWithApiStatus({
        ...listFilter,
        offset: pageParam,
        limit,
      })
    },
    initialPageParam: filter.offset ?? 0,
    getNextPageParam: (lastPage) => {
      const { offset, limit: l, total } = lastPage.data.pagination
      const nextOffset = offset + l
      return nextOffset < total ? nextOffset : undefined
    },
  })
}

export function useGetApplication(id: string) {
  return useQuery({
    queryKey: applicationKeys.detail(id),
    queryFn: () => applicationApi.getDetail(id),
    enabled: !!id,
  })
}

export function useGetAllSubscriptions(applicationId: string) {
  return useQuery({
    queryKey: applicationKeys.subscriptions(applicationId),
    queryFn: () => applicationApi.getSubscriptions(applicationId),
    enabled: !!applicationId,
  })
}

export function useGetAllThrottlingPolicies() {
  return useQuery({
    queryKey: applicationKeys.throttlingPolicies(),
    queryFn: () => applicationApi.getAllThrottlingPolicies(),
  })
}
