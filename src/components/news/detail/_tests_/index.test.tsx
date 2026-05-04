
import React from 'react'
import { render, screen } from '@testing-library/react'
import type { NewsHighlightItem } from '@/services/news/news.schema'

import NewsDetailWrapper from '../index'
import {
  useGetHighlights,
  useGetNewsDetail,
} from '@/services/news/news.query-options'

jest.mock('@/services/news/news.query-options', () => ({
  ...jest.requireActual('@/services/news/news.query-options'),
  useGetNewsDetail: jest.fn(),
  useGetHighlights: jest.fn(),
}))

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
  useLocale: () => 'en',
}))

jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}))

jest.mock('@/share/layout/end-user/page', () => ({
  __esModule: true,
  default: ({ title, breadcrumbTrail, children }: Record<string, unknown>) => (
    <div>
      <div>EUPageLayout:{String(title ?? '')}</div>
      <div>Breadcrumb:{(breadcrumbTrail as { length?: number })?.length ?? 0}</div>
      <div>{children}</div>
    </div>
  ),
}))

jest.mock('../content', () => ({
  NewsDetailContent: ({
    title,
    date,
  }: {
    title: string
    date: string
  }) => (
    <div>
      Content:{title}:{date}
    </div>
  ),
}))

const mockArticle: NewsHighlightItem = {
  id: 'detail-uuid-1',
  thumbnailUrl: 'https://cdn.example/header.png',
  articleTitleVi: 'Tiêu đề VI',
  articleTitleEn: 'English title',
  categoryEn: 'Cat EN',
  categoryVi: 'Cat VI',
  descriptionEn: 'Body EN',
  descriptionVi: 'Body VI',
  createdAt: '2026-05-02T08:11:47.766+00:00',
}

const mockDetail = jest.mocked(useGetNewsDetail)
const mockHighlights = jest.mocked(useGetHighlights)

describe('components/news/detail', () => {
  beforeEach(() => {
    mockDetail.mockReturnValue({
      data: {
        code: '200',
        message: 'Success',
        data: mockArticle,
      },
      isPending: false,
      isError: false,
      isFetched: true,
      status: 'success',
      fetchStatus: 'idle',
    } as unknown as ReturnType<typeof useGetNewsDetail>)

    mockHighlights.mockReturnValue({
      data: { code: '200', message: 'Success', data: [] },
      isPending: false,
      isError: false,
      isFetched: true,
      status: 'success',
      fetchStatus: 'idle',
    } as unknown as ReturnType<typeof useGetHighlights>)
  })

  it('loads article from detail query and renders content', () => {
    render(<NewsDetailWrapper id={mockArticle.id} />)
    expect(screen.getByText(/^EUPageLayout:/)).toBeInTheDocument()
    expect(screen.getByText('Breadcrumb:2')).toBeInTheDocument()
    expect(
      screen.getByText(/Content:English title:/),
    ).toBeInTheDocument()
  })
})
