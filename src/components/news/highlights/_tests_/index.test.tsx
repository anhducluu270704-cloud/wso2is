import React from 'react'
import { render, screen } from '@testing-library/react'
import type { NewsItem } from '@/services/news/news.schema'
import { NewsHighlights } from '../index'

jest.mock('../block-1-item', () => ({
  HighlightBlock1Item: () => <div>Block1</div>,
}))
jest.mock('../block-2-items', () => ({
  HighlightBlock2Items: () => <div>Block2</div>,
}))
jest.mock('../block-3-items', () => ({
  HighlightBlock3Items: () => <div>Block3</div>,
}))
jest.mock('../block-4-items', () => ({
  HighlightBlock4Items: () => <div>Block4</div>,
}))

function makeItems(n: number): NewsItem[] {
  return Array.from({ length: n }).map((_, i) => ({
    id: String(i + 1),
    titleEn: `T${i + 1}`,
    titleVi: `V${i + 1}`,
    categoryEn: 'Highlights',
    categoryVi: 'Nổi bật',
    descriptionEn: `D${i + 1}`,
    descriptionVi: `Dv${i + 1}`,
    imageUrl: '/img.png',
    createDate: '2026-06-01T00:00:00.000Z',
  }))
}

describe('components/news/highlights', () => {
  it('returns null when items empty', () => {
    const { container } = render(<NewsHighlights items={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders correct block based on latest item count', () => {
    const { rerender } = render(<NewsHighlights items={makeItems(1)} />)
    expect(screen.getByText('Block1')).toBeInTheDocument()

    rerender(<NewsHighlights items={makeItems(2)} />)
    expect(screen.getByText('Block2')).toBeInTheDocument()

    rerender(<NewsHighlights items={makeItems(3)} />)
    expect(screen.getByText('Block3')).toBeInTheDocument()

    rerender(<NewsHighlights items={makeItems(4)} />)
    expect(screen.getByText('Block4')).toBeInTheDocument()
  })
})

