
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { NewsItem } from '@/services/news/news.schema'
import { HighlightBlock3Items } from '../index'

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

function mkNews(id: string, titleEn: string): NewsItem {
  return {
    id,
    titleEn,
    titleVi: `${titleEn}v`,
    categoryEn: '',
    categoryVi: '',
    descriptionEn: '',
    descriptionVi: '',
    imageUrl: `/i${id}.png`,
    createDate: '2026-01-01T00:00:00.000Z',
  }
}

describe('news/highlights/block-3-items', () => {
  beforeEach(() => onClick.mockClear())

  it('renders grid cards and triggers click', async () => {
    const user = userEvent.setup()
    render(
      <HighlightBlock3Items
        items={[
          mkNews('1', 'T1'),
          mkNews('2', 'T2'),
          mkNews('3', 'T3'),
        ]}
      />
    )
    expect(screen.getByText('T1')).toBeInTheDocument()
    await user.click(screen.getAllByRole('button')[0])
    expect(onClick).toHaveBeenCalled()
  })
})
