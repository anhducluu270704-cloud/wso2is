
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PaginationView from '../index'

jest.mock('@/share/ui/pagination', () => ({
  Pagination: ({ children }: any) => <nav>{children}</nav>,
  PaginationContent: ({ children }: any) => <ul>{children}</ul>,
  PaginationItem: ({ children }: any) => <li>{children}</li>,
  PaginationLink: ({ children, onClick }: any) => <a href="#" onClick={onClick}>{children}</a>,
  PaginationNext: ({ onClick }: any) => <span onClick={onClick}>Next</span>,
  PaginationPrevious: ({ onClick }: any) => <span onClick={onClick}>Prev</span>,
  PaginationEllipsis: () => <span>…</span>,
}))

describe('share/components/pagination', () => {
  it('render PaginationView với currentPage và totalPages', () => {
    render(
      <PaginationView
        currentPage={1}
        totalPages={5}
        onPageChange={jest.fn()}
      />
    )
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('return null khi totalPages <= 0', () => {
    const { container } = render(
      <PaginationView currentPage={1} totalPages={0} onPageChange={jest.fn()} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('gọi onPageChange khi click page number', async () => {
    const onPageChange = jest.fn()
    render(
      <PaginationView currentPage={2} totalPages={5} onPageChange={onPageChange} />
    )
    await userEvent.click(screen.getByText('3'))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('hiển thị ellipsis khi currentPage > 3', () => {
    render(
      <PaginationView currentPage={5} totalPages={10} onPageChange={jest.fn()} />
    )
    expect(screen.getAllByText('…').length).toBeGreaterThanOrEqual(1)
  })

  it('hiển thị ellipsis khi currentPage < totalPages - 2', () => {
    render(
      <PaginationView currentPage={2} totalPages={10} onPageChange={jest.fn()} />
    )
    expect(screen.getAllByText('…').length).toBeGreaterThanOrEqual(1)
  })

  it('click Prev gọi onPageChange(currentPage - 1)', async () => {
    const onPageChange = jest.fn()
    render(
      <PaginationView currentPage={3} totalPages={5} onPageChange={onPageChange} />
    )
    await userEvent.click(screen.getByText('Prev'))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('click Next gọi onPageChange(currentPage + 1)', async () => {
    const onPageChange = jest.fn()
    render(
      <PaginationView currentPage={2} totalPages={5} onPageChange={onPageChange} />
    )
    await userEvent.click(screen.getByText('Next'))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })
})