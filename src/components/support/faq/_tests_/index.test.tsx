
import React from 'react'
import { render, screen } from '@testing-library/react'
import { FaqList } from '../index'
import type { FaqCategory } from '@/services/support/support.schema'

jest.mock('../faq-category', () => ({
  FaqCategory: ({ category }: { category: FaqCategory }) => (
    <div data-testid="faq-cat">{category.faqArticle.length}</div>
  ),
}))

describe('support/faq', () => {
  it('render FaqList với categories', () => {
    const categories: FaqCategory[] = [
      {
        categoryId: '1',
        categoryNameVi: 'Đăng ký',
        categoryNameEn: 'Account registration',
        faqArticle: [
          {
            id: '1',
            articleTitleEn: 'Q?',
            articleTitleVi: 'H?',
            descriptionEn: 'A',
            descriptionVi: 'Trả lời',
            createdAt: '2024-01-01T00:00:00.000Z',
          },
        ],
      },
    ]
    render(<FaqList categories={categories} />)
    expect(screen.getByTestId('faq-cat')).toBeInTheDocument()
  })

  it('không render category không có articles', () => {
    const categories: FaqCategory[] = [
      { categoryId: 'empty', categoryNameVi: 'E', categoryNameEn: 'Empty', faqArticle: [] },
    ]
    const { container } = render(<FaqList categories={categories} />)
    expect(container.querySelector('[data-testid="faq-cat"]')).toBeNull()
  })
})
