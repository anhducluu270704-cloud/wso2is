'use client'

import { GetApiProductResponse } from '@/services/api-product/apiProduct.schema'
import { ListGrid } from '@/share/components/list-grid'
import { ProductCard } from '../card'

export interface ProductListProps {
  products: GetApiProductResponse[]
  limitPerPage: number
  defaultPageSize: number
  searchQuery?: string
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
}

export function ProductList({
  products,
  limitPerPage,
  defaultPageSize,
  searchQuery,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: Readonly<ProductListProps>) {
  return (
    <ListGrid
      elements={products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      limitPerPage={limitPerPage}
      defaultPageSize={defaultPageSize}
      searchQuery={searchQuery}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
    />
  )
}
