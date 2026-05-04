import { render, screen } from '@testing-library/react'

import NewsCategories from '@/components/news/categories'

jest.mock('@/components/news/categories', () => ({
  __esModule: true,
  default: jest.fn(({ categoryId }: { categoryId: string }) => (
    <div data-testid="news-categories" data-category-id={categoryId} />
  )),
}))

jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(),
}))

const { getTranslations } = jest.requireMock(
  'next-intl/server',
) as typeof import('next-intl/server')

describe('app/[locale]/(end-user)/news/category/[categoryId]/page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getTranslations as jest.Mock).mockResolvedValue((key: string) => `layout.${key}`)
  })

  it('generateMetadata uses layout.news like other concise detail routes', async () => {
    const { generateMetadata } = await import('../page')

    const meta = await generateMetadata()

    expect(meta).toEqual({
      title: 'layout.header.news',
      description: '',
    })
  })

  it('NewsCategoryPage: renders NewsCategories with categoryId', async () => {
    const { default: NewsCategoryPage } = await import('../page')

    const element = await NewsCategoryPage({
      params: Promise.resolve({ categoryId: 'my-cat' }),
    })

    render(element)

    expect(screen.getByTestId('news-categories')).toHaveAttribute(
      'data-category-id',
      'my-cat',
    )
    expect(NewsCategories).toHaveBeenCalledWith(
      expect.objectContaining({ categoryId: 'my-cat' }),
      undefined,
    )
  })
})
