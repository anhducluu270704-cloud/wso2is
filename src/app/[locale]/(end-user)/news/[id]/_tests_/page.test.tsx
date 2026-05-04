import { render, screen } from '@testing-library/react'

import NewsDetailPage, {
  generateMetadata,
} from '../page'

import { getTranslations } from 'next-intl/server'

jest.mock('@/components/news/detail', () => ({
  __esModule: true,
  default: jest.fn(({ id }: { id: string }) => (
    <div data-testid="news-detail" data-id={id} />
  )),
}))

jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(),
}))

describe('app/[locale]/(end-user)/news/[id]/page', () => {
  const NewsDetailWrapper = jest.requireMock('@/components/news/detail').default

  beforeEach(() => {
    NewsDetailWrapper.mockClear()
  })

  it('generateMetadata: returns title/description for news detail', async () => {
    ;(getTranslations as jest.Mock).mockResolvedValue((k: string) => `t:${k}`)

    const meta = await generateMetadata()
    expect(meta).toEqual({
      title: 't:news',
      description: '',
    })
  })

  it('NewsDetailPage: passes params.id to NewsDetailWrapper', async () => {
    const element = await NewsDetailPage({
      params: Promise.resolve({ id: '2' }),
    })

    render(element as any)

    const el = screen.getByTestId('news-detail')
    expect(el).toHaveAttribute('data-id', '2')
    const firstCallProps = NewsDetailWrapper.mock.calls[0]?.[0]
    expect(firstCallProps).toEqual(expect.objectContaining({ id: '2' }))
  })
})

