import React from 'react'
import { render, screen } from '@testing-library/react'

jest.mock('@/share/ui/accordion', () => ({
  Accordion: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="accordion">{children}</div>
  ),
  AccordionItem: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AccordionTrigger: ({ children }: { children: React.ReactNode }) => (
    <button type="button">{children}</button>
  ),
  AccordionContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}))

import GuideSection from '../index'

describe('GuideSection', () => {
  it('hiển thị tiêu đề và các bước hướng dẫn', () => {
    render(<GuideSection />)
    expect(screen.getByTestId('accordion')).toBeInTheDocument()
    expect(screen.getByText('tryout.guide.title')).toBeInTheDocument()
    expect(screen.getByText('tryout.guide.step3_li1')).toBeInTheDocument()
  })
})
