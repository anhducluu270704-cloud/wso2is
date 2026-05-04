
import React from 'react'
import { render, screen } from '@testing-library/react'
import SupportWrapper from '../index'

const mockOnSearchChange = jest.fn()
jest.mock('@/providers/filter-provider', () => ({
  useFilter: jest.fn(() => ({ filter: { keyword: '' }, onSearchChange: mockOnSearchChange })),
}))
jest.mock('@/services/support/support.query-options', () => ({
  useGetSupportList: jest.fn(() => ({
    data: undefined,
    isPending: false,
    isError: false,
  })),
}))
jest.mock('next-intl', () => ({ useTranslations: () => (k: string) => k }))
jest.mock('@/share/layout/end-user/page', () => ({ __esModule: true, default: ({ children, title }: any) => <div><h1>{title}</h1>{children}</div> }))
jest.mock('@/share/components/input/search', () => ({
  __esModule: true,
  default: ({ value, onChange, placeholder }: any) => (
    <input value={value ?? ''} onChange={onChange} placeholder={placeholder} data-testid="search-input" />
  ),
}))
jest.mock('../faq', () => ({ FaqList: () => <div>FaqList</div> }))
jest.mock('../empty-state', () => ({
  SupportEmptyState: ({ searchQuery }: { searchQuery: string }) => (
    <div data-testid="support-search-empty">empty:{searchQuery}</div>
  ),
}))
jest.mock('../contact', () => ({ SupportContact: () => <div>SupportContact</div> }))

const useFilter = require('@/providers/filter-provider').useFilter
const useGetSupportList = require('@/services/support/support.query-options')
  .useGetSupportList as jest.Mock

describe('support', () => {
  beforeEach(() => {
    useFilter.mockReturnValue({
      filter: { keyword: '' },
      onSearchChange: mockOnSearchChange,
    })
    useGetSupportList.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: false,
    })
  })

  it('render SupportWrapper', () => {
    render(<SupportWrapper />)
    expect(screen.getByText('FaqList')).toBeInTheDocument()
    expect(screen.getByText('SupportContact')).toBeInTheDocument()
  })

  it('passes empty value to SearchInput when filter.keyword is empty', () => {
    useFilter.mockReturnValue({ filter: { keyword: '' }, onSearchChange: mockOnSearchChange })
    render(<SupportWrapper />)
    expect(screen.getByTestId('search-input')).toHaveValue('')
  })

  it('passes filter.keyword to SearchInput when defined', () => {
    useFilter.mockReturnValue({ filter: { keyword: 'test query' }, onSearchChange: mockOnSearchChange })
    render(<SupportWrapper />)
    expect(screen.getByTestId('search-input')).toHaveValue('test query')
  })

  it('passes empty value when filter.keyword is undefined', () => {
    useFilter.mockReturnValue({ filter: { keyword: undefined }, onSearchChange: mockOnSearchChange })
    render(<SupportWrapper />)
    expect(screen.getByTestId('search-input')).toHaveValue('')
  })

  it('khi có từ khóa nhưng không có FAQ khớp, hiển thị SupportEmptyState', () => {
    useFilter.mockReturnValue({
      filter: { keyword: 'nomatch' },
      onSearchChange: mockOnSearchChange,
    })
    useGetSupportList.mockReturnValue({
      data: {
        data: {
          count: 1,
          list: [
            {
              categoryId: '1',
              categoryNameVi: 'V',
              categoryNameEn: 'E',
              faqArticle: [
                {
                  id: 'a',
                  articleTitleEn: 'Hello',
                  articleTitleVi: 'Xin chào',
                  descriptionEn: 'd',
                  descriptionVi: 'm',
                  createdAt: '2024-01-01T00:00:00.000Z',
                },
              ],
            },
          ],
        },
      },
      isPending: false,
      isError: false,
    })
    render(<SupportWrapper />)
    expect(screen.getByTestId('support-search-empty')).toHaveTextContent('empty:nomatch')
    expect(screen.queryByText('FaqList')).toBeNull()
  })
})