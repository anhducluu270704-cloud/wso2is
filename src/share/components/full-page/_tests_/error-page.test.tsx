import { render, screen } from '@testing-library/react'
import ErrorPage from '../error-page'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))
jest.mock('@/share/icons', () => ({ Error404: () => <span>Error404</span> }))
jest.mock('@/share/ui/button', () => ({
  Button: ({
    children,
    asChild,
  }: {
    children: React.ReactNode
    asChild?: boolean
  }) => (asChild ? <>{children}</> : <button>{children}</button>),
}))
jest.mock('@/share/ui/empty', () => ({
  Empty: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="empty">{children}</div>
  ),
  EmptyHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  EmptyContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  EmptyTitle: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
  EmptyDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
}))
jest.mock('../error-layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('components/full-page/error-page', () => {
  it('renders default translations and fallback code', () => {
    render(<ErrorPage defaultCode="401" />)

    expect(screen.getByTestId('empty')).toBeInTheDocument()
    expect(screen.getByText('Error404')).toBeInTheDocument()
    expect(screen.getByText('error.title')).toBeInTheDocument()
    expect(screen.getByText('error.description')).toBeInTheDocument()
    expect(screen.getByText(/401/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'btn.got_it' })).toHaveAttribute(
      'href',
      '/'
    )
  })

  it('renders provided message and code', () => {
    render(<ErrorPage message="No permission" code="AUTH_401" defaultCode="401" />)

    expect(screen.getByText('No permission')).toBeInTheDocument()
    expect(screen.getByText(/AUTH_401/)).toBeInTheDocument()
  })
})
