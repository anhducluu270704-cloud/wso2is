
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Button, buttonVariants } from '@/share/ui/button'

jest.mock('radix-ui', () => ({
  Slot: {
    Root: ({ children, ...props }: { children: React.ReactNode; [k: string]: unknown }) =>
      React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<Record<string, unknown>>, props)
        : <div data-slot="button" {...props}>{children}</div>,
  },
}))

describe('share/ui/button', () => {
  it('render children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('render với variant và size', () => {
    render(
      <Button variant="outline" size="sm">
        Outline
      </Button>
    )
    expect(screen.getByText('Outline')).toBeInTheDocument()
  })

  it('render với fullWidth rounded linked', () => {
    render(
      <Button fullWidth rounded linked variant="secondary" className="custom-button">
        Linked
      </Button>
    )

    const button = screen.getByRole('button', { name: 'Linked' })
    expect(button).toHaveAttribute('data-variant', 'secondary')
    expect(button).toHaveAttribute('data-size', 'default')
    expect(button).toHaveClass('custom-button')
  })

  it('render Button asChild', () => {
    render(<Button asChild><a href="/home">Link button</a></Button>)
    const link = screen.getByRole('link', { name: 'Link button' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/home')
  })

  it('trả class từ buttonVariants', () => {
    expect(
      buttonVariants({ variant: 'outline', size: 'icon-sm', linked: true })
    ).toContain('border')
    expect(buttonVariants({ variant: 'select', fullWidth: true, rounded: true })).toContain(
      'w-full'
    )
  })
})