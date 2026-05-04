import React from 'react'
import { render, screen, fireEvent, createEvent } from '@testing-library/react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/share/ui/pagination'

jest.mock('@/share/ui/button', () => ({
  Button: ({ children, asChild, onClick, ...p }: any) =>
    asChild ? (
      <>{children}</>
    ) : (
      <button type="button" onClick={onClick} {...p}>
        {children}
      </button>
    ),
}))
jest.mock('lucide-react', () => ({
  ChevronLeftIcon: () => <span data-testid="chevron-left" />,
  ChevronRightIcon: () => <span data-testid="chevron-right" />,
  MoreHorizontalIcon: () => <span data-testid="ellipsis-icon" />,
}))

describe('share/ui/pagination', () => {
  it('render Pagination với content và link', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    expect(
      screen.getByRole('navigation', { name: 'pagination' })
    ).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })
  it('render PaginationLink isActive và disabled', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" disabled>
              3
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    const activeLink = screen.getByRole('link', { name: '2', current: 'page' })
    const disabledLink = screen.getByRole('button', { name: '3' })
    expect(activeLink).toHaveAttribute('aria-current', 'page')
    expect(disabledLink).toHaveAttribute('aria-disabled', 'true')
  })
  it('PaginationLink onClick khi không disabled', () => {
    const onClick = jest.fn()
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" onClick={onClick}>
              1
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    fireEvent.click(screen.getByText('1'))
    expect(onClick).toHaveBeenCalled()
  })
  it('PaginationLink disabled không gọi onClick', () => {
    const onClick = jest.fn()
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" disabled onClick={onClick}>
              1
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    fireEvent.click(screen.getByText('1'))
    expect(onClick).not.toHaveBeenCalled()
  })
  it('PaginationLink keydown Space sẽ trigger click khi không disabled', () => {
    const onClick = jest.fn()
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" onClick={onClick}>
              1
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )

    fireEvent.keyDown(screen.getByText('1'), { key: ' ' })

    expect(onClick).toHaveBeenCalled()
  })
  it('PaginationLink disabled keydown sẽ prevent default và không click', () => {
    const onClick = jest.fn()
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" disabled onClick={onClick}>
              1
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )

    const btn = screen.getByRole('button', { name: '1' })
    fireEvent.keyDown(btn, { key: 'Enter' })

    expect(onClick).not.toHaveBeenCalled()
  })
  it('render PaginationPrevious với text', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationPrevious href="#" text="Previous" />
        </PaginationContent>
      </Pagination>
    )
    expect(
      screen.getByRole('link', { name: /go to previous page/i })
    ).toBeInTheDocument()
    expect(screen.getByText('Previous')).toBeInTheDocument()
  })
  it('render PaginationNext với text', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationNext href="#" text="Next" />
        </PaginationContent>
      </Pagination>
    )
    expect(
      screen.getByRole('link', { name: /go to next page/i })
    ).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
  })

  it('render PaginationPrevious và PaginationNext không có text', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationPrevious href="#" />
          <PaginationNext href="#" />
        </PaginationContent>
      </Pagination>
    )

    expect(
      screen.getByRole('link', { name: /go to previous page/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /go to next page/i })
    ).toBeInTheDocument()
    expect(screen.queryByText('Previous')).not.toBeInTheDocument()
    expect(screen.queryByText('Next')).not.toBeInTheDocument()
  })

  it('render PaginationEllipsis', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    expect(
      document.querySelector('[data-slot="pagination-ellipsis"]')
    ).toBeInTheDocument()
    expect(screen.getByText('More pages')).toBeInTheDocument()
  })
})
