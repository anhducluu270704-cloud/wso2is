
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { NewsItem } from '@/services/news/news.schema'
import { HighlightBlock1Item } from '../index'

jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}))

const onClick = jest.fn()
jest.mock('../../hook/use-highlight-click', () => ({
  useHighlightClick: () => ({ onClick }),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ fill, ...props }: any) => <img {...props} />,
}))

const itemEn: NewsItem = {
  id: 'block1-1',
  titleEn: 'T',
  titleVi: 'V',
  categoryEn: '',
  categoryVi: '',
  descriptionEn: 'D',
  descriptionVi: 'DV',
  imageUrl: '/a.png',
  createDate: '2026-01-01T00:00:00.000Z',
}

describe('news/highlights/block-1-item', () => {
  beforeEach(() => onClick.mockClear())

  it('renders and triggers click', async () => {
    const user = userEvent.setup()
    render(<HighlightBlock1Item item={itemEn} />)
    expect(screen.getByText('T')).toBeInTheDocument()
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalled()
  })
})
