
import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '@/share/ui/breadcrumb'

jest.mock('radix-ui', () => ({
  Slot: {
    Root: ({ children, ...p }: any) =>
      React.isValidElement(children)
        ? React.cloneElement(children, p)
        : <span {...p}>{children}</span>,
  },
}))
jest.mock('lucide-react', () => ({
  ChevronRightIcon: () => <span data-testid="chevron" />,
  MoreHorizontalIcon: () => <span data-testid="more" />,
}))

describe('share/ui/breadcrumb', () => {
  it('render Breadcrumb và BreadcrumbList', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>Item</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
    expect(document.querySelector('[data-slot="breadcrumb"]')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="breadcrumb-list"]')).toBeInTheDocument()
    expect(screen.getByText('Item')).toBeInTheDocument()
  })
  it('render BreadcrumbLink', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
    const link = screen.getByRole('link', { name: 'Home' })
    expect(link).toHaveAttribute('href', '/')
  })

  it('render BreadcrumbLink asChild', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <a href="/docs">Docs</a>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )

    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs')
  })
  it('render BreadcrumbPage', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
    expect(document.querySelector('[data-slot="breadcrumb-page"]')).toHaveTextContent('Current')
  })
  it('render BreadcrumbSeparator', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">A</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>B</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
    expect(document.querySelector('[data-slot="breadcrumb-separator"]')).toBeInTheDocument()
  })

  it('render BreadcrumbSeparator với children custom', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbSeparator>
            <span data-testid="custom-separator">/</span>
          </BreadcrumbSeparator>
        </BreadcrumbList>
      </Breadcrumb>
    )

    expect(screen.getByTestId('custom-separator')).toBeInTheDocument()
    expect(screen.queryByTestId('chevron')).not.toBeInTheDocument()
  })
  it('render BreadcrumbEllipsis', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
    expect(document.querySelector('[data-slot="breadcrumb-ellipsis"]')).toBeInTheDocument()
    expect(screen.getByText('More')).toBeInTheDocument()
  })
})
