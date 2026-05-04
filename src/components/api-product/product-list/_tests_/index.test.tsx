import React from 'react'
import { render, screen } from '@testing-library/react'
import { ProductList } from '../index'
import type { ProductListProps } from '../index'
import { MOCK_API_PRODUCT_LIST_RESPONSE } from '@/_tests_/mocks'

jest.mock('@/components/api-product/card', () => ({
  ProductCard: ({ product }: any) => <div>Card: {product?.name}</div>,
}))
const mockListGrid = jest.fn(() => <div>ListGrid</div>)
jest.mock('@/share/components/list-grid', () => ({
  ListGrid: (props: any) => mockListGrid(props),
}))

const defaultProps = () =>
  ({
    products: MOCK_API_PRODUCT_LIST_RESPONSE.data.list,
    limitPerPage: 10,
    defaultPageSize: 10,
    searchQuery: 'loan',
    hasNextPage: true,
    isFetchingNextPage: false,
    fetchNextPage: jest.fn(),
  }) as ProductListProps

describe('api-product/product-list', () => {
  beforeEach(() => {
    mockListGrid.mockClear()
  })

  it('render ProductList với data', () => {
    render(<ProductList {...defaultProps()} />)
    expect(screen.getByText('ListGrid')).toBeInTheDocument()
    const call = mockListGrid.mock.calls[0]?.[0]
    expect(call.elements).toHaveLength(defaultProps().products.length)
  })

  it('truyền props đúng vào ListGrid', () => {
    render(<ProductList {...defaultProps()} />)
    expect(mockListGrid).toHaveBeenCalledWith(
      expect.objectContaining({
        limitPerPage: 10,
        defaultPageSize: 10,
        searchQuery: 'loan',
        hasNextPage: true,
        isFetchingNextPage: false,
        fetchNextPage: expect.any(Function),
      })
    )
  })
})
