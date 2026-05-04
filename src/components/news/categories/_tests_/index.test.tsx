import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ITEMS_PER_PAGE } from '@/constants/news'
import type { NewsArticleItem, NewsItem } from '@/services/news/news.schema'
import NewsCategories from '../index'
import {
  useGetNewsByCategory,
  useGetNewsCategories,
} from '@/services/news/news.query-options'

jest.mock('@/services/news/news.query-options', () => ({
  ...jest.requireActual('@/services/news/news.query-options'),
  useGetNewsCategories: jest.fn(),
  useGetNewsByCategory: jest.fn(),
}))

const mockCats = jest.mocked(useGetNewsCategories)
const mockList = jest.mocked(useGetNewsByCategory)

const mockPush = jest.fn()
let mockSearchParams = ''

const CAT_ID = 'b7e7eea4-b3ab-42fa-bd6f-2e06b03e3cf4'

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => `/vi/news/category/${CAT_ID}`,
}))

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(mockSearchParams),
}))

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
  useLocale: () => 'en',
}))

jest.mock('@/share/layout/end-user/page', () => ({
  __esModule: true,
  default: ({
    title,
    children,
  }: {
    title: string
    children: React.ReactNode
  }) => (
    <div>
      <div data-testid="eu-title">EUPageLayout:{title}</div>
      <div>{children}</div>
    </div>
  ),
}))

jest.mock('@/components/news/container', () => ({
  NewsSectionCard: ({ item }: { item: NewsItem }) => (
    <div>Card:{item?.id}</div>
  ),
}))

jest.mock('@/share/components/pagination', () => ({
  __esModule: true,
  default: ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
  }) => (
    <nav data-testid="pagination">
      <span data-current={currentPage} data-total={totalPages} />
      <button type="button" onClick={() => onPageChange(currentPage + 1)}>
        Next
      </button>
      <button type="button" onClick={() => onPageChange(currentPage - 1)}>
        Prev
      </button>
    </nav>
  ),
}))

function apiArticle(id: number): NewsArticleItem {
  return {
    id: String(id),
    thumbnailUrl: '/x.png',
    articleTitleVi: `Bài ${id}`,
    articleTitleEn: `Article ${id}`,
    categoryEn: 'Stories',
    categoryVi: 'Chuyện',
    descriptionEn: '',
    descriptionVi: '',
    createdAt: '2025-06-01T00:00:00.000Z',
  }
}

const TEN = Array.from({ length: 10 }, (_, i) => apiArticle(i + 1))

describe('components/news/categories', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockSearchParams = ''
    mockCats.mockReset()
    mockList.mockReset()

    mockCats.mockReturnValue({
      data: {
        message: 'ok',
        code: '200',
        data: [
          {
            categoryId: CAT_ID,
            categoryNameEn: 'News Category EN',
            categoryNameVi: 'Danh mục VI',
          },
        ],
      },
      isPending: false,
      isSuccess: true,
      isError: false,
    } as unknown as ReturnType<typeof useGetNewsCategories>)

    mockList.mockImplementation(
      (
        _: string | undefined,
        qs: { limit: number; offset: number },
      ) =>
        ({
          data: {
            message: 'ok',
            code: '200',
            data: (() => {
              const slice = TEN.slice(qs.offset, qs.offset + qs.limit)
              return {
                count: slice.length,
                list: slice,
                pagination: {
                  limit: qs.limit,
                  total: TEN.length,
                  offset: qs.offset,
                },
              }
            })(),
          },
          isPending: false,
          isError: false,
        }) as unknown as ReturnType<typeof useGetNewsByCategory>,
    )
  })

  it('renders null while categories pending', () => {
    mockCats.mockReturnValue({
      data: undefined,
      isPending: true,
      isSuccess: false,
      isError: false,
    } as unknown as ReturnType<typeof useGetNewsCategories>)

    const { container } = render(<NewsCategories categoryId={CAT_ID} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders null for unknown categoryId after categories loaded', () => {
    mockCats.mockReturnValue({
      data: {
        message: 'ok',
        code: '200',
        data: [],
      },
      isPending: false,
      isSuccess: true,
      isError: false,
    } as unknown as ReturnType<typeof useGetNewsCategories>)

    const { container } = render(<NewsCategories categoryId="unknown-id" />)
    expect(container.firstChild).toBeNull()
  })

  it('renders list and header for known categoryId', () => {
    render(<NewsCategories categoryId={CAT_ID} />)

    expect(screen.getByTestId('eu-title')).toHaveTextContent(
      'EUPageLayout:News Category EN',
    )

    expect(screen.getAllByText(/^Card:/)).toHaveLength(ITEMS_PER_PAGE)
    expect(screen.queryByText(/^Card:10$/)).not.toBeInTheDocument()
  })

  it('shows pagination when more than one page', () => {
    render(<NewsCategories categoryId={CAT_ID} />)

    const pagination = screen.getByTestId('pagination')
    expect(pagination).toBeInTheDocument()
    expect(pagination.querySelector('[data-total]')).toHaveAttribute(
      'data-total',
      '2',
    )
  })

  it('calls router.push when pagination Next is clicked', async () => {
    render(<NewsCategories categoryId={CAT_ID} />)

    await userEvent.click(screen.getByText('Next'))

    expect(mockPush).toHaveBeenCalledWith(
      `/vi/news/category/${CAT_ID}?page=2`,
    )
  })

  it('reflects page from searchParams when provided', () => {
    mockSearchParams = 'page=2'

    render(<NewsCategories categoryId={CAT_ID} />)

    expect(
      screen.getByTestId('pagination').querySelector('[data-current]'),
    ).toHaveAttribute('data-current', '2')

    expect(screen.getAllByText(/^Card:/)).toHaveLength(1)
    expect(screen.getByText(/^Card:10$/)).toBeInTheDocument()
  })
})
