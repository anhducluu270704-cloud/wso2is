import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { NewsItem } from '@/services/news/news.schema'
import { NewsDetailContent } from '../index'

jest.mock('@/share/icons/icon-button-share.svg', () => ({
  __esModule: true,
  default: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="share-icon" {...props} />
  ),
}))

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}))

jest.mock('@/components/news/container', () => ({
  NewsSectionWrapper: ({ title, children }: any) => (
    <section>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  ),
  NewsSectionCard: ({ item }: any) => <div>Related:{item?.id}</div>,
}))

describe('components/news/detail/content', () => {
  it('hides Related articles when list is empty', () => {
    render(
      <NewsDetailContent
        title="T"
        date="D"
        content="<p>X</p>"
        relatedArticles={[]}
      />,
    )

    expect(screen.getByText('T')).toBeInTheDocument()
    expect(screen.queryByText('Related articles')).not.toBeInTheDocument()
  })

  it('renders article, copy-link button and related articles', async () => {
    const related: NewsItem[] = [
      {
        id: '1',
        titleEn: 'R1',
        titleVi: 'R1vi',
        categoryEn: '',
        categoryVi: '',
        descriptionEn: '',
        descriptionVi: '',
        imageUrl: '/1.png',
        createDate: '2026-01-01T00:00:00.000Z',
      },
      {
        id: '2',
        titleEn: 'R2',
        titleVi: 'R2vi',
        categoryEn: '',
        categoryVi: '',
        descriptionEn: '',
        descriptionVi: '',
        imageUrl: '/2.png',
        createDate: '2026-01-01T00:00:00.000Z',
      },
    ]
    render(
      <NewsDetailContent
        title="My title"
        date="D"
        content="<span>C</span>"
        relatedArticles={related}
      />,
    )

    expect(screen.getByText('My title')).toBeInTheDocument()
    expect(screen.getByText('D')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /copy page url/i }),
    ).toBeInTheDocument()
    expect(screen.getByTestId('share-icon')).toBeInTheDocument()
    expect(screen.getByText('Related articles')).toBeInTheDocument()
    expect(screen.getByText('Related:1')).toBeInTheDocument()
    expect(screen.getByText('Related:2')).toBeInTheDocument()

    Object.assign(navigator, {
      clipboard: { writeText: jest.fn(() => Promise.resolve()) },
    })

    await userEvent.click(screen.getByRole('button', { name: /copy/i }))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      window.location.href,
    )
  })
})
