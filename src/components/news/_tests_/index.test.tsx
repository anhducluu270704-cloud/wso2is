import React from 'react'
import { render, screen } from '@testing-library/react'
import NewsWrapper from '../index'

const ARTICLE_SHAPE = (
  id: string,
): {
  id: string
  thumbnailUrl: string
  articleTitleVi: string
  articleTitleEn: string
  categoryEn: string
  categoryVi: string
  descriptionEn: string
  descriptionVi: string
  createdAt: string
} => ({
  id,
  thumbnailUrl: '/i.png',
  articleTitleVi: 'Vi',
  articleTitleEn: 'En',
  categoryEn: 'Ce',
  categoryVi: 'Cv',
  descriptionEn: 'De',
  descriptionVi: 'Dv',
  createdAt: '2026-01-01T00:00:00.000Z',
})

const mockUseQueries = jest.fn()

jest.mock('@tanstack/react-query', () => {
  const actual = jest.requireActual<
    typeof import('@tanstack/react-query')
  >('@tanstack/react-query')

  return {
    ...actual,
    useQueries: (...args: unknown[]) => mockUseQueries(...args),
  }
})

jest.mock('@/services/news/news.query-options', () => {
  const actual = jest.requireActual<
    typeof import('@/services/news/news.query-options')
  >('@/services/news/news.query-options')

  return {
    ...actual,
    useGetHighlights: () => ({
      data: {
        message: 'ok',
        code: '200',
        data: Array.from({ length: 5 }, (_, i) => ({
          id: `h-${i}`,
          thumbnailUrl: '/i.png',
          articleTitleVi: 'Vi',
          articleTitleEn: 'En',
          categoryEn: 'Ce',
          categoryVi: 'Cv',
          descriptionEn: 'De',
          descriptionVi: 'Dv',
          createdAt: '2026-01-01T00:00:00.000Z',
        })),
      },
      isPending: false,
    }),
    useGetNewsCategories: () => ({
      data: {
        message: 'ok',
        code: '200',
        data: [
          {
            categoryId: 'cat-success',
            categoryNameEn: 'Section A EN',
            categoryNameVi: 'Mục A',
          },
          {
            categoryId: 'cat-latest',
            categoryNameEn: 'Section B EN',
            categoryNameVi: 'Mục B',
          },
        ],
      },
      isPending: false,
      isSuccess: true,
    }),
  }
})

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
  useLocale: () => 'en',
}))

jest.mock('@/share/layout/end-user/page', () => ({
  __esModule: true,
  default: ({ title, children }: { title?: string; children?: React.ReactNode }) => (
    <div>
      <div>EUPageLayout:{title}</div>
      <div>{children}</div>
    </div>
  ),
}))

jest.mock('@/components/news/highlights', () => ({
  NewsHighlights: ({ items }: { items?: unknown[] }) => (
    <div>Highlights:{items?.length}</div>
  ),
}))

jest.mock('@/components/news/container', () => ({
  NewsSectionWrapper: ({
    title,
    children,
  }: {
    title: string
    children: React.ReactNode
  }) => (
    <section>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  ),
  NewsSectionCard: ({ item }: { item?: { id: string } }) => (
    <div>Card:{item?.id}</div>
  ),
}))

describe('components/news', () => {
  beforeEach(() => {
    mockUseQueries.mockImplementation(({ queries }: { queries: unknown[] }) =>
      queries.map(() => ({
        data: {
          message: 'ok',
          code: '200',
          data: {
            count: 2,
            list: [ARTICLE_SHAPE('item-1'), ARTICLE_SHAPE('item-2')],
            pagination: { limit: 6, offset: 0, total: 10 },
          },
        },
        isPending: false,
      })),
    )
  })

  it('renders page layout and respects limit for sections', () => {
    render(<NewsWrapper limit={2} />)

    expect(screen.getByText('EUPageLayout:news')).toBeInTheDocument()
    expect(screen.getByText('Highlights:5')).toBeInTheDocument()

    expect(screen.getByRole('heading', { name: 'Section A EN' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Section B EN' })).toBeInTheDocument()

    expect(screen.getAllByText(/^Card:/)).toHaveLength(4)
  })

  it('uses default locale labels and renders cards when data ready', () => {
    render(<NewsWrapper />)
    expect(screen.getAllByText(/^Card:/).length).toBeGreaterThan(0)
  })
})
