'use client'

import { useFilter } from '@/providers/filter-provider'
import EUPageLayout from '@/share/layout/end-user/page'
import SearchInput from '@/share/components/input/search'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { SupportEmptyState } from '@/components/support/empty-state'
import { GuideMainPanel } from './guide-content'
import { GuideSidebar, flatGuideNavIds } from './guide-sidebar'
import { filterGuideNavGroups } from './hook'
import { buildGuideNavGroupsFromCategories } from '@/util/guide-nav'
import {
  useGetGuideCategories,
  useGetGuideDocuments,
} from '@/services/support/support.query-options'

export default function GuideWrapper() {
  const t = useTranslations('support.guide')
  const searchParams = useSearchParams()
  const { filter, onSearchChange, updateParam } = useFilter()

  const { data: categoriesRes, isPending: categoriesPending } =
    useGetGuideCategories()
  const categoryTree = categoriesRes?.data ?? []

  const activeFromUrl = searchParams.get('active')

  const searchTrimmed = (filter.keyword ?? '').trim()
  const keyword = searchTrimmed.toLowerCase()

  const baseGroups = useMemo(
    () => buildGuideNavGroupsFromCategories(categoryTree),
    [categoryTree],
  )

  const filteredGroups = useMemo(
    () => filterGuideNavGroups(baseGroups, keyword),
    [baseGroups, keyword],
  )

  const hasSearchNoResults =
    searchTrimmed.length > 0 &&
    filteredGroups.length === 0 &&
    !categoriesPending

  const flatVisibleIds = useMemo(
    () => flatGuideNavIds(filteredGroups),
    [filteredGroups],
  )

  const activeId = useMemo(() => {
    if (flatVisibleIds.length === 0) return ''
    if (activeFromUrl && flatVisibleIds.includes(activeFromUrl)) {
      return activeFromUrl
    }
    return flatVisibleIds[0]
  }, [activeFromUrl, flatVisibleIds])

  const { data: docsRes, isPending: docsPending } = useGetGuideDocuments(
    activeId,
    filter,
  )

  const documents = useMemo(() => {
    const list = docsRes?.data.list ?? []
    return [...list].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
  }, [docsRes?.data.list])

  return (
    <EUPageLayout
      title={t('page.title')}
      headerImageSrc="/images/support/banner-guide.png"
      breadcrumbTrail={[{ label: t('page.title') }]}
    >
      <div className="bg-grey-11 flex flex-1 flex-col">
        <div className="container mx-auto bg-grey-11 flex flex-col gap-15 px-4 py-10 md:py-20">
          <SearchInput
            value={filter.keyword ?? ''}
            onChange={onSearchChange}
            placeholder={t('page.search_placeholder')}
            size="lg"
            className=" bg-transparent!"
          />

          {hasSearchNoResults ? (
            <SupportEmptyState searchQuery={searchTrimmed} />
          ) : (
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
              <GuideSidebar
                groups={filteredGroups}
                activeId={activeId}
                onSelect={(id) => updateParam('active', id)}
                sidebarAriaLabel={t('page.title')}
              />

              <GuideMainPanel
                documents={documents}
                isLoading={Boolean(activeId) && docsPending}
              />
            </div>
          )}
        </div>
      </div>
    </EUPageLayout>
  )
}
