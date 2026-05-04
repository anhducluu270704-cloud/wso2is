
import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, jest } from '@jest/globals'

jest.mock('@/share/ui/empty', () => ({
  Empty: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  EmptyHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  EmptyContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  EmptyTitle: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  EmptyDescription: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

jest.mock('@/share/ui/button', () => ({
  Button: ({ children }: { children: React.ReactNode }) => (
    <button type="button">{children}</button>
  ),
}))

jest.mock('@/share/components/full-page/error-layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="full-page-layout">{children}</div>
  ),
}))

jest.mock('@/share/icons', () => ({
  Error404: () => <div>Error404Icon</div>,
  Overlay: () => <div data-testid="overlay-mock" />,
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode
    href: string
  }) => (
    <a href={href} data-testid="link">
      {children}
    </a>
  ),
}))

describe('Global 404 NotFound404', () => {
  it('renders 404 content and link to home', async () => {
    const { default: NotFound404 } = await import('../../not-found')

    render(<NotFound404 />)
    expect(screen.getByTestId('full-page-layout')).toBeInTheDocument()
    expect(screen.getByText('Error404Icon')).toBeInTheDocument()

    expect(
      screen.getByText('Uh-oh, service interrupted')
    ).toBeInTheDocument()
    expect(
      screen.getByText('The system is unable to process your request')
    ).toBeInTheDocument()
    expect(screen.getByText('Support code: 404')).toBeInTheDocument()

    const link = screen.getByTestId('link')
    expect(link).toHaveAttribute('href', '/')
    expect(screen.getByText('Got it')).toBeInTheDocument()
  })
})

