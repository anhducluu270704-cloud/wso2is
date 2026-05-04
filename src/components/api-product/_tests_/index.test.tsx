import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ApiProductWrapper from '../index'
import { ALL_CATEGORY } from '@/constants/api-product'

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ replace: jest.fn() }),
}))
jest.mock('next-intl', () => ({ useTranslations: () => (k: string) => k }))
let mockFilter = { keyword: '', category: undefined as string | undefined }
const mockUpdateParam = jest.fn()
const mockOnSearchChange = jest.fn()
jest.mock('@/providers/filter-provider', () => ({
  useFilter: () => ({
    filter: mockFilter,
    updateParam: mockUpdateParam,
    onSearchChange: mockOnSearchChange,
  }),
}))
const mockUseGetApiProductCategories = jest.fn()
const mockUseGetAllApiProductsInfinite = jest.fn()
jest.mock('@/services/api-product/apiProduct.query-options', () => ({
  useGetApiProductCategories: (...args: unknown[]) =>
    mockUseGetApiProductCategories(...args),
  useGetAllApiProductsInfinite: (...args: unknown[]) =>
    mockUseGetAllApiProductsInfinite(...args),
}))
jest.mock('@/share/components/full-page/loading', () => ({
  __esModule: true,
  default: () => <div>Loading</div>,
}))
jest.mock('@/share/layout/end-user/page', () => ({
  __esModule: true,
  default: ({ children, title }: any) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
}))
jest.mock('@/share/components/input/search', () => ({
  __esModule: true,
  default: ({ onFocus }: any) => (
    <input placeholder="search" onFocus={onFocus} />
  ),
}))
jest.mock('@/share/ui/button', () => ({
  Button: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
}))
jest.mock('@/share/components/full-page/404', () => ({
  __esModule: true,
  default: () => <div>404</div>,
}))
jest.mock('../product-list', () => ({
  ProductList: () => <div>ProductList</div>,
}))
jest.mock('@/share/ui/spinner', () => ({
  SpinnerCustom: () => <div>Spinner</div>,
}))

const defaultCategories = () => ({
  data: { data: { list: [{ name: 'Cat1' }, { name: 'Cat2' }] } },
  isFetching: false,
  isError: false,
})
const defaultProducts = () => ({
  data: {
    pages: [
      {
        data: {
          list: [
            {
              id: '1',
              name: 'API1',
              description: '',
              context: '',
              version: '',
              provider: '',
              status: 'PUBLISHED',
              thumbnailUrl: null,
            },
          ],
          count: 1,
          countActive: 1,
          pagination: { limit: 10, total: 1, offset: 0, next: '', previous: '' },
        },
      },
    ],
  },
  isFetching: false,
  isFetchingNextPage: false,
  isError: false,
  isSuccess: true,
  hasNextPage: false,
  fetchNextPage: jest.fn(),
})

describe('api-product/index', () => {
  beforeEach(() => {
    mockFilter = { keyword: '', category: undefined }
    mockUpdateParam.mockClear()
    mockOnSearchChange.mockClear()
    mockUseGetApiProductCategories.mockImplementation(defaultCategories)
    mockUseGetAllApiProductsInfinite.mockImplementation(defaultProducts)
  })

  it('render ApiProductWrapper khi success', () => {
    render(<ApiProductWrapper />)
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('ProductList')).toBeInTheDocument()
  })

  it('render Loading khi isFetchingCategories', () => {
    mockUseGetApiProductCategories.mockReturnValue({
      data: null,
      isFetching: true,
      isError: false,
    })
    render(<ApiProductWrapper />)
    expect(screen.getByText('Loading')).toBeInTheDocument()
  })

  it('render 404 khi isError', () => {
    mockUseGetAllApiProductsInfinite.mockReturnValue({
      data: null,
      isFetching: false,
      isError: true,
      isSuccess: false,
    })
    render(<ApiProductWrapper />)
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('focus search không làm vỡ render', async () => {
    render(<ApiProductWrapper />)
    await userEvent.click(screen.getByPlaceholderText('search'))
    expect(screen.getByText('ProductList')).toBeInTheDocument()
  })

  it('click category gọi updateParam', async () => {
    mockFilter = { keyword: '', category: 'Cat1' }
    render(<ApiProductWrapper />)

    await userEvent.click(screen.getByText('Cat1'))

    expect(mockUpdateParam).toHaveBeenCalledWith('category', 'Cat1')
  })

  it('render ProductList khi fetch success nhưng không có dữ liệu', () => {
    mockFilter = { keyword: 'loan', category: 'Retail' }
    mockUseGetAllApiProductsInfinite.mockReturnValue({
      data: {
        pages: [
          {
            data: {
              list: [],
              count: 0,
              countActive: 0,
              pagination: {
                limit: 10,
                total: 0,
                offset: 0,
                next: '',
                previous: '',
              },
            },
          },
        ],
      },
      isFetching: false,
      isFetchingNextPage: false,
      isError: false,
      isSuccess: true,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
    })

    render(<ApiProductWrapper />)

    expect(screen.getByText('ProductList')).toBeInTheDocument()
  })

  it('render 404 khi categories lỗi', () => {
    mockUseGetApiProductCategories.mockReturnValue({
      data: null,
      isFetching: false,
      isError: true,
    })
    render(<ApiProductWrapper />)
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('vẫn render ProductList khi category = ALL_CATEGORY', () => {
    mockFilter = { keyword: undefined, category: ALL_CATEGORY }
    mockUseGetAllApiProductsInfinite.mockReturnValue({
      data: {
        pages: [
          {
            data: {
              list: [],
              count: 0,
              countActive: 0,
              pagination: {
                limit: 10,
                total: 0,
                offset: 0,
                next: '',
                previous: '',
              },
            },
          },
        ],
      },
      isFetching: false,
      isFetchingNextPage: false,
      isError: false,
      isSuccess: true,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
    })

    render(<ApiProductWrapper />)

    expect(screen.getByText('ProductList')).toBeInTheDocument()
  })
})
