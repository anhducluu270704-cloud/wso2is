import React from 'react'
import { render, screen } from '@testing-library/react'
import { ListGridEmptyState } from '../empty-state'

jest.mock('@/share/ui/empty', () => ({
  Empty: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="empty-ui">{children}</div>
  ),
  EmptyHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  EmptyTitle: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
  EmptyDescription: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}))

describe('list-grid/ListGridEmptyState', () => {
  it('khi không search: dùng Empty với title và mô tả', () => {
    render(
      <ListGridEmptyState
        noProductsTitle="No items"
        noProductsDescription="Desc"
      />
    )
    expect(screen.getByText('No items')).toBeInTheDocument()
    expect(screen.getByText('Desc')).toBeInTheDocument()
    expect(screen.getByTestId('empty-ui')).toBeInTheDocument()
  })

  it('khi có search: hiện dòng tìm kiếm và block phụ', () => {
    render(
      <ListGridEmptyState
        searchQuery="q"
        searchLine="Result for q"
        noProductsTitle="No match"
        noProductsDescription="Try again"
      />
    )
    expect(screen.getByText('Result for q')).toBeInTheDocument()
    expect(screen.getByText('No match')).toBeInTheDocument()
    expect(screen.getByText('Try again')).toBeInTheDocument()
  })
})
