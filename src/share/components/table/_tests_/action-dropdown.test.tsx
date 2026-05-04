/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { render, screen } from '@testing-library/react'

jest.mock('@/share/lib/utils', () => ({
  cn: (...inputs: unknown[]) =>
    (inputs as (string | false | undefined | null)[])
      .flat()
      .filter((x): x is string => Boolean(x))
      .join(' '),
}))

jest.mock('@/share/ui/button', () => ({
  Button: ({
    children,
    className,
    variant: _variant,
    ...rest
  }: React.PropsWithChildren<
    React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }
  >) => (
    <button type="button" className={className} data-testid="action-trigger" {...rest}>
      {children}
    </button>
  ),
}))

jest.mock('@/share/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-root">{children}</div>
  ),
  DropdownMenuTrigger: ({
    children,
    asChild: _asChild,
  }: {
    children: React.ReactNode
    asChild?: boolean
  }) => <div data-testid="dropdown-trigger">{children}</div>,
  DropdownMenuContent: ({
    children,
    className,
    align: _align,
  }: {
    children: React.ReactNode
    className?: string
    align?: string
  }) => (
    <div data-testid="dropdown-content" className={className}>
      {children}
    </div>
  ),
}))

jest.mock('lucide-react', () => ({
  Ellipsis: (props: Record<string, unknown>) => (
    <span data-testid="ellipsis" {...props} />
  ),
}))

import ActionTableDropdown from '../action-dropdown'

describe('ActionTableDropdown', () => {
  it('renders children inside menu content', () => {
    render(
      <ActionTableDropdown>
        <span>Menu item</span>
      </ActionTableDropdown>,
    )

    expect(screen.getByTestId('dropdown-content')).toHaveTextContent('Menu item')
  })

  it('renders trigger button and ellipsis icon', () => {
    render(
      <ActionTableDropdown>
        <span>Item</span>
      </ActionTableDropdown>,
    )

    expect(screen.getByTestId('action-trigger')).toBeInTheDocument()
    expect(screen.getByTestId('ellipsis')).toBeInTheDocument()
  })

  it('merges className onto content via cn', () => {
    render(
      <ActionTableDropdown className="custom-panel">
        <span>X</span>
      </ActionTableDropdown>,
    )

    const content = screen.getByTestId('dropdown-content')
    expect(content.className).toMatch(/custom-panel/)
  })
})
