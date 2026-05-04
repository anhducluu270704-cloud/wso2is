'use client'

import { cn } from '@/share/lib/utils'
import { useTranslations } from 'next-intl'
import { PaginationGrid } from '../pagination/grid'
import { usePaginationGrid } from '../pagination/hook'
import type { ReactNode } from 'react'
import { ListGridEmptyState } from './empty-state'

export type { ListGridEmptyStateProps } from './empty-state'
export { ListGridEmptyState } from './empty-state'

export type ListGridProps = {
  elements: ReactNode[]
  limitPerPage: number
  defaultPageSize: number
  searchQuery?: string
  className?: string
  syncLimitToUrl?: boolean
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
}

function ListGridEmptyBlock({ searchQuery }: Readonly<{ searchQuery?: string }>) {
  const t = useTranslations('common')
  return (
    <ListGridEmptyState
      searchQuery={searchQuery}
      searchLine={
        searchQuery
          ? t('empty.search', { value: searchQuery })
          : undefined
      }
      noProductsTitle={t('empty.no_products_title')}
      noProductsDescription={t('empty.no_products_description')}
    />
  )
}

export function ListGrid(props: Readonly<ListGridProps>) {
  if (props.elements.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        <ListGridEmptyBlock searchQuery={props.searchQuery} />
      </div>
    )
  }
  return <ListGridWithPagination {...props} />
}

function ListGridWithPagination({
  elements,
  limitPerPage,
  defaultPageSize,
  className,
  syncLimitToUrl = true,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: Readonly<ListGridProps>) {
  const basePageSize = Math.max(1, defaultPageSize)
  const initialVisibleCount = Math.max(basePageSize, limitPerPage)

  const paging = usePaginationGrid({
    loadedItemCount: elements.length,
    defaultPageSize: basePageSize,
    initialVisibleCount,
    loadMoreChunkSize: Math.max(1, Math.floor(basePageSize / 2)),
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    syncLimitToUrl,
  })

  return (
    <div className="flex flex-col gap-6">
      <div
        className={cn(
          'grid',
          className ??
            'grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        )}
      >
        {elements.slice(0, paging.visibleCount)}
      </div>
      <PaginationGrid
        hasLoadMore={paging.hasLoadMore}
        isFetchingNextPage={paging.isFetchingNextPage}
        onLoadMore={paging.onLoadMore}
        onLoadLess={paging.onLoadLess}
      />
    </div>
  )
}
