
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { NewsItem } from '@/services/news/news.schema'
import { HighlightBlock2Items } from '../index'

jest.mock('../card', () => ({
  HighlightHorizontalCard: ({ item }: { item: NewsItem }) => (
    <div>H:{item.id}</div>
  ),
}))

const mk = (id: string, titleEn: string): NewsItem => ({
  id,
  titleEn,
  titleVi: `${titleEn}v`,
  categoryEn: '',
  categoryVi: '',
  descriptionEn: '',
  descriptionVi: '',
  imageUrl: '',
  createDate: '2026-01-01T00:00:00.000Z',
})

describe('news/highlights/block-2-items', () => {
  it('renders list of horizontal cards', () => {
    render(
      <HighlightBlock2Items
        items={[mk('h1', 't1'), mk('h2', 't2')]}
      />
    )
    expect(screen.getByText('H:h1')).toBeInTheDocument()
    expect(screen.getByText('H:h2')).toBeInTheDocument()
  })
})
