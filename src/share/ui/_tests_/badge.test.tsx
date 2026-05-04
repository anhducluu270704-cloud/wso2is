
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Badge, badgeVariants } from '@/share/ui/badge'

jest.mock('radix-ui', () => ({
  Slot: {
    Root: ({ children, ...props }: { children: React.ReactNode; [k: string]: unknown }) =>
      React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<Record<string, unknown>>, props)
        : <span {...props}>{children}</span>,
  },
}))

describe('share/ui/badge', () => {
  it('render badge text', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('render badge với variant và className', () => {
    render(
      <Badge variant="positive" className="custom-badge">
        Positive
      </Badge>
    )

    const badge = screen.getByText('Positive')
    expect(badge).toHaveAttribute('data-variant', 'positive')
    expect(badge).toHaveClass('custom-badge')
  })

  it('render Badge asChild', () => {
    render(<Badge asChild><a href="/">Link badge</a></Badge>)
    const link = screen.getByRole('link', { name: 'Link badge' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('data-variant', 'active')
  })

  it('trả class từ badgeVariants', () => {
    expect(badgeVariants({ variant: 'inactive' })).toContain('bg-grey-10')
    expect(badgeVariants({ variant: 'active' })).toContain('bg-green-2')
  })
})