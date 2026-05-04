'use client'

import { useMemo } from 'react'
import type { FaqCategory } from '@/services/support/support.schema'
import EUPageLayout from '@/share/layout/end-user/page'
import { useTranslations } from 'next-intl'
import SearchInput from '@/share/components/input/search'
import { useFilter } from '@/providers/filter-provider'
import { SupportContact } from './contact'
import { SupportEmptyState } from './empty-state'
import { FaqList } from './faq'
import { useGetSupportList } from '@/services/support/support.query-options'

function filterFaqCategories(
  categories: FaqCategory[],
  keyword: string | undefined,
): FaqCategory[] {
  const kw = (keyword ?? '').trim().toLowerCase()
  if (!kw) {
    return categories.filter((c) => c.faqArticle.length > 0)
  }

  return categories
    .map((c) => ({
      ...c,
      faqArticle: c.faqArticle.filter((a) =>
        [
          a.articleTitleEn,
          a.articleTitleVi,
          a.descriptionEn,
          a.descriptionVi,
        ].some((t) => t.toLowerCase().includes(kw)),
      ),
    }))
    .filter((c) => c.faqArticle.length > 0)
}

export default function SupportWrapper() {
  const t = useTranslations('support')
  const { filter, onSearchChange } = useFilter()
  const { data, isPending } = useGetSupportList(filter)

  const keywordTrimmed = (filter.keyword ?? '').trim()

  const categories = useMemo(
    () =>
      filterFaqCategories(data?.data.list ?? [], keywordTrimmed || undefined),
    [data?.data.list, keywordTrimmed],
  )

  const showSearchEmpty =
    keywordTrimmed.length > 0 &&
    categories.length === 0 &&
    !isPending

  return (
    <EUPageLayout
      title={t('page.title')}
      headerImageSrc="/images/api-products/banner-apiProduct.png"
      background="bg-apiproduct-listing-ver md:bg-apiproduct-listing-hor"
    >
      <div className="container mx-auto flex flex-col gap-8 py-16">
        <SearchInput
          value={filter.keyword ?? ''}
          onChange={onSearchChange}
          placeholder={t('page.search_placeholder')}
          size="lg"
          className=" bg-transparent!"
        />
        {showSearchEmpty ? (
          <SupportEmptyState searchQuery={keywordTrimmed} />
        ) : (
          <FaqList categories={categories} />
        )}
      </div>
      <SupportContact />
    </EUPageLayout>
  )
}
