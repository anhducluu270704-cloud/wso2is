import { render, screen } from '@testing-library/react'

import NewsPage, { generateMetadata } from '../page'

import { NEWS_ITEMS_PER_SECTION_DEFAULT } from '@/constants/news'

jest.mock('@/components/news', () => ({
  __esModule: true,
  default: jest.fn(({ limit }: { limit: number }) => (
    <div data-testid="news-wrapper" data-limit={limit} />
  )),
}))

jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(),
}))

const { getTranslations } = jest.requireMock('next-intl/server')
const NewsWrapper = jest.requireMock('@/components/news').default as jest.Mock

describe('app/[locale]/(end-user)/news/page', () => {
  beforeEach(() => {
    NewsWrapper.mockClear()
  })

  it('generateMetadata: returns title/description for news', async () => {
    ;(getTranslations as jest.Mock).mockResolvedValue((k: string) => `t:${k}`)

    const meta = await generateMetadata()
    expect(meta).toEqual({
      title: 't:header.news',
      description: '',
    })
  })

  it('NewsPage: uses default limit when query has no limit', async () => {
    const element = await NewsPage({
      searchParams: Promise.resolve({} as any),
    })

    render(element as any)

    const el = screen.getByTestId('news-wrapper')
    expect(el).toHaveAttribute(
      'data-limit',
      String(NEWS_ITEMS_PER_SECTION_DEFAULT),
    )
  })

  it('NewsPage: passes query limit to NewsWrapper', async () => {
    const limit = 5

    const element = await NewsPage({
      searchParams: Promise.resolve({ limit } as any),
    })

    render(element as any)

    const el = screen.getByTestId('news-wrapper')
    expect(el).toHaveAttribute('data-limit', String(limit))
    const firstCallProps = NewsWrapper.mock.calls[0]?.[0]
    expect(firstCallProps).toEqual(expect.objectContaining({ limit }))
  })
})

