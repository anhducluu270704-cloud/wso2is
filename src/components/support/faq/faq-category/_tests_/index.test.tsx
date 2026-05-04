
import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  FAQ_CATEGORY_EN_ACCOUNT_REGISTRATION,
  FAQ_CATEGORY_EN_AUTHENTICATION,
} from '@/constants/support'
import { FaqCategory } from '../index'
import { MOCK_FAQ_CATEGORIES } from '@/components/support/mock/faq'

jest.mock('@/share/hooks/use-check-locale', () => ({
  useCheckLocale: () => false,
}))

jest.mock('@/share/ui/accordion', () => ({
  Accordion: ({ children }: any) => <div data-testid="accordion">{children}</div>,
  AccordionContent: ({ children }: any) => <div data-testid="accordion-content">{children}</div>,
  AccordionItem: ({ children }: any) => <div data-testid="accordion-item">{children}</div>,
  AccordionTrigger: ({ children }: any) => <button type="button" data-testid="accordion-trigger">{children}</button>,
}))

describe('support/faq/faq-category', () => {
  it('returns null when faqArticle is empty', () => {
    const { container } = render(
      <FaqCategory
        category={{
          categoryId: 'empty',
          categoryNameEn: 'X',
          categoryNameVi: 'Y',
          faqArticle: [],
        }}
      />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders category label and accordion with items', () => {
    const cat = MOCK_FAQ_CATEGORIES.find(
      (c) => c.categoryNameEn === FAQ_CATEGORY_EN_ACCOUNT_REGISTRATION,
    )!
    const category = {
      ...cat,
      faqArticle: cat.faqArticle.slice(0, 2),
    }
    render(<FaqCategory category={category} />)
    expect(screen.getByText(category.categoryNameEn)).toBeInTheDocument()
    expect(screen.getByTestId('accordion')).toBeInTheDocument()
    expect(screen.getAllByTestId('accordion-item')).toHaveLength(category.faqArticle.length)
    expect(screen.getByText(category.faqArticle[0].articleTitleEn)).toBeInTheDocument()
    expect(screen.getByText(category.faqArticle[0].descriptionEn)).toBeInTheDocument()
  })

  it('renders authentication category', () => {
    const cat = MOCK_FAQ_CATEGORIES.find(
      (c) => c.categoryNameEn === FAQ_CATEGORY_EN_AUTHENTICATION,
    )!
    const category = {
      ...cat,
      faqArticle: cat.faqArticle.slice(0, 1),
    }
    render(<FaqCategory category={category} />)
    expect(screen.getByText(category.categoryNameEn)).toBeInTheDocument()
    expect(screen.getByText(category.faqArticle[0].articleTitleEn)).toBeInTheDocument()
  })
})
