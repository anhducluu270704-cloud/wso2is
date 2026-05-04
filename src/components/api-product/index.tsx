'use client'

import { useFilter } from '@/providers/filter-provider'
import {
  useGetAllApiProductsInfinite,
  useGetApiProductCategories,
} from '@/services/api-product/apiProduct.query-options'
import LoadingPage from '@/share/components/full-page/loading'
import SearchInput from '@/share/components/input/search'
import EUPageLayout from '@/share/layout/end-user/page'
import { SpinnerCustom } from '@/share/ui/spinner'
import { useTranslations } from 'next-intl'
import NotFound404 from '../../share/components/full-page/404'
import { visibleGridsCount } from '@/util'
import { ProductList } from './product-list'
import { ProductListFilter } from './product-list/filter'
import { ITEMS_PER_PAGE } from '@/constants/api-product'

export default function ApiProductWrapper() {
  const t = useTranslations('api_product')
  const { filter, updateParam, onSearchChange } = useFilter()

  const {
    data: categoriesData,
    isFetching: isFetchingCategories,
    isError: isErrorCategories,
  } = useGetApiProductCategories()

  const productsQuery = useGetAllApiProductsInfinite(filter)
  const {
    data: apiProductsData,
    isFetching,
    isError,
    isSuccess,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = productsQuery

  const visibleResultCount = visibleGridsCount(
    apiProductsData,
    filter.limit,
    ITEMS_PER_PAGE
  )

  if (isFetchingCategories) {
    return <LoadingPage />
  }

  if (isError || isErrorCategories) {
    return <NotFound404 />
  }

  return (
    <EUPageLayout
      title={t('title')}
      headerImageSrc="/images/api-products/banner-apiProduct.png"
      background="bg-apiproduct-listing-ver md:bg-apiproduct-listing-hor"
    >
      <div className="container mx-auto flex flex-1 flex-col gap-8 py-16">
        <div className="flex flex-wrap items-center justify-between gap-4 md:gap-15">
          <ProductListFilter
            filter={filter}
            updateParam={updateParam}
            categoriesData={categoriesData?.data.list ?? []}
          />
          <div className="flex-1 md:max-w-[305px]">
            <SearchInput
              value={filter.keyword}
              onChange={onSearchChange}
              placeholder={t('filter.search_placeholder')}
            />
          </div>
        </div>
        {visibleResultCount > 0 && (
          <div className="flex items-center gap-2">
            <p className="text-body-body">
              <span className="text-black-1">{visibleResultCount}</span>{' '}
              <span className="text-grey-6">
                {t('list.result_count_label')}
              </span>
            </p>
          </div>
        )}
        {isFetching && !apiProductsData && (
          <div className="flex flex-1 justify-center items-center">
            <SpinnerCustom />
          </div>
        )}
        {isSuccess && (
          <ProductList
            products={apiProductsData.pages.flatMap((page) => page.data.list)}
            limitPerPage={filter.limit}
            defaultPageSize={ITEMS_PER_PAGE}
            searchQuery={filter.keyword}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          />
        )}
      </div>
    </EUPageLayout>
  )
}
