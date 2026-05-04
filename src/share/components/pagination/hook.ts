'use client'

import { useMemo, useState } from 'react'
import { useVisibleCountUrlSync } from '@/share/hooks/use-visible-count-url'

type InfinitePage<Item> = {
  data?: {
    list?: Item[]
  }
}

type InfiniteDataLike<Item> = {
  pages?: InfinitePage<Item>[]
}

type InfiniteWindowOptions = {
  isSuccess: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean
  fetchNextPage: () => void
  defaultPageSize: number
  loadMoreChunkSize: number
}

type GridPaginationOptions = {
  loadedItemCount: number
  defaultPageSize: number
  initialVisibleCount?: number
  loadMoreChunkSize: number
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  syncLimitToUrl?: boolean
}

const flattenPages = <Item>(data?: InfiniteDataLike<Item>): Item[] => {
  if (!data?.pages?.length) return []
  return data.pages.flatMap((page) => page?.data?.list ?? [])
}

export function useInfiniteListWindow<Item>(
  data: InfiniteDataLike<Item> | undefined,
  options: InfiniteWindowOptions
) {
  const {
    isSuccess,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    defaultPageSize,
    loadMoreChunkSize,
  } = options

  const allLoaded = useMemo(() => flattenPages<Item>(data), [data])
  const [visibleCount, setVisibleCount] = useState(defaultPageSize)

  const displayedItems = useMemo(
    () => allLoaded.slice(0, visibleCount),
    [allLoaded, visibleCount]
  )

  const onLoadMore = () => {
    const nextVisibleCount = visibleCount + loadMoreChunkSize
    if (
      nextVisibleCount > allLoaded.length &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage()
    }
    setVisibleCount(nextVisibleCount)
  }

  const handleLoadLess = () => {
    setVisibleCount(defaultPageSize)
  }

  const hasLoadMore =
    isSuccess && (visibleCount < allLoaded.length || hasNextPage)
  const hasLoadLess =
    isSuccess && !hasLoadMore && visibleCount > defaultPageSize
  const onLoadLess = hasLoadLess ? handleLoadLess : undefined

  return {
    allLoaded,
    displayedItems,
    isFetchingNextPage,
    hasLoadMore,
    hasLoadLess,
    onLoadMore,
    onLoadLess,
  }
}

export function usePaginationGrid(options: GridPaginationOptions) {
  const {
    loadedItemCount,
    defaultPageSize,
    initialVisibleCount,
    loadMoreChunkSize,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    syncLimitToUrl = false,
  } = options
  const { syncVisibleWindowToUrl, resetVisibleCountInUrl } =
    useVisibleCountUrlSync({
      defaultPageSize,
    })

  const [visibleCount, setVisibleCount] = useState(
    initialVisibleCount ?? defaultPageSize
  )

  const onLoadMore = () => {
    const nextVisibleCount = visibleCount + loadMoreChunkSize
    if (
      nextVisibleCount > loadedItemCount &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage()
    }
    setVisibleCount(nextVisibleCount)
    if (syncLimitToUrl) {
      syncVisibleWindowToUrl(nextVisibleCount)
    }
  }

  const hasLoadMore = visibleCount < loadedItemCount || hasNextPage
  const effectiveVisibleCount = Math.min(visibleCount, loadedItemCount)
  const hasLoadLess = !hasLoadMore && effectiveVisibleCount > defaultPageSize
  const onLoadLess = hasLoadLess
    ? () => {
        setVisibleCount(defaultPageSize)
        if (syncLimitToUrl) {
          resetVisibleCountInUrl()
        }
      }
    : undefined

  return {
    visibleCount,
    isFetchingNextPage,
    hasLoadMore,
    hasLoadLess,
    onLoadMore,
    onLoadLess,
  }
}
