'use client'
import { useRouter } from '@/i18n/navigation'
import { Filter, FilterSort } from '@/models/api/common'
import { serializeSort } from '@/util/filter'
import { SortingState, Updater } from '@tanstack/react-table'
import { useSearchParams } from 'next/navigation'
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react'

interface FilterContextType {
  filter: Filter
  onSortChange: (sort?: FilterSort) => void
  onSearchChange: (keyword?: string) => void
  updateParam: (key: string, value?: string) => void
  table: {
    sortState?: SortingState
    updateSortState: (update: Updater<SortingState>) => void
  }
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

type FilterProviderProps = Readonly<{
  children: React.ReactNode
  filter: Filter
}>

export const FilterProvider: React.FC<FilterProviderProps> = ({
  children,
  filter,
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const sortTable: SortingState | undefined = useMemo(
    () =>
      filter.sort
        ? [{ id: filter.sort.name, desc: filter.sort.dir === 'desc' }]
        : undefined,
    [filter.sort]
  )

  const updateParam = useCallback(
    (key: string, value?: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key, value)
      else params.delete(key)
      router.push(`?${params.toString()}`)
    },
    [searchParams, router]
  )

  const onSortChange = useCallback(
    (sort?: FilterSort) => {
      const sortParse = serializeSort(sort)
      updateParam('sort', sortParse)
    },
    [updateParam]
  )

  const onSearchChange = useCallback(
    (keyword?: string) => {
      updateParam('keyword', keyword)
    },
    [updateParam]
  )

  const updateSortState = useCallback(
    (updater: Updater<SortingState>) => {
      const prevSortState = filter.sort
        ? [{ id: filter.sort.name, desc: filter.sort.dir === 'desc' }]
        : []
      const nextSort = (
        typeof updater === 'function' ? updater(prevSortState) : updater
      )[0]

      onSortChange(
        nextSort
          ? { name: nextSort.id, dir: nextSort.desc ? 'desc' : 'asc' }
          : undefined
      )
    },
    [filter.sort, onSortChange]
  )

  const value = useMemo(
    () => ({
      filter,
      onSearchChange,
      onSortChange,
      updateParam,
      table: {
        sortState: sortTable,
        updateSortState,
      },
    }),
    [
      filter,
      onSearchChange,
      onSortChange,
      sortTable,
      updateParam,
      updateSortState,
    ]
  )

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  )
}

export const useFilter = () => {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider')
  }
  return context
}
