
/**
 * Unit test: components/full-page/404
 */

import { render, screen } from '@testing-library/react'
import NotFound404 from '../404'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}))
jest.mock('@/share/icons', () => ({ Error404: () => <span>Error404</span> }))
jest.mock('@/share/ui/button', () => ({
  Button: ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) =>
    asChild ? <>{children}</> : <button>{children}</button>,
}))
jest.mock('@/share/ui/empty', () => ({
  Empty: ({ children }: { children: React.ReactNode }) => <div data-testid="empty">{children}</div>,
  EmptyHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  EmptyContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  EmptyTitle: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
  EmptyDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
}))
jest.mock('../error-layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('components/full-page/404', () => {
  it('render layout 404', () => {
    render(<NotFound404 />)
    expect(screen.getByTestId('empty')).toBeInTheDocument()
    expect(screen.getByText('Error404')).toBeInTheDocument()
  })

  it('hiển thị message và code tuỳ chỉnh khi truyền props', () => {
    render(<NotFound404 message="Custom message" code="500" />)
    expect(screen.getByText('Custom message')).toBeInTheDocument()
    expect(screen.getByText(/500/)).toBeInTheDocument()
  })
})
